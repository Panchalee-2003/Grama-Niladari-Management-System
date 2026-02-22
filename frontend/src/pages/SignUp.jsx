import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

// ─── Inline SVG icons ────────────────────────────────────────────────────────

function UserIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="#333" strokeWidth="2" />
            <path d="M4 20a8 8 0 0 1 16 0" stroke="#333" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

function EmailIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="4" width="20" height="16" rx="2" stroke="#333" strokeWidth="2" />
            <path d="M2 8l10 7 10-7" stroke="#333" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

function LockIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M7 11V8a5 5 0 0 1 10 0v3" stroke="#333" strokeWidth="2" strokeLinecap="round" />
            <rect x="5" y="11" width="14" height="11" rx="2" stroke="#333" strokeWidth="2" />
        </svg>
    );
}

function EyeIcon({ crossed }) {
    return crossed ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M3 3l18 18" stroke="#555" strokeWidth="2" strokeLinecap="round" />
            <path d="M10.5 10.7a3 3 0 0 0 3.8 3.8" stroke="#555" strokeWidth="2" strokeLinecap="round" />
            <path d="M6.5 6.6C4.6 8 3 10 3 12c0 0 3.5 6 9 6a9.3 9.3 0 0 0 4.5-1.1" stroke="#555" strokeWidth="2" strokeLinecap="round" />
            <path d="M9.9 5.1A8.5 8.5 0 0 1 12 5c5.5 0 9 6 9 7 0 .5-.6 1.5-1.6 2.6" stroke="#555" strokeWidth="2" strokeLinecap="round" />
        </svg>
    ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7S1 12 1 12Z" stroke="#555" strokeWidth="2" />
            <circle cx="12" cy="12" r="3" stroke="#555" strokeWidth="2" />
        </svg>
    );
}

// ─── Validation helpers ───────────────────────────────────────────────────────

function validateFullName(val) {
    if (!val.trim()) return "Full name is required.";
    if (!/^[A-Za-z\s]+$/.test(val.trim())) return "Full name must contain only letters and spaces.";
    return "";
}

function validateEmail(val) {
    if (!val.trim()) return "Email address is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) return "Please enter a valid email address.";
    return "";
}

function validatePassword(val) {
    if (!val) return "Password is required.";
    if (val.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(val)) return "Must include at least one uppercase letter.";
    if (!/[0-9]/.test(val)) return "Must include at least one number.";
    if (!/[^A-Za-z0-9]/.test(val)) return "Must include at least one special character.";
    return "";
}

function validateConfirm(password, confirm) {
    if (!confirm) return "Please confirm your password.";
    if (confirm !== password) return "Passwords do not match.";
    return "";
}

/** Returns 0–4 strength score for the given password */
function passwordStrength(val) {
    if (!val) return 0;
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    return score;
}

const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLORS = ["", "#e53e3e", "#dd6b20", "#d69e2e", "#38a169"];

// ─── Component ────────────────────────────────────────────────────────────────

