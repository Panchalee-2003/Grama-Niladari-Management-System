import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/complaints.css";
import emblem from "../assets/emblem.png";
import NotificationDropdown from "../components/NotificationDropdown";
import CitizenProfileDropdown from "../components/CitizenProfileDropdown";
import LanguageSwitcher from "../components/LanguageSwitcher";
import api from "../api/api";

/* --- Icons --- */
function IconHome() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
      <path d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5Z" stroke="#1f1f1f" strokeWidth="2" />
    </svg>
  );
}
function IconUser() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
      <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="#1f1f1f" strokeWidth="2" />
      <path d="M4 20a8 8 0 0 1 16 0" stroke="#1f1f1f" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconDoc() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
      <path d="M7 3h7l3 3v15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" stroke="#1f1f1f" strokeWidth="2" />
      <path d="M14 3v4h4" stroke="#1f1f1f" strokeWidth="2" />
    </svg>
  );
}
function IconComplaint() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
      <path d="M7 3h10a2 2 0 0 1 2 2v16l-4-2-4 2-4-2-4 2V5a2 2 0 0 1 2-2Z" stroke="#1f1f1f" strokeWidth="2" />
      <path d="M8 7h8M8 11h8M8 15h6" stroke="#1f1f1f" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconBell() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z" stroke="#1f1f1f" strokeWidth="2" />
      <path d="M9.5 19a2.5 2.5 0 0 0 5 0" stroke="#1f1f1f" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconClip() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M21.44 11.05 12.25 20.24a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 1 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.49" stroke="#1f1f1f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Complaints() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) { setAttachment(null); return; }
    if (file.size > 5 * 1024 * 1024) {
      setError("File is too large. Maximum size is 5 MB.");
      e.target.value = "";
      setAttachment(null);
      return;
    }
    setError("");
    setAttachment(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!subject.trim()) {
      setError("Subject is required.");
      return;
    }

    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("description", description);
    if (attachment) formData.append("attachment", attachment);

    setSubmitting(true);
    try {
      await api.post("/api/complaint", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("✅ Complaint submitted successfully!");
      setSubject("");
      setDescription("");
      setAttachment(null);
      // Reset file input
      const fileInput = document.getElementById("complaint-file");
      if (fileInput) fileInput.value = "";
    } catch (ex) {
      setError(ex.response?.data?.error || "Failed to submit complaint. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="cp-page">
      {/* TOP HEADER */}
      <header className="cd-top">
        <div className="cd-top-left">
          <img className="cd-emblem" src={emblem} alt="Emblem" />
          <div className="cd-top-text">
            <div className="cd-title">{t('dashboard.title')}</div>
            <div className="cd-subtitle">{t('dashboard.subtitle')}</div>
          </div>
        </div>
        <div className="cd-top-right" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <LanguageSwitcher />
          <Link to="/about" className="cd-about-btn">{t('nav.aboutUs')}</Link>
          <NotificationDropdown />
          <CitizenProfileDropdown />
        </div>
      </header>

      {/* NAV BAR */}
      <nav className="cd-nav">
        <Link className="cd-nav-item" to="/citizen"><IconHome /><span>{t('nav.home')}</span></Link>
        <Link className="cd-nav-item" to="/household"><IconUser /><span>{t('nav.household')}</span></Link>
        <Link className="cd-nav-item" to="/certificates"><IconDoc /><span>{t('nav.certificates')}</span></Link>
        <Link className="cd-nav-item cd-active" to="/complaints"><IconComplaint /><span>{t('nav.complaints')}</span></Link>
        <Link className="cd-nav-item" to="/notices"><IconBell /><span>{t('nav.notices')}</span></Link>
      </nav>

      {/* MAIN */}
      <main className="cp-main">
        <h1 className="cp-title">{t('complaints.submitNew')}</h1>

        {success && (
          <div className="cp-alert cp-alert-success">
            {success}
            <button className="cp-alert-link" onClick={() => navigate("/complaint-status")}>
              View your complaints →
            </button>
          </div>
        )}
        {error && <div className="cp-alert cp-alert-error">{error}</div>}

        <form className="cp-grid" onSubmit={handleSubmit}>
          {/* Left column */}
          <div className="cp-left">
            <div className="cp-field">
              <label className="cp-label">
                {t('complaints.subject')} <span className="cp-required">*</span>
              </label>
              <input
                className="cp-input"
                placeholder={t('complaints.subject')}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                maxLength={200}
              />
            </div>
            <div className="cp-field">
              <label className="cp-label">{t('complaints.description')}</label>
              <textarea
                className="cp-textarea"
                placeholder={t('complaints.description')}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
              />
            </div>
          </div>

          {/* Right column */}
          <div className="cp-right">
            <div className="cp-field">
              <label className="cp-label">Attachment</label>
              <div className="cp-upload">
                <span className="cp-upload-text">
                  {attachment ? attachment.name : "Upload file (image, PDF, doc — max 5 MB)"}
                </span>
                <span className="cp-upload-ico"><IconClip /></span>
                <input
                  id="complaint-file"
                  className="cp-file"
                  type="file"
                  accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                />
              </div>
              {attachment && (
                <div style={{ fontSize: "13px", color: "#0C7A3B", marginTop: "6px" }}>
                  ✅ {attachment.name} ({(attachment.size / 1024).toFixed(1)} KB)
                  <button
                    type="button"
                    style={{ marginLeft: "8px", background: "none", border: "none", color: "#dc3545", cursor: "pointer", fontSize: "13px" }}
                    onClick={() => { setAttachment(null); document.getElementById("complaint-file").value = ""; }}
                  >✕ Remove</button>
                </div>
              )}
            </div>

            <div className="cp-submit-wrap">
              <button className="cp-submit-btn" type="submit" disabled={submitting}>
                {submitting ? "Submitting…" : "Submit"}
              </button>
              <Link to="/complaint-status" className="cp-link">
                View previous complaint status...
              </Link>
            </div>
          </div>
        </form>
      </main>

      {/* FOOTER */}
      <footer className="cd-footer">
        <div className="cd-footer-grid">
          <div>
            <div className="cd-footer-title">Contact Information</div>
            <div className="cd-footer-text">Grama Niladhari officer, Maspanna</div>
            <div className="cd-footer-text">Phone: 0768187908</div>
            <div className="cd-footer-text">Email: chasara88@gmail.com</div>
          </div>
          <div>
            <div className="cd-footer-title">Office Hours</div>
            <div className="cd-footer-text">Tuesday 08:15 to 16:30</div>
            <div className="cd-footer-text">Thursday 08:15 to 16:30</div>
            <div className="cd-footer-text">Saturday 08:15 to 12:30</div>
          </div>
          <div>
            <div className="cd-footer-title">Quick links</div>
            <div className="cd-footer-text">Citizen Login</div>
            <div className="cd-footer-text">New Registration</div>
            <div className="cd-footer-text">Complaints</div>
          </div>
        </div>
        <div className="cd-footer-bottom">
          © 2025 Grama Niladhari Division - Maspanna. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
