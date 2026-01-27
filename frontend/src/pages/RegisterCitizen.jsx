import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import AuthLayout from "../components/AuthLayout";
import { saveAuth } from "../auth/auth";

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

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setOk("");

    if (!full_name || !nic || !email || !phone || !address || !password || !confirm) {
      setErr("Please fill all required fields.");
      return;
    }
    if (password !== confirm) {
      setErr("Passwords do not match.");
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
              <input className="input" value={full_name} onChange={(e) => setFullName(e.target.value)} placeholder="Samadhi Perera" />
            </div>
          </div>

          <div>
            <div className="label-row"><span>NIC Number</span><span className="req-star">*</span></div>
            <div className="field">
              <span className="icon"><IconId /></span>
              <input className="input" value={nic} onChange={(e) => setNic(e.target.value)} placeholder="123456789V" />
            </div>
          </div>

          <div>
            <div className="label-row"><span>Email Address</span><span className="req-star">*</span></div>
            <div className="field">
              <span className="icon"><IconMail /></span>
              <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
          </div>

          <div>
            <div className="label-row"><span>Phone Number</span><span className="req-star">*</span></div>
            <div className="field">
              <span className="icon"><IconPhone /></span>
              <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0704367446" />
            </div>
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
              <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="......." />
            </div>
          </div>

          <div>
            <div className="label-row"><span>Confirm Password</span><span className="req-star">*</span></div>
            <div className="field">
              <span className="icon"><IconLock /></span>
              <input className="input" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="......." />
            </div>
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
