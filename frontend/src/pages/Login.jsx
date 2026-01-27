import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { saveAuth } from "../auth/auth";
import AuthLayout from "../components/AuthLayout";
import { validateEmail, validateRequired } from "../utils/validation";

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="#333" strokeWidth="2" />
      <path d="M4 20a8 8 0 0 1 16 0" stroke="#333" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M7 11V8a5 5 0 0 1 10 0v3" stroke="#333" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 11h12v10H6V11Z" stroke="#333" strokeWidth="2" />
    </svg>
  );
}

export default function Login() {
  const nav = useNavigate();

  const [role, setRole] = useState("CITIZEN");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  // Validation errors
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Handle email change with validation
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(""); // Clear error on change
  };

  // Handle email blur (validate when user leaves field)
  const handleEmailBlur = () => {
    const validation = validateEmail(email);
    if (!validation.valid) {
      setEmailError(validation.message);
    }
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(""); // Clear error on change
  };

  // Handle password blur
  const handlePasswordBlur = () => {
    const validation = validateRequired(password, "Password");
    if (!validation.valid) {
      setPasswordError(validation.message);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    // Validate all fields before submission
    const emailValidation = validateEmail(email);
    const passwordValidation = validateRequired(password, "Password");

    if (!emailValidation.valid) {
      setEmailError(emailValidation.message);
      return;
    }

    if (!passwordValidation.valid) {
      setPasswordError(passwordValidation.message);
      return;
    }

    try {
      const res = await api.post("/api/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      // Validate response data
      if (!token || !user) {
        setErr("Invalid response from server. Please try again.");
        return;
      }

      // Role validation (important for security)
      if (user.role !== role) {
        setErr("Selected role does not match your account");
        return;
      }

      // Save token + user
      saveAuth(token, user);

      // Role-based redirect
      if (user.role === "GN") {
        nav("/gn");
      } else if (user.role === "ADMIN") {
        nav("/admin-dashboard");
      } else {
        nav("/citizen");
      }
    } catch (ex) {
      console.error('Login error:', ex);

      // Handle different error types
      if (ex.response) {
        // Server responded with error status
        const status = ex.response.status;
        const errorMsg = ex.response.data?.error;

        if (status === 401) {
          setErr("Invalid email or password");
        } else if (status === 403) {
          setErr("Your account is inactive. Please contact support.");
        } else if (status === 400) {
          setErr(errorMsg || "Please check your input");
        } else {
          setErr(errorMsg || "Login failed. Please try again.");
        }
      } else if (ex.request) {
        // Request made but no response
        setErr("Cannot connect to server. Please check your connection.");
      } else {
        // Something else happened
        setErr("An unexpected error occurred. Please try again.");
      }
    }
  };


  return (
    <AuthLayout
      titleLine1="GRAMA NILADHARI DIVISION"
      titleLine2="MASPANNA"
    >
      {err && <div className="msg-err">{err}</div>}

      <h2 className="sub-title">Sign In</h2>
      <div className="sub-desc">Access your account</div>

      <form onSubmit={onSubmit}>
        <label className="label">Select User Role</label>
        <select className="select" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="CITIZEN">Citizen</option>
          <option value="GN">GN Officer</option>
          <option value="ADMIN">Administrative Staff</option>
        </select>

        <label className="label">Email Address</label>
        <div className="field">
          <span className="icon"><UserIcon /></span>
          <input
            className={`input ${emailError ? 'input-error' : ''}`}
            value={email}
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            placeholder="you@example.com"
          />
        </div>
        {emailError && <div className="field-error">{emailError}</div>}

        <label className="label">Password</label>
        <div className="field">
          <span className="icon"><LockIcon /></span>
          <input
            className={`input ${passwordError ? 'input-error' : ''}`}
            type="password"
            value={password}
            onChange={handlePasswordChange}
            onBlur={handlePasswordBlur}
            placeholder="••••••••"
          />
        </div>
        {passwordError && <div className="field-error">{passwordError}</div>}

        <button className="btn-main">Sign In</button>

        <div className="link-row">
          Forgot Password ?<Link to="/forgot-password">Forgot Password ?</Link>
        </div>

        <div className="center-links">
          Don't have an account? <Link to="/register">Register as citizen</Link>
        </div>
      </form>
    </AuthLayout>
  );
}
