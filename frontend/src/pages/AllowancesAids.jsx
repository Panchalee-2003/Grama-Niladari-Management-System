import { Link } from "react-router-dom";
import "../styles/allowancesAids.css";

function IconHome() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-10.5Z"
        stroke="#0B0B0B"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M16 11a4 4 0 1 0-8 0"
        stroke="#0B0B0B"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M4 21a8 8 0 0 1 16 0"
        stroke="#0B0B0B"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconDoc() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 3h7l3 3v15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
        stroke="#0B0B0B"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M14 3v4h4"
        stroke="#0B0B0B"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconFlag() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 3v18"
        stroke="#0B0B0B"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M6 4h11l-1.5 3L17 10H6"
        stroke="#0B0B0B"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconBell() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z"
        stroke="#0B0B0B"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 19a2.5 2.5 0 0 0 5 0"
        stroke="#0B0B0B"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconAid() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12h14"
        stroke="#0B0B0B"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 5v14"
        stroke="#0B0B0B"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="4"
        stroke="#0B0B0B"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function IconGear() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
        stroke="#0B0B0B"
        strokeWidth="1.8"
      />
      <path
        d="M19.4 15a8.2 8.2 0 0 0 .1-1 8.2 8.2 0 0 0-.1-1l2-1.5-2-3.4-2.4 1a8 8 0 0 0-1.7-1L15 3h-6l-.3 2.1a8 8 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.5a8.2 8.2 0 0 0-.1 1c0 .34.03.67.1 1l-2 1.5 2 3.4 2.4-1c.54.4 1.1.73 1.7 1L9 21h6l.3-2.1c.6-.27 1.16-.6 1.7-1l2.4 1 2-3.4-2-1.5Z"
        stroke="#0B0B0B"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="6.5" stroke="#0B0B0B" strokeWidth="1.8" />
      <path
        d="M20 20l-3.4-3.4"
        stroke="#0B0B0B"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconProfile() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
        stroke="#0B0B0B"
        strokeWidth="1.8"
      />
      <path
        d="M4 20a8 8 0 0 1 16 0"
        stroke="#0B0B0B"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconDownload() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3v10"
        stroke="#0B0B0B"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M8 10l4 4 4-4"
        stroke="#0B0B0B"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M4 21h16"
        stroke="#0B0B0B"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconFile() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 3h8l3 3v15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
        stroke="#0B0B0B"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M15 3v4h4"
        stroke="#0B0B0B"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const mockRows = [
  { id: "12345", name: "Samantha Patel", nic: "12345678" },
  { id: "67890", name: "Ethan Silva", nic: "12345678" },
  { id: "24680", name: "Isabella Rodriguez", nic: "12345678" },
  { id: "13579", name: "Noah Chen", nic: "12345678" },
  { id: "98765", name: "Olivia Kapoor", nic: "12345678" },
  { id: "54321", name: "Liam O'Malley", nic: "12345678" },
  { id: "11223", name: "Ava Dubois", nic: "12345678" },
  { id: "33445", name: "Jackson Lee", nic: "12345678" },
];

