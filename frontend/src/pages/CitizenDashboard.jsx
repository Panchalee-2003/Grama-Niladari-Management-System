import { Link, useNavigate } from "react-router-dom";
import "../styles/citizenDashboard.css";
import { clearAuth } from "../auth/auth";

import hero from "../assets/paddy.jpg";
import emblem from "../assets/emblem.png";

/* Icons */
function IconHome() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5Z"
        stroke="#1f1f1f"
        strokeWidth="2"
      />
    </svg>
  );
}
function IconUser() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
        stroke="#1f1f1f"
        strokeWidth="2"
      />
      <path
        d="M4 20a8 8 0 0 1 16 0"
        stroke="#1f1f1f"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconDoc() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 3h7l3 3v15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
        stroke="#1f1f1f"
        strokeWidth="2"
      />
      <path d="M14 3v4h4" stroke="#1f1f1f" strokeWidth="2" />
    </svg>
  );
}
function IconComplaint() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 3h10a2 2 0 0 1 2 2v16l-4-2-4 2-4-2-4 2V5a2 2 0 0 1 2-2Z"
        stroke="#1f1f1f"
        strokeWidth="2"
      />
      <path
        d="M8 7h8M8 11h8M8 15h6"
        stroke="#1f1f1f"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconBell() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
      <path
        d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z"
        stroke="#1f1f1f"
        strokeWidth="2"
      />
      <path
        d="M9.5 19a2.5 2.5 0 0 0 5 0"
        stroke="#1f1f1f"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconMedal() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 15a5 5 0 1 0-5-5 5 5 0 0 0 5 5Z"
        stroke="#1f1f1f"
        strokeWidth="2"
      />
      <path
        d="M9 14l-2 7 5-2 5 2-2-7"
        stroke="#1f1f1f"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconProfileSmall() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
        stroke="#fff"
        strokeWidth="2"
      />
      <path
        d="M4 20a8 8 0 0 1 16 0"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconLogout() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16 17l5-5-5-5"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 12H9"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function CitizenDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <div className="cd-page">
      {/* TOP HEADER */}
      <header className="cd-top">
        <div className="cd-brand">
          <img className="cd-emblem" src={emblem} alt="Sri Lanka Emblem" />
          <div className="cd-brand-text">
            <div className="cd-title">Grama Niladhari Division - Maspanna</div>
            <div className="cd-subtitle">Ministry of Home Affairs</div>
          </div>
        </div>

        <div className="cd-top-actions">
          <Link to="/about" className="cd-about">About Us</Link>
          <button className="cd-profile" aria-label="Profile">
            <IconProfileSmall />
          </button>
          <button className="cd-logout" onClick={handleLogout} aria-label="Logout" title="Logout">
            <IconLogout />
          </button>
        </div>
      </header>

      {/* NAV BAR */}
      <nav className="cd-nav">
        <Link className="cd-nav-item" to="/citizen">
          <IconHome />
          <span>Home</span>
        </Link>

        <Link className="cd-nav-item" to="/household">
          <IconUser />
          <span>Household</span>
        </Link>

        <Link className="cd-nav-item" to="/certificates">
          <IconDoc />
          <span>Certificates</span>
        </Link>

        <Link className="cd-nav-item" to="/complaints">
          <IconComplaint />
          <span>Complaints</span>
        </Link>

        <Link className="cd-nav-item" to="/notices">
          <IconBell />
          <span>Notices</span>
        </Link>
      </nav>

      <div className="cd-main">
        {/* HERO */}
        <section className="cd-hero" style={{ backgroundImage: `url(${hero})` }}>
          <div className="cd-hero-overlay">
            <h1>Welcome to Our Digital Service Portal</h1>
            <p>
              Access government services digitally. Request certificates, submit complaints,
              and stay updated with community notices
            </p>

            {/* Register Now -> Household */}
            <Link to="/household" className="cd-hero-btn">
              Register Now
            </Link>
          </div>
        </section>

        {/* CARDS */}
        <section className="cd-cards">
          {/* Certificates */}
          <Link to="/certificates" className="cd-card-link">
            <div className="cd-card">
              <div className="cd-card-icon cd-icon-green">
                <IconMedal />
              </div>
              <h3>Certificate Services</h3>
              <p>Request residence, character, and income certificates</p>
            </div>
          </Link>

          {/* Households */}
          <Link to="/household" className="cd-card-link">
            <div className="cd-card">
              <div className="cd-card-icon cd-icon-yellow">
                <IconUser />
              </div>
              <h3>Citizen Portal</h3>
              <p>Manage your profile, household information</p>
            </div>
          </Link>

          {/* Notices */}
          <Link to="/notices" className="cd-card-link">
            <div className="cd-card">
              <div className="cd-card-icon cd-icon-blue">
                <IconBell />
              </div>
              <h3>Notices &amp; Updates</h3>
              <p>Stay informed about community events, announcements, and important notices</p>
            </div>
          </Link>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="cd-footer">
        <div className="cd-footer-grid">
          <div>
            <h4>Contact Information</h4>
            <p>Grama Niladhari officer, Maspanna</p>
            <p>Phone: 0768187908</p>
            <p>Email: chasara88@gmail.com</p>
          </div>

          <div>
            <h4>Office Hours</h4>
            <p>Tuesday 08:15 to 16:30</p>
            <p>Thursday 08:15 to 16:30</p>
            <p>Saturday 08:15 to 12:30</p>
          </div>

          <div>
            <h4>Quick links</h4>
            <p className="cd-footer-link">Citizen Login</p>
            <p className="cd-footer-link">New Registration</p>
            <p className="cd-footer-link">Complaints</p>
          </div>
        </div>

        <div className="cd-footer-line" />

        <div className="cd-footer-copy">
          © 2025 Grama Niladhari Division - Maspanna. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
