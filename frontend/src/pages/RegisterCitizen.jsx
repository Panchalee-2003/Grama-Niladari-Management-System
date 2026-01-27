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

// ----- Icons (safe SVG) -----
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
      <path d="M7 3h3l2 5-2 2c1 2 3 4 5 5l2-2 5 2v3c0 1-1 2-2 2-9 0-16-7-16-16 0-1 1-2 2-2Z" stroke="#000" strokeWidth="2" strokeLinejoin="round" />
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
      <path d="M6 11h12v10H6V11Z" stroke="#000" strokeWidth="2" />
    </svg>
  );
}

export default function RegisterCitizen() {
  const nav = useNavigate();

  const [full_name, setFullName] = useState("");
  const [nic, setNic] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  // Validation errors
  const [nameError, setNameError] = useState("");
  const [nicError, setNicError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  // Password strength
  const passwordStrength = getPasswordStrength(password);

  // Validation handlers
  const handleNameChange = (e) => {
    setFullName(e.target.value);
    setNameError("");
  };

  const handleNameBlur = () => {
    const validation = validateName(full_name);
    if (!validation.valid) setNameError(validation.message);
  };

  const handleNicChange = (e) => {
    setNic(e.target.value);
    setNicError("");
  };

  const handleNicBlur = () => {
    const validation = validateNIC(nic);
    if (!validation.valid) setNicError(validation.message);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handleEmailBlur = () => {
    const validation = validateEmail(email);
    if (!validation.valid) setEmailError(validation.message);
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
    setPhoneError("");
  };

  const handlePhoneBlur = () => {
    const validation = validatePhone(phone);
    if (!validation.valid) setPhoneError(validation.message);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  const handlePasswordBlur = () => {
    const validation = validatePassword(password);
    if (!validation.valid) setPasswordError(validation.message);
  };

  const handleConfirmChange = (e) => {
    setConfirm(e.target.value);
    setConfirmError("");
  };

  const handleConfirmBlur = () => {
    const validation = validatePasswordMatch(password, confirm);
    if (!validation.valid) setConfirmError(validation.message);
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setOk("");

    // Validate all fields
    const nameValidation = validateName(full_name);
    const nicValidation = validateNIC(nic);
    const emailValidation = validateEmail(email);
    const phoneValidation = validatePhone(phone);
    const passwordValidation = validatePassword(password);
    const confirmValidation = validatePasswordMatch(password, confirm);

    // Set all errors
    if (!nameValidation.valid) setNameError(nameValidation.message);
    if (!nicValidation.valid) setNicError(nicValidation.message);
    if (!emailValidation.valid) setEmailError(emailValidation.message);
    if (!phoneValidation.valid) setPhoneError(phoneValidation.message);
    if (!passwordValidation.valid) setPasswordError(passwordValidation.message);
    if (!confirmValidation.valid) setConfirmError(confirmValidation.message);

    // Check if any validation failed
    if (
      !nameValidation.valid ||
      !nicValidation.valid ||
      !emailValidation.valid ||
      !phoneValidation.valid ||
      !passwordValidation.valid ||
      !confirmValidation.valid ||
      !address.trim()
    ) {
      setErr("Please fix all validation errors before submitting");
      return;
    }

    try {
      await api.post("/api/auth/register", {
        full_name,
        email,
        password,
        nic_number: nic,
        phone_number: phone
      });
      const loginRes = await api.post("/api/auth/login", { email, password });
      saveAuth(loginRes.data.token, loginRes.data.user);

      setOk("Account created successfully ✅");
      nav("/citizen");
    } catch (ex) {
      setErr(ex?.response?.data?.error || "Registration failed");
    }
  };

  return (
    <AuthLayout
      title="Citizen Registration"
      subtitle="Create your account to access GN Division services"
    >
      {err ? <div className="msg-err">{err}</div> : null}
      {ok ? <div className="msg-ok">{ok}</div> : null}

      <form onSubmit={submit}>
        <div className="form-grid">
          <div>
            <div className="label-row"><span>Full Name</span><span className="req-star">*</span></div>
            <div className="field">
              <span className="icon"><IconUser /></span>
              <input
                className={`input ${nameError ? 'input-error' : ''}`}
                value={full_name}
                onChange={handleNameChange}
                onBlur={handleNameBlur}
                placeholder="Samadhi Perera"
              />
            </div>
            {nameError && <div className="field-error">{nameError}</div>}
          </div>

          <div>
            <div className="label-row"><span>NIC Number</span><span className="req-star">*</span></div>
            <div className="field">
              <span className="icon"><IconId /></span>
              <input
                className={`input ${nicError ? 'input-error' : ''}`}
                value={nic}
                onChange={handleNicChange}
                onBlur={handleNicBlur}
                placeholder="123456789V"
              />
            </div>
            {nicError && <div className="field-error">{nicError}</div>}
          </div>

          <div>
            <div className="label-row"><span>Email Address</span><span className="req-star">*</span></div>
            <div className="field">
              <span className="icon"><IconMail /></span>
              <input
                className={`input ${emailError ? 'input-error' : ''}`}
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                placeholder="you@example.com"
              />
            </div>
            {emailError && <div className="field-error">{emailError}</div>}
          </div>

          <div>
            <div className="label-row"><span>Phone Number</span><span className="req-star">*</span></div>
            <div className="field">
              <span className="icon"><IconPhone /></span>
              <input
                className={`input ${phoneError ? 'input-error' : ''}`}
                value={phone}
                onChange={handlePhoneChange}
                onBlur={handlePhoneBlur}
                placeholder="0704367446"
              />
            </div>
            {phoneError && <div className="field-error">{phoneError}</div>}
          </div>
        </div>

        <div className="form-grid full">
          <div>
            <div className="label-row"><span>Resident Address</span><span className="req-star">*</span></div>
            <div className="field">
              <span className="icon"><IconHome /></span>
              <input className="input" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123, Main Street, city" />
            </div>
          </div>
        </div>

        <div className="form-grid">
          <div>
            <div className="label-row"><span>Password</span><span className="req-star">*</span></div>
            <div className="field">
              <span className="icon"><IconLock /></span>
              <input
                className={`input ${passwordError ? 'input-error' : ''}`}
                type="password"
                value={password}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                placeholder="......."
              />
            </div>
            {passwordError && <div className="field-error">{passwordError}</div>}
            {password && passwordStrength.level > 0 && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div
                    className="strength-fill"
                    style={{
                      width: `${(passwordStrength.level / 3) * 100}%`,
                      backgroundColor: passwordStrength.color
                    }}
                  />
                </div>
                <span className="strength-text" style={{ color: passwordStrength.color }}>
                  {passwordStrength.text}
                </span>
              </div>
            )}
          </div>

          <div>
            <div className="label-row"><span>Confirm Password</span><span className="req-star">*</span></div>
            <div className="field">
              <span className="icon"><IconLock /></span>
              <input
                className={`input ${confirmError ? 'input-error' : ''}`}
                type="password"
                value={confirm}
                onChange={handleConfirmChange}
                onBlur={handleConfirmBlur}
                placeholder="......."
              />
            </div>
            {confirmError && <div className="field-error">{confirmError}</div>}
          </div>
        </div>

        <button className="btn-main">Create Account</button>

        <div className="center-links">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </form>
    </AuthLayout>
  );
}
