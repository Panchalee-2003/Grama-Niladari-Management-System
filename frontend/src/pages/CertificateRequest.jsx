import React from "react";
import "../styles/certificateRequest.css";
import emblem from "../assets/emblem.png";
import { Link } from "react-router-dom";


function IconHome() {
  return (
    <svg className="gn-nav-icon" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-10.5Z"
        stroke="#2b2b2b"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconUser() {
  return (
    <svg className="gn-nav-icon" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
        stroke="#2b2b2b"
        strokeWidth="2"
      />
      <path
        d="M4 21a8 8 0 0 1 16 0"
        stroke="#2b2b2b"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconDoc() {
  return (
    <svg className="gn-nav-icon" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 3h7l3 3v15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
        stroke="#2b2b2b"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M14 3v4h4" stroke="#2b2b2b" strokeWidth="2" />
    </svg>
  );
}
function IconComplaint() {
  return (
    <svg className="gn-nav-icon" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 3h10a2 2 0 0 1 2 2v16l-4-3H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
        stroke="#2b2b2b"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M8 8h8M8 12h6"
        stroke="#2b2b2b"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconBell() {
  return (
    <svg className="gn-nav-icon" viewBox="0 0 24 24" fill="none">
      <path
        d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z"
        stroke="#2b2b2b"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M10 19a2 2 0 0 0 4 0"
        stroke="#2b2b2b"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function ProfileIcon() {
  return (
    <svg className="gn-profile-ico" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
        stroke="#1c1c1c"
        strokeWidth="2"
      />
      <path
        d="M4 20a8 8 0 0 1 16 0"
        stroke="#1c1c1c"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function CertificateRequest() {
  return (
    <div className="gn-page">
      {/* Header */}
      <header className="gn-header">
        <div className="gn-header-left">
          <img className="gn-emblem" src={emblem} alt="Emblem" />
          <div className="gn-title-wrap">
            <div className="gn-title">Grama Niladhari Division - Maspanna</div>
            <div className="gn-subtitle">Ministry of Home Affairs</div>
          </div>
        </div>

        <div className="gn-header-right">
          <button className="gn-about-btn" type="button">
            About Us
          </button>
          <div className="gn-profile-btn" role="button" tabIndex={0} aria-label="Profile">
            <ProfileIcon />
          </div>
        </div>
      </header>

      {/* Nav */}
      <nav className="gn-nav">
  <Link to="/" className="gn-nav-item">
    <IconHome />
    <span>Home</span>
  </Link>

  <Link to="/household" className="gn-nav-item">
    <IconUser />
    <span>Household</span>
  </Link>

  <Link to="/certificates" className="gn-nav-item">
    <IconDoc />
    <span>Certificates</span>
  </Link>

  <Link to="/complaints" className="gn-nav-item">
    <IconComplaint />
    <span>Complaints</span>
  </Link>

  <Link to="/notices" className="gn-nav-item">
    <IconBell />
    <span>Notices</span>
  </Link>
</nav>

      {/* Content */}
      <main className="gn-content">
        <div className="gn-form-wrap">
          <h2 className="gn-form-title">Request Form</h2>

          <div className="gn-form-grid">
            {/* Left column */}
            <div className="gn-left-col">
              <div className="gn-field">
                <select className="gn-input gn-select" defaultValue="">
                  <option value="" disabled>
                    Select Request Type
                  </option>
                  <option>Residence Certificate</option>
                  <option>Income Certificate</option>
                  <option>Character Certificate</option>
                </select>
              </div>

              <div className="gn-field">
                <input className="gn-input" type="text" placeholder="Full Name" />
              </div>

              <div className="gn-field">
                <input className="gn-input" type="text" placeholder="National ID Number" />
              </div>

              <div className="gn-field">
                <input className="gn-input" type="text" placeholder="Address" />
              </div>

              <div className="gn-field">
                <input className="gn-input" type="text" placeholder="Contact Number" />
              </div>
            </div>

            {/* Right column */}
            <div className="gn-right-col">
              <textarea className="gn-textarea" placeholder="Additional Information" />
            </div>
          </div>

          <div className="gn-submit-row">
            <button className="gn-submit-btn" type="button">
              Submit
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="gn-footer">
        <div className="gn-footer-inner">
          <div className="gn-footer-cols">
            <div className="gn-footer-col">
              <div className="gn-footer-title">Contact Information</div>
              <div className="gn-footer-text">Grama Niladhari officer, Maspanna</div>
              <div className="gn-footer-text">Phone: 0768187908</div>
              <div className="gn-footer-text">Email: chasara88@gmail.com</div>
            </div>

            <div className="gn-footer-col">
              <div className="gn-footer-title">Office Hours</div>
              <div className="gn-footer-text">Tuesday 08:15 to 16:30</div>
              <div className="gn-footer-text">Thursday 08:15 to 16:30</div>
              <div className="gn-footer-text">Saturday 08:15 to 12:30</div>
            </div>

            <div className="gn-footer-col">
              <div className="gn-footer-title">Quick links</div>
              <div className="gn-footer-text">Citizen Login</div>
              <div className="gn-footer-text">New Registration</div>
              <div className="gn-footer-text">Complaints</div>
            </div>
          </div>

          <div className="gn-footer-line" />

          <div className="gn-copyright">
            © 2025 Grama Niladhari Division - Maspanna. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
