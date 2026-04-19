import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/notices.css";
import emblem from "../assets/emblem.png";
import NotificationDropdown from "../components/NotificationDropdown";
import CitizenProfileDropdown from "../components/CitizenProfileDropdown";
import LanguageSwitcher from "../components/LanguageSwitcher";
import api from "../api/api";

function IconHome() {
  return <svg width="34" height="34" viewBox="0 0 24 24" fill="none"><path d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5Z" stroke="#1f1f1f" strokeWidth="2" /></svg>;
}
function IconUser() {
  return <svg width="34" height="34" viewBox="0 0 24 24" fill="none"><path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="#1f1f1f" strokeWidth="2" /><path d="M4 20a8 8 0 0 1 16 0" stroke="#1f1f1f" strokeWidth="2" strokeLinecap="round" /></svg>;
}
function IconDoc() {
  return <svg width="34" height="34" viewBox="0 0 24 24" fill="none"><path d="M7 3h7l3 3v15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" stroke="#1f1f1f" strokeWidth="2" /><path d="M14 3v4h4" stroke="#1f1f1f" strokeWidth="2" /></svg>;
}
function IconComplaint() {
  return <svg width="34" height="34" viewBox="0 0 24 24" fill="none"><path d="M7 3h10a2 2 0 0 1 2 2v16l-4-2-4 2-4-2-4 2V5a2 2 0 0 1 2-2Z" stroke="#1f1f1f" strokeWidth="2" /><path d="M8 7h8M8 11h8M8 15h6" stroke="#1f1f1f" strokeWidth="2" strokeLinecap="round" /></svg>;
}
function IconBell() {
  return <svg width="34" height="34" viewBox="0 0 24 24" fill="none"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z" stroke="#1f1f1f" strokeWidth="2" /><path d="M9.5 19a2.5 2.5 0 0 0 5 0" stroke="#1f1f1f" strokeWidth="2" strokeLinecap="round" /></svg>;
}

const API_BASE = "http://localhost:5000";

function formatDate(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" });
}

export default function Notices() {
  const { t } = useTranslation();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.get("/api/notice")
      .then((r) => { if (r.data.ok) setNotices(r.data.notices); })
      .catch(() => setError("Failed to load notices."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="nt-page">
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
        <Link className="cd-nav-item" to="/complaints"><IconComplaint /><span>{t('nav.complaints')}</span></Link>
        <Link className="cd-nav-item cd-active" to="/notices"><IconBell /><span>{t('nav.notices')}</span></Link>
      </nav>

      {/* MAIN */}
      <main className="nt-main">
        <h1 className="nt-page-title">{t('notices.title')}</h1>
        <p className="nt-page-sub">Official announcements and news from the Maspanna Grama Niladhari Division</p>

        {loading && <div className="nt-state">{t('common.loading')}</div>}
        {error && <div className="nt-state nt-state-err">{error}</div>}

        {!loading && notices.length === 0 && (
          <div className="nt-state">{t('notices.noNotices')}</div>
        )}

        {!loading && notices.length > 0 && (
          <div className="nt-cards">
            {notices.map((n) => (
              <div className="nt-card" key={n.notice_id}>
                {n.image_path && (
                  <img
                    className="nt-card-img"
                    src={`${API_BASE}/uploads/${n.image_path}`}
                    alt={n.title}
                  />
                )}
                <div className="nt-card-body">
                  <div className="nt-card-date">
                    {n.notice_date ? formatDate(n.notice_date) : formatDate(n.created_at)}
                    {n.gn_name && <span className="nt-card-author"> · {n.gn_name}</span>}
                  </div>
                  <h2 className="nt-card-title">{n.title}</h2>
                  {n.description && (
                    <p className={`nt-card-desc ${expanded === n.notice_id ? "nt-expanded" : "nt-collapsed"}`}>
                      {n.description}
                    </p>
                  )}
                  {n.description && n.description.length > 150 && (
                    <button
                      className="nt-toggle-btn"
                      onClick={() => setExpanded(expanded === n.notice_id ? null : n.notice_id)}
                    >
                      {expanded === n.notice_id ? "Show less ▲" : "View more ▼"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
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