function AllowancesAids() {
  return (
    <div className="aa-page">
      {/* Sidebar */}
      <aside className="aa-sidebar">
        <div className="aa-sideTop">
          <div className="aa-sideTitle">Maspanna Division</div>
          <div className="aa-sideSub">Grama Niladhari</div>
        </div>

        <nav className="aa-nav">
          <Link className="aa-navItem" to="/gn">
            <span className="aa-navIcon"><IconHome /></span>
            <span className="aa-navText">Dashboard</span>
          </Link>
          <Link className="aa-navItem" to="/gn-households">
            <span className="aa-navIcon"><IconUsers /></span>
            <span className="aa-navText">Households</span>
          </Link>
          <Link className="aa-navItem" to="/gn-certificates">
            <span className="aa-navIcon"><IconDoc /></span>
            <span className="aa-navText">Certificates</span>
          </Link>
          <Link className="aa-navItem" to="/gn-complaints">
            <span className="aa-navIcon"><IconFlag /></span>
            <span className="aa-navText">Complaints</span>
          </Link>
          <Link className="aa-navItem" to="/gn-notices">
            <span className="aa-navIcon"><IconBell /></span>
            <span className="aa-navText">Notices</span>
          </Link>
          <Link className="aa-navItem aa-active" to="/gn-allowances">
            <span className="aa-navIcon"><IconAid /></span>
            <span className="aa-navText">Allowances &amp; Aids</span>
          </Link>
        </nav>

        <div className="aa-sideBottom">
          <Link className="aa-settings" to="/gn">
            <span className="aa-navIcon"><IconGear /></span>
            <span className="aa-navText">Settings</span>
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="aa-main">
        {/* Top bar */}
        <div className="aa-topbar">
          <div className="aa-topLeft">GN Digital System</div>
          <div className="aa-topCenter">
            <div className="aa-searchWrap">
              <input className="aa-searchBar" type="text" />
              <div className="aa-searchIcon"><IconSearch /></div>
            </div>
          </div>
          <div className="aa-topRight">
            <div className="aa-profileCircle">
              <IconProfile />
            </div>
          </div>
        </div>

        <div className="aa-divider" />

        {/* Content */}
        <section className="aa-content">
          <h1 className="aa-h1">Allowances &amp; Aids</h1>
          <p className="aa-sub">
            Manage citizen eligibility and approves for various aid programs.
          </p>

          <div className="aa-grid">
            {/* Filters */}
            <div className="aa-filters">
              <div className="aa-sectionTitle">Filter Citizens</div>

              <div className="aa-field">
                <div className="aa-label">By Age Group</div>
                <select className="aa-select" defaultValue="">
                  <option value="" disabled>
                    Select  Age  Group
                  </option>
                  <option>18 - 25</option>
                  <option>26 - 40</option>
                  <option>41 - 60</option>
                  <option>60+</option>
                </select>
              </div>

              <div className="aa-field">
                <div className="aa-label">By Income Level</div>
                <select className="aa-select" defaultValue="">
                  <option value="" disabled>
                    Select  Income  Level
                  </option>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              <div className="aa-field">
                <div className="aa-label">By Employment Type</div>
                <select className="aa-select" defaultValue="">
                  <option value="" disabled>
                    Select  Employment  Type
                  </option>
                  <option>Employed</option>
                  <option>Self-employed</option>
                  <option>Unemployed</option>
                </select>
              </div>

              <div className="aa-field">
                <div className="aa-label">By Household Size</div>
                <select className="aa-select" defaultValue="">
                  <option value="" disabled>
                    Select  Household  Size
                  </option>
                  <option>1 - 2</option>
                  <option>3 - 4</option>
                  <option>5+</option>
                </select>
              </div>

              <div className="aa-field">
                <div className="aa-label">By Aid Type</div>
                <select className="aa-select" defaultValue="">
                  <option value="" disabled>
                    Select  Household  Size
                  </option>
                  <option>Food</option>
                  <option>Medical</option>
                  <option>Education</option>
                </select>
              </div>

              <div className="aa-field">
                <div className="aa-label">People with special needs</div>
                <select className="aa-select" defaultValue="">
                  <option value="" disabled>
                    Select  Status
                  </option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>

              <div className="aa-applyRow">
                <button className="aa-applyBtn" type="button">
                  Apply Filters
                </button>
              </div>
            </div>

            {/* Eligible citizens */}
            <div className="aa-right">
              <div className="aa-rightHeader">
                <div className="aa-rightTitle">Eligible citizens</div>

                <div className="aa-actions">
                  <button className="aa-iconBtn" type="button" aria-label="download">
                    <IconDownload />
                  </button>
                  <button className="aa-iconBtn" type="button" aria-label="file">
                    <IconFile />
                  </button>

                  <button className="aa-csvBtn" type="button">
                    <span className="aa-csvIcon"><IconDownload /></span>
                    Download CSV
                  </button>
                </div>
              </div>

              <div className="aa-card">
                <div className="aa-tableHead">
                  <div className="aa-th">Member_ID</div>
                  <div className="aa-th">Name</div>
                  <div className="aa-th">NIC<br />NO</div>
                </div>

                {mockRows.map((r) => (
                  <div className="aa-row" key={r.id}>
                    <div className="aa-td aa-id">{r.id}</div>
                    <div className="aa-td aa-name">{r.name}</div>
                    <div className="aa-td aa-nic">{r.nic}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AllowancesAids;
