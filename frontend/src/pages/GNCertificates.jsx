import { Link } from "react-router-dom";
import "../styles/gnDashboard.css";
import "../styles/gnCertificates.css";

/* --- Icons (inline SVG) --- */
function IconHome() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
function IconPeople() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="currentColor" strokeWidth="2" />
      <path d="M2 21a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 7a3 3 0 1 0 0 .01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconDoc() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 3h7l3 3v15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M14 3v4h4" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function IconFlag() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M6 3v18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 4h10l-2 4 2 4H6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
function IconBell() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z" stroke="currentColor" strokeWidth="2" />
      <path d="M9.5 19a2.5 2.5 0 0 0 5 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconCoin() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="7" rx="8" ry="3" stroke="currentColor" strokeWidth="2" />
      <path d="M4 7v10c0 1.7 3.6 3 8 3s8-1.3 8-3V7" stroke="currentColor" strokeWidth="2" />
      <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function IconSearch() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" stroke="currentColor" strokeWidth="2" />
      <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconProfile() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="#0B2B16" strokeWidth="2" />
      <path d="M4 20a8 8 0 0 1 16 0" stroke="#0B2B16" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconSettings() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" stroke="currentColor" strokeWidth="2" />
      <path
        d="M19.4 15a7.7 7.7 0 0 0 .1-1l2-1.2-2-3.4-2.3.6a7.4 7.4 0 0 0-1.7-1L15 6h-6l-.5 2.4a7.4 7.4 0 0 0-1.7 1l-2.3-.6-2 3.4 2 1.2a7.7 7.7 0 0 0 0 2l-2 1.2 2 3.4 2.3-.6a7.4 7.4 0 0 0 1.7 1L9 22h6l.5-2.4a7.4 7.4 0 0 0 1.7-1l2.3.6 2-3.4-2-1.2a7.7 7.7 0 0 0-.1-1Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function GNCertificates() {
  const rows = [
    { id: "#20240001", name: "Nimal Perera", type: "Income\nCertificate", status: "Pending", date: "2024-07-26" },
    { id: "#20240002", name: "Kamala Silva", type: "Residence\nCertificate", status: "Approved", date: "2024-07-25" },
    { id: "#20240003", name: "Rohan Fernando", type: "Character\nCertificate", status: "Rejected", date: "2024-07-24" },
    { id: "#20240004", name: "Lakshmi Devi", type: "Residence\nCertificate", status: "Pending", date: "2024-07-23" },
    { id: "#20240005", name: "Arun Kumar", type: "Obtaining\nhousing loan\napproval", status: "Approved", date: "2024-07-22" },
    { id: "#20240006", name: "Priya Sharma", type: "Character\nCertificate", status: "Pending", date: "2024-07-21" },
    { id: "#20240007", name: "Suresh Verma", type: "Death Certificate", status: "Rejected", date: "2024-07-20" },
    { id: "#20240008", name: "Deepa Patel", type: "Residence\nCertificate", status: "Approved", date: "2024-07-19" },
    { id: "#20240009", name: "Rajesh Singh", type: "Birth Certificate", status: "Pending", date: "2024-07-18" },
    { id: "#20240010", name: "Anita Gupta", type: "Residence\nCertificate", status: "Approved", date: "2024-07-17" },
  ];

  const pillClass = (s) => {
    if (s === "Approved") return "gnc-pill gnc-pill-approved";
    if (s === "Rejected") return "gnc-pill gnc-pill-rejected";
    return "gnc-pill"; // Pending
  };

  return (
    <div className="gn-wrap">
      {/* LEFT SIDEBAR */}
      <aside className="gn-sidebar">
        <div className="gn-brand">
          <div className="gn-brand-title">Maspanna Division</div>
          <div className="gn-brand-sub">Grama Niladhari</div>
        </div>

        <nav className="gn-menu">
          <Link to="/gn" className="gn-item">
            <span className="gn-ico"><IconHome /></span>
            <span>Dashboard</span>
          </Link>

          <Link to="/gn-households" className="gn-item">
            <span className="gn-ico"><IconPeople /></span>
            <span>Households</span>
          </Link>

          <Link to="/gn-certificates" className="gn-item gn-item-active">
            <span className="gn-ico"><IconDoc /></span>
            <span>Certificates</span>
          </Link>

          <Link to="/gn-complaints" className="gn-item">
            <span className="gn-ico"><IconFlag /></span>
            <span>Complaints</span>
          </Link>

          <Link to="/gn-notices" className="gn-item">
            <span className="gn-ico"><IconBell /></span>
            <span>Notices</span>
          </Link>

          <Link to="/gn-allowances" className="gn-item">
            <span className="gn-ico"><IconCoin /></span>
            <span>Allowances &amp; Aids</span>
          </Link>
        </nav>

        <div className="gn-settings">
          <Link to="/gn/settings" className="gn-item gn-item-settings">
            <span className="gn-ico"><IconSettings /></span>
            <span>Settings</span>
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="gn-main">
        {/* TOP BAR */}
        <div className="gn-topbar">
          <div className="gn-top-left">GN Digital System</div>

          <div className="gn-search">
            <input className="gn-search-input" type="text" />
            <span className="gn-search-ico"><IconSearch /></span>
          </div>

          <div className="gn-top-right">
            <div className="gn-profile-circle">
              <IconProfile />
            </div>
          </div>
        </div>

        {/* PAGE BODY */}
        <div className="gnc-page">
          <h1 className="gnc-title">Certificate Requests</h1>

          <div className="gnc-table-wrap">
            <table className="gnc-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Householder Name</th>
                  <th>Certificate Type</th>
                  <th>Status</th>
                  <th>Request Date</th>
                  <th className="gnc-actions-head">Actions</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td className="gnc-id">{r.id}</td>
                    <td className="gnc-name">{r.name}</td>
                    <td className="gnc-type">
                      {r.type.split("\n").map((line, i) => (
                        <span key={i} className="gnc-type-line">
                          {line}
                        </span>
                      ))}
                    </td>
                    <td>
                      <span className={pillClass(r.status)}>{r.status}</span>
                    </td>
                    <td className="gnc-date">{r.date}</td>
                    <td className="gnc-actions">
                      <span className="gnc-action">View Details</span>
                      <span className="gnc-sep">|</span>
                      <span className="gnc-action">Verify Data</span>
                      <span className="gnc-sep">|</span>
                      <span className="gnc-action">Generate Certificate</span>
                      <span className="gnc-sep">|</span>
                      <span className="gnc-action">Forward</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
