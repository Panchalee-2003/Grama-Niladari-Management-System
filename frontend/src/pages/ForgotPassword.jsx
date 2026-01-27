import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import AuthLayout from "../components/AuthLayout";

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 6h16v12H4V6Z" stroke="#333" strokeWidth="2" />
      <path d="m4 7 8 6 8-6" stroke="#333" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function ForgotPassword() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setSuccess("");

    if (!email) {
      setErr("Please enter your email address");
      return;
    }

    if (!email.includes('@')) {
      setErr("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/api/auth/forgot-password", { email });

      setSuccess(res.data.message);

      // Navigate to OTP verification page after 2 seconds
      setTimeout(() => {
        nav("/verify-otp", { state: { email } });
      }, 2000);

    } catch (ex) {
      console.error('Forgot password error:', ex);

      if (ex.response) {
        const errorMsg = ex.response.data?.error;
        setErr(errorMsg || "Failed to send OTP. Please try again.");
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
      title="Forgot Password"
      subtitle="Enter your email to receive an OTP"
    >
      {err && <div className="msg-err">{err}</div>}
      {success && <div className="msg-ok">{success}</div>}

      <form onSubmit={onSubmit}>
        <label className="label">Email Address</label>
        <div className="field">
          <span className="icon"><MailIcon /></span>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={loading}
          />
        </div>

        <button className="btn-main" disabled={loading}>
          {loading ? "Sending..." : "Send OTP"}
        </button>

        <div className="center-links">
          Remember your password? <a href="/login">Sign In</a>
        </div>
      </form>
    </AuthLayout>
  );
}
