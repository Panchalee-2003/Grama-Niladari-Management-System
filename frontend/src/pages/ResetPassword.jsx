import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/api";
import AuthLayout from "../components/AuthLayout";

function LockIcon() {
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

export default function ResetPassword() {
  const nav = useNavigate();
  const location = useLocation();
  const verificationToken = location.state?.verificationToken || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!verificationToken) {
      setErr(
        "Verification token not found. Please start from forgot password page.",
      );
      return;
    }

    if (!newPassword || !confirmPassword) {
      setErr("Please enter both password fields");
      return;
    }

    if (newPassword.length < 8) {
      setErr("Password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErr("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await api.post("/api/auth/reset-password", {
        verificationToken,
        newPassword,
      });

      // Show success and redirect to login
      alert(
        "Password reset successfully! Please login with your new password.",
      );
      nav("/login");
    } catch (ex) {
      console.error("Reset password error:", ex);

      if (ex.response) {
        const status = ex.response.status;
        const errorMsg = ex.response.data?.error;

        if (status === 401) {
          setErr("Verification token expired. Please start over.");
        } else if (status === 400) {
          setErr(errorMsg || "Invalid password");
        } else {
          setErr(errorMsg || "Failed to reset password. Please try again.");
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
    <AuthLayout title="Reset Password" subtitle="Enter your new password">
      {err && <div className="msg-err">{err}</div>}

      <form onSubmit={onSubmit}>
        <label className="label">New Password</label>
        <div className="field">
          <span className="icon">
            <LockIcon />
          </span>
          <input
            className="input"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            disabled={loading}
          />
        </div>

        <label className="label">Confirm Password</label>
        <div className="field">
          <span className="icon">
            <LockIcon />
          </span>
          <input
            className="input"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            disabled={loading}
          />
        </div>

        <button className="btn-main" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </AuthLayout>
  );
}
