import { Link } from "react-router-dom";
import "../styles/complaints.css";
import emblem from "../assets/emblem.png";

/* --- Icons (same set you used before) --- */
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

function IconClip() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M21.44 11.05 12.25 20.24a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 1 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.49"
        stroke="#1f1f1f"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Complaints() {
  return (
    <div className="cp-page">
      {/* TOP HEADER */}
      <header className="cd-top">
        <div className="cd-top-left">
          <img className="cd-emblem" src={emblem} alt="Emblem" />
          <div className="cd-top-text">
            <div className="cd-title">Grama Niladhari Division - Maspanna</div>
            <div className="cd-subtitle">Ministry of Home Affairs</div>
          </div>
        </div>

        <div className="cd-top-right">
          <button className="cd-about-btn">About Us</button>
          <div className="cd-profile-circle" aria-label="profile">
            <IconUser />
          </div>
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

        <Link className="cd-nav-item cd-active" to="/complaints">
          <IconComplaint />
          <span>Complaints</span>
        </Link>

        <Link className="cd-nav-item" to="/notices">
          <IconBell />
          <span>Notices</span>
        </Link>
      </nav>

      {/* MAIN */}
      <main className="cp-main">
        <h1 className="cp-title">Submit a Complaint</h1>

        <div className="cp-grid">
          {/* Left column */}
          <div className="cp-left">
            <div className="cp-field">
              <label className="cp-label">Subject</label>
              <input
                className="cp-input"
                placeholder="Enter the subject of your complaint"
              />
            </div>

            <div className="cp-field">
              <label className="cp-label">Description</label>
              <textarea
                className="cp-textarea"
                placeholder="Describe your complaint in detail."
              />
            </div>
          </div>

          {/* Right column */}
          <div className="cp-right">
            <div className="cp-field">
              <label className="cp-label">Attachment</label>

              <div className="cp-upload">
                <span className="cp-upload-text">Upload file</span>
                <span className="cp-upload-ico" aria-hidden="true">
                  <IconClip />
                </span>
                <input className="cp-file" type="file" />
              </div>
            </div>

            <div className="cp-submit-wrap">
              <button className="cp-submit-btn">Submit</button>

               <Link to="/complaint-status" className="cp-link">
                  View previous complaint status...
                </Link>
            </div>


          </div>
        </div>
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
