import { Link } from "react-router-dom";
import "../styles/postNotice.css";

/* ---------- Icons (SVG) ---------- */
function IconDashboard() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M4 4h7v7H4V4ZM13 4h7v7h-7V4ZM4 13h7v7H4v-7ZM13 13h7v7h-7v-7Z" stroke="#0b0b0b" strokeWidth="2" />
    </svg>
  );
}
function IconUsers() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z" stroke="#0b0b0b" strokeWidth="2" />
      <path d="M4 20a8 8 0 0 1 16 0" stroke="#0b0b0b" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconDoc() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M7 3h7l3 3v15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" stroke="#0b0b0b" strokeWidth="2" />
      <path d="M14 3v4h4" stroke="#0b0b0b" strokeWidth="2" />
    </svg>
  );
}
function IconFlag() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M6 3v18" stroke="#0b0b0b" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 4h11l-2 4 2 4H6" stroke="#0b0b0b" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
function IconBell() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z" stroke="#0b0b0b" strokeWidth="2" />
      <path d="M9.5 19a2.5 2.5 0 0 0 5 0" stroke="#0b0b0b" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconCoin() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 20c4.418 0 8-1.79 8-4s-3.582-4-8-4-8 1.79-8 4 3.582 4 8 4Z" stroke="#0b0b0b" strokeWidth="2" />
      <path d="M4 16V8" stroke="#0b0b0b" strokeWidth="2" />
      <path d="M20 16V8" stroke="#0b0b0b" strokeWidth="2" />
      <path d="M12 12c4.418 0 8-1.79 8-4s-3.582-4-8-4-8 1.79-8 4 3.582 4 8 4Z" stroke="#0b0b0b" strokeWidth="2" />
    </svg>
  );
}
function IconSearch() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" stroke="#111" strokeWidth="2" />
      <path d="M21 21l-4.3-4.3" stroke="#111" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconProfile() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="#fff" strokeWidth="2" />
      <path d="M4 20a8 8 0 0 1 16 0" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconCalendar() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M7 3v3M17 3v3" stroke="#2f6b45" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 7h16" stroke="#2f6b45" strokeWidth="2" />
      <path d="M6 5h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" stroke="#2f6b45" strokeWidth="2" />
    </svg>
  );
}

export default function PostNotice() {
  // UI only (dummy rows like figma)
  const rows = [
    { title: "Notice 1", desc: "Description for Notice 1", date: "2024-01-20" },
    { title: "Notice 2", desc: "Description for Notice 2", date: "2024-01-15" },
    { title: "Notice 3", desc: "Description for Notice 3", date: "2024-01-10" },
  ];

  return (
    <div className="pn-wrap">
      {/* SIDEBAR */}
      <aside className="pn-sidebar">
        <div className="pn-brand">
          <div className="pn-brand-title">Maspanna Division</div>
          <div className="pn-brand-sub">Grama Niladhari</div>
        </div>

        <nav className="pn-menu">
          <Link className="pn-item" to="/gn">
            <span className="pn-ico"><IconDashboard /></span>
            <span>Dashboard</span>
          </Link>

          <Link className="pn-item" to="/gn-households">
            <span className="pn-ico"><IconUsers /></span>
            <span>Households</span>
          </Link>

          <Link className="pn-item" to="/gn-certificates">
            <span className="pn-ico"><IconDoc /></span>
            <span>Certificates</span>
          </Link>

          <Link className="pn-item" to="/gn-complaints">
            <span className="pn-ico"><IconFlag /></span>
            <span>Complaints</span>
          </Link>

          {/* ACTIVE */}
          <Link className="pn-item pn-active" to="/gn-notices">
            <span className="pn-ico"><IconBell /></span>
            <span>Notices</span>
          </Link>

          <Link className="pn-item" to="/gn-allowances">
            <span className="pn-ico"><IconCoin /></span>
            <span>Allowances &amp; Aids</span>
          </Link>
        </nav>

        <div className="pn-settings">
          <span className="pn-gear">⚙</span>
          <span>Settings</span>
        </div>
      </aside>

      {/* MAIN */}
      <section className="pn-main">
        {/* TOP BAR */}
        <div className="pn-topbar">
          <div className="pn-top-title">GN Digital System</div>

          <div className="pn-top-search" aria-hidden="true" />

          <div className="pn-top-actions">
            <div className="pn-search-ico"><IconSearch /></div>
            <div className="pn-profile">
              <IconProfile />
            </div>
          </div>
        </div>

        <div className="pn-content">
          <h1 className="pn-h1">Public Notices</h1>
          <div className="pn-sub">
            Create and manage public notices for the maspanna Division
          </div>

          {/* FORM BLOCK */}
          <div className="pn-form">
            <div className="pn-field">
              <div className="pn-label">Title</div>
              <input className="pn-input" placeholder="Enter notice title" />
            </div>

            <div className="pn-field">
              <div className="pn-label">Description</div>
              <textarea className="pn-textarea" />
            </div>

            <div className="pn-field pn-date">
              <div className="pn-label">Date</div>
              <div className="pn-date-wrap">
                <input className="pn-input" />
                <span className="pn-cal"><IconCalendar /></span>
              </div>
            </div>

            <div className="pn-field">
              <div className="pn-label">Image Upload (optional)</div>

              <label className="pn-upload">
                <input className="pn-upload-input" type="file" accept="image/*" />
                <span className="pn-upload-icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M12 16V4" stroke="#2f6b45" strokeWidth="2" strokeLinecap="round" />
                    <path d="M7 9l5-5 5 5" stroke="#2f6b45" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 20h16" stroke="#2f6b45" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
              </label>
            </div>


            <button className="pn-btn" type="button">
              Post Notice
            </button>
          </div>

          {/* PREVIOUS NOTICES */}
          <h2 className="pn-h2">Previous Notices</h2>

          <div className="pn-table">
            <div className="pn-thead">
              <div>Title</div>
              <div>Description</div>
              <div>Date</div>
              <div className="pn-actions-col">Actions</div>
            </div>

            {rows.map((r, i) => (
              <div className="pn-row" key={i}>
                <div className="pn-cell">{r.title}</div>
                <div className="pn-cell pn-muted">{r.desc}</div>
                <div className="pn-cell pn-muted">{r.date}</div>
                <div className="pn-cell pn-actions">
                  <span className="pn-link">Edit</span>
                  <span className="pn-sep">|</span>
                  <span className="pn-link">Delete</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
