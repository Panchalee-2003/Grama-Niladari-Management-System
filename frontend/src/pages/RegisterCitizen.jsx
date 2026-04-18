import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import AuthLayout from "../components/AuthLayout";
import { saveAuth } from "../auth/auth";
import {
  validateName,
  validateNIC,
  validateEmail,
  validatePhone,
  validatePassword,
  validatePasswordMatch,
  getPasswordStrength,
} from "../utils/validation";

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconUser() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="#000" strokeWidth="2" />
      <path d="M4 20a8 8 0 0 1 16 0" stroke="#000" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconId() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 7h16v10H4V7Z" stroke="#000" strokeWidth="2" />
      <path d="M8 11h4" stroke="#000" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 14h6" stroke="#000" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconMail() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 6h16v12H4V6Z" stroke="#000" strokeWidth="2" />
      <path d="m4 7 8 6 8-6" stroke="#000" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconPhone() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M7 3h3l2 5-2 2c1 2 3 4 5 5l2-2 5 2v3c0 1-1 2-2 2-9 0-16-7-16-16 0-1 1-2 2-2Z"
        stroke="#000" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
function IconHome() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 10.5 12 3l9 7.5V21H3V10.5Z" stroke="#000" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 21v-6h6v6" stroke="#000" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
function IconLock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M7 11V8a5 5 0 0 1 10 0v3" stroke="#000" strokeWidth="2" strokeLinecap="round" />
      <rect x="5" y="11" width="14" height="11" rx="2" stroke="#000" strokeWidth="2" />
    </svg>
  );
}
function EyeIcon({ open }) {
  return open ? (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7S1 12 1 12Z" stroke="#555" strokeWidth="2" />
      <circle cx="12" cy="12" r="3" stroke="#555" strokeWidth="2" />
    </svg>
  ) : (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path d="M3 3l18 18" stroke="#555" strokeWidth="2" strokeLinecap="round" />
      <path d="M10.5 10.7a3 3 0 0 0 3.8 3.8" stroke="#555" strokeWidth="2" strokeLinecap="round" />
      <path d="M6.5 6.6C4.6 8 3 10 3 12c0 0 3.5 6 9 6a9.3 9.3 0 0 0 4.5-1.1"
        stroke="#555" strokeWidth="2" strokeLinecap="round" />
      <path d="M9.9 5.1A8.5 8.5 0 0 1 12 5c5.5 0 9 6 9 7 0 .5-.6 1.5-1.6 2.6"
        stroke="#555" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns "" for valid, or error string for invalid address */
function validateAddress(val) {
  if (!val.trim()) return "Resident address is required.";
  return "";
}

/** css class for an input based on error / touched state */
function inputClass(error, value) {
  if (error) return "input input-error";
  if (value.trim()) return "input input-success";
  return "input";
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RegisterCitizen() {
  const nav = useNavigate();

  // Form values
  const [full_name, setFullName] = useState("");
  const [nic, setNic] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  // Global messages
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  // Field-level errors
  const [nameError, setNameError] = useState("");
  const [nicError, setNicError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  // Show / hide toggles
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);

  // Password strength (from existing util)
  const passwordStrength = getPasswordStrength(password);

  // ── Change handlers ──────────────────────────────────────────────────────

  function handlePasswordChange(e) {
    const val = e.target.value;
    setPassword(val);
    setPasswordError("");
    // Keep confirm-error in sync whenever password changes
    if (confirm) {
      const cv = validatePasswordMatch(val, confirm);
      setConfirmError(cv.valid ? "" : cv.message);
    }
  }

  function handleConfirmChange(e) {
    const val = e.target.value;
    setConfirm(val);
    const cv = validatePasswordMatch(password, val);
    setConfirmError(cv.valid ? "" : cv.message);
  }

  // ── Blur handlers ────────────────────────────────────────────────────────

  const blurName = () => { const v = validateName(full_name); if (!v.valid) setNameError(v.message); };
  const blurNic = () => { const v = validateNIC(nic); if (!v.valid) setNicError(v.message); };
  const blurEmail = () => { const v = validateEmail(email); if (!v.valid) setEmailError(v.message); };
  const blurPhone = () => { const v = validatePhone(phone); if (!v.valid) setPhoneError(v.message); };
  const blurAddress = () => { const e = validateAddress(address); if (e) setAddressError(e); };
  const blurPw = () => { const v = validatePassword(password); if (!v.valid) setPasswordError(v.message); };
  const blurCpw = () => { const v = validatePasswordMatch(password, confirm); if (!v.valid) setConfirmError(v.message); };

  // ── Submit ───────────────────────────────────────────────────────────────

  async function submit(e) {
    e.preventDefault();
    setErr(""); setOk("");

    const nv = validateName(full_name);
    const niv = validateNIC(nic);
    const ev = validateEmail(email);
    const phv = validatePhone(phone);
    const av = validateAddress(address);
    const pwv = validatePassword(password);
    const cpv = validatePasswordMatch(password, confirm);

    setNameError(nv.valid ? "" : nv.message);
    setNicError(niv.valid ? "" : niv.message);
    setEmailError(ev.valid ? "" : ev.message);
    setPhoneError(phv.valid ? "" : phv.message);
    setAddressError(av);
    setPasswordError(pwv.valid ? "" : pwv.message);
    setConfirmError(cpv.valid ? "" : cpv.message);

    if (!nv.valid || !niv.valid || !ev.valid || !phv.valid || av || !pwv.valid || !cpv.valid) {
      setErr("Please fix all validation errors before submitting.");
      return;
    }

    try {
      await api.post("/api/auth/register", {
        full_name,
        email,
        password,
        nic_number: nic,
        phone_number: phone,
      });


      const loginRes = await api.post("/api/auth/login", { email, password });
      saveAuth(loginRes.data.token, loginRes.data.user);
      setOk("Account created successfully ✅");
      nav("/login");
    } catch (ex) {
      setErr(ex?.response?.data?.error || "Registration failed. Please try again.");
    }
  }

  // ── Password requirements checklist ─────────────────────────────────────

  const pwChecks = [
    { ok: password.length >= 8, text: "At least 8 characters" },
    { ok: /[A-Z]/.test(password), text: "One uppercase letter" },
    { ok: /[0-9]/.test(password), text: "One number" },
    { ok: /[^A-Za-z0-9]/.test(password), text: "One special character" },
  ];

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <AuthLayout
      title="Citizen Registration"
      subtitle="Create your account to access GN Division services"
    >
      {err && <div className="msg-err">{err}</div>}
      {ok && <div className="msg-ok">{ok}</div>}

      <form onSubmit={submit} noValidate>

        {/* ── Row 1: Full Name | NIC ─────────────────────────────────── */}
        <div className="form-grid">
          {/* Full Name */}
          <div>
            <div className="label-row">
              <span>Full Name</span>
              <span className="req-star">*</span>
            </div>
            <div className="field">
              <span className="icon"><IconUser /></span>
              <input
                className={inputClass(nameError, full_name)}
                value={full_name}
                onChange={(e) => { setFullName(e.target.value); setNameError(""); }}
                onBlur={blurName}
                placeholder="Samadhi Perera"
                autoComplete="name"
              />
            </div>
            {nameError && <div className="field-error">{nameError}</div>}
          </div>

          {/* NIC */}
          <div>
            <div className="label-row">
              <span>NIC Number</span>
              <span className="req-star">*</span>
            </div>
            <div className="field">
              <span className="icon"><IconId /></span>
              <input
                className={inputClass(nicError, nic)}
                value={nic}
                onChange={(e) => { setNic(e.target.value); setNicError(""); }}
                onBlur={blurNic}
                placeholder="123456789V or 199012345678"
                autoComplete="off"
                maxLength="12"
              />
            </div>
            {nicError && <div className="field-error">{nicError}</div>}
          </div>
        </div>

        {/* ── Row 2: Email | Phone ────────────────────────────────────── */}
        <div className="form-grid" style={{ marginTop: 4 }}>
          {/* Email */}
          <div>
            <div className="label-row">
              <span>Email Address</span>
              <span className="req-star">*</span>
            </div>
            <div className="field">
              <span className="icon"><IconMail /></span>
              <input
                className={inputClass(emailError, email)}
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                onBlur={blurEmail}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            {emailError && <div className="field-error">{emailError}</div>}
          </div>

          {/* Phone */}
          <div>
            <div className="label-row">
              <span>Phone Number</span>
              <span className="req-star">*</span>
            </div>
            <div className="field">
              <span className="icon"><IconPhone /></span>
              <input
                className={inputClass(phoneError, phone)}
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setPhoneError(""); }}
                onBlur={blurPhone}
                placeholder="0771234567"
                autoComplete="tel"
                maxLength="10"
              />
            </div>
            {phoneError && <div className="field-error">{phoneError}</div>}
          </div>
        </div>

        {/* ── Address (full width) ────────────────────────────────────── */}
        <div className="form-grid full" style={{ marginTop: 4 }}>
          <div>
            <div className="label-row">
              <span>Resident Address</span>
              <span className="req-star">*</span>
            </div>
            <div className="field">
              <span className="icon"><IconHome /></span>
              <input
                className={inputClass(addressError, address)}
                value={address}
                onChange={(e) => { setAddress(e.target.value); setAddressError(""); }}
                onBlur={blurAddress}
                placeholder="123, Main Street, Colombo"
                autoComplete="street-address"
              />
            </div>
            {addressError && <div className="field-error">{addressError}</div>}
          </div>
        </div>

        {/* ── Row 3: Password | Confirm Password ─────────────────────── */}
        <div className="form-grid" style={{ marginTop: 4 }}>
          {/* Password */}
          <div>
            <div className="label-row">
              <span>Password</span>
              <span className="req-star">*</span>
            </div>
            <div className="field">
              <span className="icon"><IconLock /></span>
              <input
                className={inputClass(passwordError, password)}
                type={showPw ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                onBlur={blurPw}
                placeholder="Min 8 chars"
                autoComplete="new-password"
                style={{ paddingRight: 36 }}
              />
              {/* Show / Hide toggle */}
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? "Hide password" : "Show password"}
                style={{
                  position: "absolute", right: 10, top: "50%",
                  transform: "translateY(-50%)", background: "none",
                  border: "none", cursor: "pointer", padding: 0, lineHeight: 0,
                }}
              >
                <EyeIcon open={showPw} />
              </button>
            </div>
            {passwordError && <div className="field-error">{passwordError}</div>}

            {/* Strength bar */}
            {password && passwordStrength.level > 0 && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div
                    className="strength-fill"
                    style={{
                      width: `${(passwordStrength.level / 3) * 100}%`,
                      backgroundColor: passwordStrength.color,
                    }}
                  />
                </div>
                <span className="strength-text" style={{ color: passwordStrength.color }}>
                  {passwordStrength.text}
                </span>
              </div>
            )}

            {/* Requirements checklist */}
            {password && (
              <div className="password-requirements">
                {pwChecks.map(({ ok: met, text }) => (
                  <div key={text} style={{ color: met ? "#38a169" : "#999", display: "flex", alignItems: "center", gap: 5 }}>
                    <span>{met ? "✔" : "○"}</span> {text}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <div className="label-row">
              <span>Confirm Password</span>
              <span className="req-star">*</span>
            </div>
            <div className="field">
              <span className="icon"><IconLock /></span>
              <input
                className={inputClass(confirmError, confirm)}
                type={showCpw ? "text" : "password"}
                value={confirm}
                onChange={handleConfirmChange}
                onBlur={blurCpw}
                placeholder="Repeat password"
                autoComplete="new-password"
                style={{ paddingRight: 36 }}
              />
              {/* Show / Hide toggle */}
              <button
                type="button"
                onClick={() => setShowCpw((v) => !v)}
                aria-label={showCpw ? "Hide confirm password" : "Show confirm password"}
                style={{
                  position: "absolute", right: 10, top: "50%",
                  transform: "translateY(-50%)", background: "none",
                  border: "none", cursor: "pointer", padding: 0, lineHeight: 0,
                }}
              >
                <EyeIcon open={showCpw} />
              </button>
            </div>
            {confirmError && <div className="field-error">{confirmError}</div>}
          </div>
        </div>

        {/* ── Submit ────────────────────────────────────────────────── */}
        <button className="btn-main" type="submit" style={{ marginTop: 16 }}>
          Create Account
        </button>

        <div className="center-links" style={{ marginTop: 12 }}>
          Already have an account? <Link to="/login">Sign In</Link>
        </div>

      </form>
    </AuthLayout>
  );
}
