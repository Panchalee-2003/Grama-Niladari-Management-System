import { Link } from "react-router-dom";
import "../styles/complaintManagement.css";

// --- simple icons (SVG) ---
function IconDash() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M4 13h7V4H4v9ZM13 20h7v-7h-7v7ZM13 11h7V4h-7v7ZM4 20h7v-5H4v5Z" fill="#0B1B12" />
    </svg>
  );
}
function IconUsers() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3ZM8 11c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3ZM8 13c-2.67 0-8 1.34-8 4v2h12v-2c0-2.66-5.33-4-4-4Zm8 0c-.34 0-.7.02-1.07.05 1.16.84 2.07 1.97 2.07 3.45v2h7v-2c0-2.66-5.33-4-8-4Z" fill="#0B1B12"/>
    </svg>
  );
}
function IconDoc() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M7 3h7l3 3v15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" stroke="#0B1B12" strokeWidth="2"/>
      <path d="M14 3v4h4" stroke="#0B1B12" strokeWidth="2"/>
    </svg>
  );
}
function IconFlag() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M4 21V4" stroke="#0B1B12" strokeWidth="2" strokeLinecap="round"/>
      <path d="M4 5h13l-2 4 2 4H4" stroke="#0B1B12" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  );
}
function IconBell() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z" stroke="#0B1B12" strokeWidth="2"/>
      <path d="M9.5 19a2.5 2.5 0 0 0 5 0" stroke="#0B1B12" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
function IconHand() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M7 22h10c2 0 3-1 3-3v-7c0-1.1-.9-2-2-2h-1V6a2 2 0 1 0-4 0v3H11V5a2 2 0 1 0-4 0v9H6c-1.1 0-2 .9-2 2v1c0 3 2 5 3 5Z" fill="#0B1B12" opacity="0.9"/>
    </svg>
  );
}
function IconSearch() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="#111" strokeWidth="2"/>
      <path d="M16.5 16.5 21 21" stroke="#111" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
function IconProfile() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="#fff" strokeWidth="2"/>
      <path d="M4 20a8 8 0 0 1 16 0" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export default function ComplaintManagement() {
  return (
    <div className="cmp-wrap">
      {/* LEFT SIDEBAR */}
      <aside className="cmp-side">
        <div className="cmp-brand">
          <div className="cmp-brand-title">Maspanna Division</div>
          <div className="cmp-brand-sub">Grama Niladhari</div>
        </div>

        <nav className="cmp-nav">
          <Link className="cmp-item" to="/gn"><span className="cmp-i"><IconDash /></span>Dashboard</Link>
          <Link className="cmp-item" to="/gn-households"><span className="cmp-i"><IconUsers /></span>Households</Link>
          <Link className="cmp-item" to="/gn-certificates"><span className="cmp-i"><IconDoc /></span>Certificates</Link>

          <Link className="cmp-item cmp-active" to="/gn-complaints">
            <span className="cmp-i"><IconFlag /></span>Complaints
          </Link>

          <Link className="cmp-item" to="/gn-notices"><span className="cmp-i"><IconBell /></span>Notices</Link>
          <Link className="cmp-item" to="/gn-allowances"><span className="cmp-i"><IconHand /></span>Allowances &amp; Aids</Link>
        </nav>

        <div className="cmp-side-bottom">
          <div className="cmp-gear">⚙ Settings</div>
        </div>
      </aside>

      {/* MAIN */}
      <section className="cmp-main">
        {/* TOP BAR */}
        <div className="cmp-top">
          <div className="cmp-top-left">GN Digital System</div>

          <div className="cmp-top-center">
            <div className="cmp-search-bar" />
          </div>

          <div className="cmp-top-right">
            <div className="cmp-search-icon"><IconSearch /></div>
            <div className="cmp-profile" aria-label="profile">
              <IconProfile />
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="cmp-content">
          <div className="cmp-title">Complaints Management</div>

          <div className="cmp-tabs">
            <div className="cmp-tab cmp-tab-active">All</div>
            <div className="cmp-tab">Pending</div>
            <div className="cmp-tab">Processed</div>
            <div className="cmp-tab">Completed</div>
          </div>
          <div className="cmp-tabs-line" />

          {/* TABLE CARD */}
          <div className="cmp-card">
            <div className="cmp-table">
              <div className="cmp-row cmp-head">
                <div>Complaint ID</div>
                <div>Subject</div>
                <div>Date Filed</div>
                <div>Status</div>
                <div>Citizen Name</div>
                <div className="cmp-muted">Actions</div>
              </div>

              <div className="cmp-row">
                <div className="cmp-muted">CMP001</div>
                <div className="cmp-muted">Noise Complaint</div>
                <div className="cmp-muted">2024-07-20</div>
                <div><span className="cmp-pill">Pending</span></div>
                <div className="cmp-muted">Liam Carter</div>
                <div className="cmp-actions">
                  <a className="cmp-link" href="#">View Details</a><span className="cmp-sep">|</span>
                  <a className="cmp-link" href="#">Add Response</a>
                </div>
              </div>

              <div className="cmp-row">
                <div className="cmp-muted">CMP002</div>
                <div className="cmp-muted">Road Repair Request</div>
                <div className="cmp-muted">2024-07-18</div>
                <div><span className="cmp-pill">Completed</span></div>
                <div className="cmp-muted">Olivia Bennett</div>
                <div className="cmp-actions">
                  <a className="cmp-link" href="#">View Details</a><span className="cmp-sep">|</span>
                  <a className="cmp-link" href="#">Add Response</a>
                </div>
              </div>

              <div className="cmp-row">
                <div className="cmp-muted">CMP003</div>
                <div className="cmp-muted">Water Leak</div>
                <div className="cmp-muted">2024-07-15</div>
                <div><span className="cmp-pill">Processed</span></div>
                <div className="cmp-muted">Noah Thompson</div>
                <div className="cmp-actions">
                  <a className="cmp-link" href="#">View Details</a><span className="cmp-sep">|</span>
                  <a className="cmp-link" href="#">Add Response</a>
                </div>
              </div>

              <div className="cmp-row">
                <div className="cmp-muted">CMP004</div>
                <div className="cmp-muted">Street Light Outage</div>
                <div className="cmp-muted">2024-07-12</div>
                <div><span className="cmp-pill">Processed</span></div>
                <div className="cmp-muted">Ava Harper</div>
                <div className="cmp-actions">
                  <a className="cmp-link" href="#">View Details</a><span className="cmp-sep">|</span>
                  <a className="cmp-link" href="#">Add Response</a>
                </div>
              </div>

              <div className="cmp-row">
                <div className="cmp-muted">CMP005</div>
                <div className="cmp-muted">Garbage Collection Issue</div>
                <div className="cmp-muted">2024-07-10</div>
                <div><span className="cmp-pill">Pending</span></div>
                <div className="cmp-muted">Ethan Parker</div>
                <div className="cmp-actions">
                  <a className="cmp-link" href="#">View Details</a><span className="cmp-sep">|</span>
                  <a className="cmp-link" href="#">Add Response</a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
