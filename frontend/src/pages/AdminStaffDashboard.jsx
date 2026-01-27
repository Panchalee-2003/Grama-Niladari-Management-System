import { Link } from "react-router-dom";
import "../styles/adminStaffDashboard.css";

/* ========= ICONS (SVG) ========= */
function IconDashboard() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 11.5L12 4l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V11.5Z"
        stroke="#0b0b0b"
        strokeWidth="2"
      />
    </svg>
  );
}

function IconDoc() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 3h7l3 3v15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
        stroke="#0b0b0b"
        strokeWidth="2"
      />
      <path d="M14 3v4h4" stroke="#0b0b0b" strokeWidth="2" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        stroke="#111"
        strokeWidth="2"
      />
      <path
        d="M21 21l-4.3-4.3"
        stroke="#111"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconUser() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
        stroke="#0b0b0b"
        strokeWidth="2"
      />
      <path
        d="M4 20a8 8 0 0 1 16 0"
        stroke="#0b0b0b"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
        stroke="#0b0b0b"
        strokeWidth="2"
      />
      <path
        d="M19.4 15a7.7 7.7 0 0 0 .1-2l2-1.2-2-3.4-2.3.6a7.6 7.6 0 0 0-1.7-1l-.3-2.3H11l-.3 2.3a7.6 7.6 0 0 0-1.7 1l-2.3-.6-2 3.4 2 1.2a7.7 7.7 0 0 0 .1 2l-2 1.2 2 3.4 2.3-.6a7.6 7.6 0 0 0 1.7 1l.3 2.3h4l.3-2.3a7.6 7.6 0 0 0 1.7-1l2.3.6 2-3.4-2-1.2Z"
        stroke="#0b0b0b"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AdminStaffDashboard() {
  return (
    <div className="asd-page">
      {/* LEFT SIDEBAR */}
      <aside className="asd-sidebar">
        <div className="asd-brand">
          <div className="asd-brand-title">Maspanna Division</div>
          <div className="asd-brand-sub">Grama Niladhari</div>
        </div>

        <div className="asd-nav">
          <Link to="#" className="asd-nav-item asd-nav-active">
            <IconDashboard />
            <span>Dashboard</span>
          </Link>

          <Link to="#" className="asd-nav-item asd-nav-muted">
            <IconDoc />
            <span>Verify Certificates</span>
          </Link>
        </div>

        <div className="asd-settings">
          <Link to="#" className="asd-settings-link">
            <IconSettings />
            <span>Settings</span>
          </Link>
        </div>
      </aside>

      {/* RIGHT CONTENT */}
      <section className="asd-content">
        {/* TOP BAR */}
        <header className="asd-topbar">
          <div className="asd-topbar-title">GN Digital System</div>

          <div className="asd-search-wrap">
            <div className="asd-search-bar" />
            <div className="asd-search-icon">
              <IconSearch />
            </div>
          </div>

          <div className="asd-user-circle" aria-label="profile">
            <IconUser />
          </div>
        </header>

        {/* MAIN */}
        <main className="asd-main">
          {/* CARDS */}
          <div className="asd-cards">
            <div className="asd-card">
              <div className="asd-card-title">Certificates Pending Verification</div>
              <div className="asd-card-value">23</div>
            </div>

            <div className="asd-card">
              <div className="asd-card-title">Certificates Approved (This Month)</div>
              <div className="asd-card-value">150</div>
            </div>

            <div className="asd-card">
              <div className="asd-card-title">Certificates Rejected (This Month)</div>
              <div className="asd-card-value">12</div>
            </div>

            <div className="asd-card">
              <div className="asd-card-title">Recent Verification Requests</div>
              <div className="asd-card-value">45</div>
            </div>
          </div>

          {/* WEEKLY ACTIVITY */}
          <div className="asd-weekly">
            <div className="asd-weekly-title">Weekly Verification Activity</div>

            <div className="asd-weekly-box">
              <div className="asd-weekly-left">
                <div className="asd-weekly-sub">Verifications Processed</div>
                <div className="asd-weekly-num">120</div>
                <div className="asd-weekly-growth">
                  This Month <span>+15%</span>
                </div>
              </div>

              <div className="asd-chart">
                <div className="asd-bars">
                  <div className="asd-bar" />
                  <div className="asd-bar" />
                  <div className="asd-bar" />
                  <div className="asd-bar" />
                </div>

                <div className="asd-bar-labels">
                  <div>Week 1</div>
                  <div>Week 2</div>
                  <div>Week 3</div>
                  <div>Week 4</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </section>
    </div>
  );
}