export default function SignUp() {
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // ── Field helpers ──────────────────────────────────────────────────────────

    function handleChange(field, value) {
        setForm((prev) => ({ ...prev, [field]: value }));

        // Clear error while the user is actively editing
        setErrors((prev) => ({ ...prev, [field]: "" }));

        // Live-clear confirmPassword mismatch when password changes
        if (field === "password" && form.confirmPassword) {
            setErrors((prev) => ({
                ...prev,
                confirmPassword: validateConfirm(value, form.confirmPassword),
            }));
        }
    }

    function handleBlur(field) {
        let err = "";
        if (field === "fullName") err = validateFullName(form.fullName);
        if (field === "email") err = validateEmail(form.email);
        if (field === "password") err = validatePassword(form.password);
        if (field === "confirmPassword") err = validateConfirm(form.password, form.confirmPassword);
        setErrors((prev) => ({ ...prev, [field]: err }));
    }

    // ── Submit ─────────────────────────────────────────────────────────────────

    function handleSubmit(e) {
        e.preventDefault();

        // Validate all fields
        const newErrors = {
            fullName: validateFullName(form.fullName),
            email: validateEmail(form.email),
            password: validatePassword(form.password),
            confirmPassword: validateConfirm(form.password, form.confirmPassword),
        };
        setErrors(newErrors);

        if (Object.values(newErrors).some(Boolean)) return;

        // SECURITY NOTE: Never store the plain-text password here.
        // The backend MUST hash the password (e.g., bcrypt) before saving to the database.
        const payload = {
            fullName: form.fullName.trim(),
            email: form.email.trim(),
            password: form.password, // ← send over HTTPS; backend must hash before DB insert
        };

        console.log("SignUp payload:", JSON.stringify(payload, null, 2));
        alert("Registration Successful! You can now log in.");
    }

    // ── Derived UI state ───────────────────────────────────────────────────────

    const strength = passwordStrength(form.password);
    const strengthPct = (strength / 4) * 100;
    const strengthLabel = STRENGTH_LABELS[strength];
    const strengthColor = STRENGTH_COLORS[strength];

    // ── Render ─────────────────────────────────────────────────────────────────

    return (
        <AuthLayout
            title="GRAMA NILADHARI DIVISION — MASPANNA"
            subtitle="Officer Registration Portal"
        >
            <h2 className="sub-title" style={{ marginBottom: 2 }}>Create Account</h2>
            <div className="sub-desc">Register as a Grama Niladhari Officer</div>

            <form onSubmit={handleSubmit} noValidate>

                {/* ── Full Name ──────────────────────────────────────────────── */}
                <label className="label">
                    Full Name <span className="req-star">*</span>
                </label>
                <div className="field">
                    <span className="icon"><UserIcon /></span>
                    <input
                        className={`input${errors.fullName ? " input-error" : form.fullName ? " input-success" : ""}`}
                        type="text"
                        placeholder="e.g. Kamal Perera"
                        value={form.fullName}
                        onChange={(e) => handleChange("fullName", e.target.value)}
                        onBlur={() => handleBlur("fullName")}
                        autoComplete="name"
                    />
                </div>
                {errors.fullName && <div className="field-error">{errors.fullName}</div>}

                {/* ── Email ─────────────────────────────────────────────────── */}
                <label className="label" style={{ marginTop: 12 }}>
                    Email Address <span className="req-star">*</span>
                </label>
                <div className="field">
                    <span className="icon"><EmailIcon /></span>
                    <input
                        className={`input${errors.email ? " input-error" : form.email ? " input-success" : ""}`}
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        onBlur={() => handleBlur("email")}
                        autoComplete="email"
                    />
                </div>
                {errors.email && <div className="field-error">{errors.email}</div>}

                {/* ── Password ──────────────────────────────────────────────── */}
                <label className="label" style={{ marginTop: 12 }}>
                    Password <span className="req-star">*</span>
                </label>
                <div className="field">
                    <span className="icon"><LockIcon /></span>
                    <input
                        className={`input${errors.password ? " input-error" : form.password && !validatePassword(form.password) ? " input-success" : ""}`}
                        type={showPassword ? "text" : "password"}
                        placeholder="Min 8 chars, 1 uppercase, 1 number, 1 special"
                        value={form.password}
                        onChange={(e) => handleChange("password", e.target.value)}
                        onBlur={() => handleBlur("password")}
                        autoComplete="new-password"
                        style={{ paddingRight: 40 }}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        style={{
                            position: "absolute", right: 10, top: "50%",
                            transform: "translateY(-50%)", background: "none",
                            border: "none", cursor: "pointer", padding: 0, lineHeight: 0,
                        }}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        <EyeIcon crossed={showPassword} />
                    </button>
                </div>
                {errors.password && <div className="field-error">{errors.password}</div>}

                {/* Strength bar */}
                {form.password && (
                    <div className="password-strength" style={{ marginTop: 6 }}>
                        <div className="strength-bar">
                            <div
                                className="strength-fill"
                                style={{ width: `${strengthPct}%`, backgroundColor: strengthColor }}
                            />
                        </div>
                        <span className="strength-text" style={{ color: strengthColor }}>
                            {strengthLabel}
                        </span>
                    </div>
                )}

                {/* Requirements checklist */}
                <div className="password-requirements" style={{ marginBottom: 4 }}>
                    {[
                        { ok: form.password.length >= 8, text: "At least 8 characters" },
                        { ok: /[A-Z]/.test(form.password), text: "One uppercase letter" },
                        { ok: /[0-9]/.test(form.password), text: "One number" },
                        { ok: /[^A-Za-z0-9]/.test(form.password), text: "One special character" },
                    ].map(({ ok, text }) => (
                        <div
                            key={text}
                            style={{ color: ok ? "#38a169" : "#999", display: "flex", alignItems: "center", gap: 5 }}
                        >
                            <span>{ok ? "✔" : "○"}</span> {text}
                        </div>
                    ))}
                </div>

                {/* ── Confirm Password ──────────────────────────────────────── */}
                <label className="label" style={{ marginTop: 8 }}>
                    Confirm Password <span className="req-star">*</span>
                </label>
                <div className="field">
                    <span className="icon"><LockIcon /></span>
                    <input
                        className={`input${errors.confirmPassword ? " input-error" : form.confirmPassword && !validateConfirm(form.password, form.confirmPassword) ? " input-success" : ""}`}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Repeat your password"
                        value={form.confirmPassword}
                        onChange={(e) => handleChange("confirmPassword", e.target.value)}
                        onBlur={() => handleBlur("confirmPassword")}
                        autoComplete="new-password"
                        style={{ paddingRight: 40 }}
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        style={{
                            position: "absolute", right: 10, top: "50%",
                            transform: "translateY(-50%)", background: "none",
                            border: "none", cursor: "pointer", padding: 0, lineHeight: 0,
                        }}
                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    >
                        <EyeIcon crossed={showConfirmPassword} />
                    </button>
                </div>
                {errors.confirmPassword && (
                    <div className="field-error">{errors.confirmPassword}</div>
                )}

                {/* ── Submit ────────────────────────────────────────────────── */}
                <button
                    className="btn-main"
                    type="submit"
                    style={{ marginTop: 18 }}
                >
                    Create Account
                </button>

                {/* ── Login link ────────────────────────────────────────────── */}
                <div className="center-links" style={{ marginTop: 14 }}>
                    Already have an account?{" "}
                    <Link to="/login">Login here</Link>
                </div>

            </form>
        </AuthLayout>
    );
}
