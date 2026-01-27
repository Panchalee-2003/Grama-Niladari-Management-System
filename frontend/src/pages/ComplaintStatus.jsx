import { Link } from "react-router-dom";
import "../styles/complaintStatus.css";
import emblem from "../assets/emblem.png";

// --- Icons (same as your other pages) ---
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

export default function ComplaintStatus() {
  return (
    <div className="cst-page">
      {/* HEADER */}
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

      {/* NAV */}
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
      <main className="cst-main">
        <h1 className="cst-title">Your complaint status</h1>

        <div className="cst-table">
          <div className="cst-row cst-head">
            <div>Complaint No</div>
            <div>Date</div>
            <div>Status</div>
          </div>

          <div className="cst-row">
            <div>01</div>
            <div>2025-10-06</div>
            <div className="cst-status cst-pending">Pending</div>
          </div>

          <div className="cst-row">
            <div>02</div>
            <div>2025-10-05</div>
            <div className="cst-status cst-processing">Processing</div>
          </div>

          <div className="cst-row">
            <div>03</div>
            <div>2025-09-25</div>
            <div className="cst-status cst-completed">Completed</div>
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
