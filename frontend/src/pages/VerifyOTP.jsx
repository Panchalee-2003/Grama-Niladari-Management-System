import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/api";
import AuthLayout from "../components/AuthLayout";

function KeyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 11V8a5 5 0 0 1 10 0v3"
        stroke="#333"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M6 11h12v10H6V11Z" stroke="#333" strokeWidth="2" />
    </svg>
  );
}

export default function VerifyOTP() {
  const nav = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [otp, setOTP] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!email) {
      setErr("Email not found. Please start from forgot password page.");
      return;
    }

    if (!otp || otp.length !== 6) {
      setErr("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/api/auth/verify-otp", { email, otp });

      const { verificationToken } = res.data;

      // Navigate to reset password page with token
      nav("/reset-password", { state: { verificationToken } });
    } catch (ex) {
      console.error("Verify OTP error:", ex);

      if (ex.response) {
        const status = ex.response.status;
        const errorMsg = ex.response.data?.error;

        if (status === 401) {
          setErr(errorMsg || "Invalid or expired OTP");
        } else {
          setErr(errorMsg || "Failed to verify OTP. Please try again.");
        }
      } else if (ex.request) {
        setErr("Cannot connect to server. Please check your connection.");
      } else {
        setErr("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Verify OTP"
      subtitle="Enter the 6-digit code from your terminal"
    >
      {err && <div className="msg-err">{err}</div>}

      <form onSubmit={onSubmit}>
        <div
          style={{
            marginBottom: "1rem",
            padding: "1rem",
            background: "#f0f8ff",
            borderRadius: "8px",
            border: "1px solid #0066cc",
          }}
        >
          <p style={{ margin: 0, fontSize: "14px", color: "#0066cc" }}>
            📟 Check your backend terminal for the OTP code
          </p>
        </div>

        <label className="label">OTP Code</label>
        <div className="field">
          <span className="icon">
            <KeyIcon />
          </span>
          <input
            className="input"
            type="text"
            value={otp}
            onChange={(e) =>
              setOTP(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="123456"
            maxLength={6}
            disabled={loading}
            style={{
              letterSpacing: "0.5em",
              fontSize: "1.2em",
              textAlign: "center",
            }}
          />
        </div>

        <button className="btn-main" disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <div className="center-links">
          Didn't receive OTP? <a href="/forgot-password">Resend</a>
        </div>
      </form>
    </AuthLayout>
  );
}
