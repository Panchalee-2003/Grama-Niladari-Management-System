import { Link } from "react-router-dom";
import "../styles/householdVerify.css";

/* ========== ICONS (same style) ========== */
function IconDashboard() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 13h7V4H4v9Zm9 7h7V11h-7v9ZM4 20h7v-5H4v5Zm9-11h7V4h-7v5Z"
        stroke="#0b2b16"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconPeople() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M16 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3Z" stroke="#0b2b16" strokeWidth="2" />
      <path d="M6 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3Z" stroke="#0b2b16" strokeWidth="2" />
      <path
        d="M6 13c-2.2 0-4 1.3-4 3v2h8v-2c0-1.7-1.8-3-4-3Z"
        stroke="#0b2b16"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M16 13c-2.2 0-4 1.3-4 3v2h10v-2c0-1.7-1.8-3-4-3Z"
        stroke="#0b2b16"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconDoc() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M7 3h7l3 3v15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" stroke="#0b2b16" strokeWidth="2"/>
      <path d="M14 3v4h4" stroke="#0b2b16" strokeWidth="2"/>
    </svg>
  );
}

function IconFlag() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M5 3v18" stroke="#0b2b16" strokeWidth="2" strokeLinecap="round"/>
      <path
        d="M5 4h12l-2 4 2 4H5"
        stroke="#0b2b16"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconBell() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z" stroke="#0b2b16" strokeWidth="2"/>
      <path d="M9.5 19a2.5 2.5 0 0 0 5 0" stroke="#0b2b16" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function IconCoins() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M21 7c0 2.2-4 4-9 4S3 9.2 3 7s4-4 9-4 9 1.8 9 4Z" stroke="#0b2b16" strokeWidth="2"/>
      <path d="M21 12c0 2.2-4 4-9 4s-9-1.8-9-4" stroke="#0b2b16" strokeWidth="2"/>
      <path d="M21 17c0 2.2-4 4-9 4s-9-1.8-9-4" stroke="#0b2b16" strokeWidth="2"/>
    </svg>
  );
}

function IconSearch() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z" stroke="#111" strokeWidth="2"/>
      <path d="M16.5 16.5 21 21" stroke="#111" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function IconUserCircle() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="#fff" strokeWidth="2"/>
      <path d="M4 20a8 8 0 0 1 16 0" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function IconGear() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
        stroke="#0b2b16"
        strokeWidth="2"
      />
      <path
        d="M19.4 15a7.9 7.9 0 0 0 .1-2l2-1.2-2-3.5-2.2.7a7.2 7.2 0 0 0-1.7-1L15 5h-6l-.6 2.9a7.2 7.2 0 0 0-1.7 1L4.5 8.3l-2 3.5 2 1.2a7.9 7.9 0 0 0 .1 2l-2 1.2 2 3.5 2.2-.7a7.2 7.2 0 0 0 1.7 1L9 23h6l.6-2.9a7.2 7.2 0 0 0 1.7-1l2.2.7 2-3.5-2-1.2Z"
        stroke="#0b2b16"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M15 18 9 12l6-6" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M9 18l6-6-6-6" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function HouseholdVerify() {
  return (
    <div className="hv-wrap">
      {/* SIDEBAR */}
      <aside className="hv-sidebar">
        <div className="hv-side-title">
          <div className="hv-side-main">Maspanna Division</div>
          <div className="hv-side-sub">Grama Niladhari</div>
        </div>

        <nav className="hv-menu">
          <Link className="hv-item" to="/gn">
            <span className="hv-ico"><IconDashboard /></span>
            <span>Dashboard</span>
          </Link>

          <Link className="hv-item hv-item-active" to="/gn-households">
            <span className="hv-ico"><IconPeople /></span>
            <span>Households</span>
          </Link>

          <Link className="hv-item" to="/gn-certificates">
            <span className="hv-ico"><IconDoc /></span>
            <span>Certificates</span>
          </Link>

          <Link className="hv-item" to="/gn-complaints">
            <span className="hv-ico"><IconFlag /></span>
            <span>Complaints</span>
          </Link>

          <Link className="hv-item" to="/gn-notices">
            <span className="hv-ico"><IconBell /></span>
            <span>Notices</span>
          </Link>

          <Link className="hv-item" to="/gn-allowances">
            <span className="hv-ico"><IconCoins /></span>
            <span>Allowances &amp; Aids</span>
          </Link>
        </nav>

        <div className="hv-settings">
          <Link className="hv-settings-btn" to="/gn-settings" aria-label="settings">
            <IconGear />
            <span>Settings</span>
          </Link>
        </div>
      </aside>

      {/* MAIN */}
      <section className="hv-main">
        {/* TOP BAR */}
        <header className="hv-topbar">
          <div className="hv-top-title">GN Digital System</div>

          <div className="hv-top-search">
            <input className="hv-top-search-input" />
          </div>

          <div className="hv-top-icons">
            <div className="hv-top-search-ico" aria-label="search">
              <IconSearch />
            </div>
            <div className="hv-profile" aria-label="profile">
              <IconUserCircle />
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="hv-content">
          <h1 className="hv-h1">Household Registrations</h1>
          <div className="hv-sub">
            Manage and process household registrations within your division
          </div>

          {/* BIG SEARCH */}
          <div className="hv-big-search">
            <span className="hv-big-search-ico">
              <IconSearch />
            </span>
            <div className="hv-big-search-text">
              Search by Household ID or Householder’s Name
            </div>
          </div>

          {/* FILTER CHIPS */}
          <div className="hv-chips">
            <div className="hv-chip">Pending</div>
            <div className="hv-chip">Verified</div>
            <div className="hv-chip">Rejected</div>
          </div>

          {/* SORT */}
          <div className="hv-sort">
            <div className="hv-sort-box">
              <div className="hv-sort-text">Sort by Date</div>
              <div className="hv-sort-caret">˅</div>
            </div>
          </div>

          {/* LIST */}
          <div className="hv-list">
            <div className="hv-row">
             <p className="hv-status pending">Status: Pending</p>
              <div className="hv-id">Household ID: 2024-001</div>
              <div className="hv-meta">Householder: Anika Silva</div>
              <div className="hv-meta">Address: 123, Main Street, Maspanna</div>
              <button className="hv-view">View Details</button>
              <div className="hv-divider" />
            </div>

            <div className="hv-row">
             <p className="hv-status verified">Status: Verified</p>
              <div className="hv-id">Household ID: 2024-002</div>
              <div className="hv-meta">Householder: Rohan Perera</div>
              <div className="hv-meta">Address: 456, Lake Road, Maspanna</div>
              <button className="hv-view">View Details</button>
              <div className="hv-divider" />
            </div>

            <div className="hv-row">
              <p className="hv-status rejected">Status: Rejected</p>
              <div className="hv-id">Household ID: 2024-003</div>
              <div className="hv-meta">Householder: Chaya Fernando</div>
              <div className="hv-meta">Address: 789, Hillside Avenue, Maspanna</div>
              <button className="hv-view">View Details</button>
              <div className="hv-divider" />
            </div>
          </div>

          {/* PAGINATION */}
          <div className="hv-pagination">
            <button className="hv-page-btn" aria-label="prev"><IconChevronLeft /></button>
            <button className="hv-page-btn" aria-label="next"><IconChevronRight /></button>
          </div>
        </main>
      </section>
    </div>
  );
}
