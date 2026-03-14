import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/certificateRequest.css";
import emblem from "../assets/emblem.png";
import NotificationDropdown from "../components/NotificationDropdown";
import api from "../api/api";

const CERT_TYPES = [
  "Residence and character Certificate",
  "Income Certificate",
  "Registration of delayed births",
  "Request for financial assistance from the President's fund for medical treatment",
  "Housing Loan Approval ",
  "Application for obtaining housing loan funds",
  "Notification of the death of a pensioner",
];

function statusBadge(s) {
  const map = {
    PENDING: { label: "Pending", cls: "cr-badge cr-badge-pending" },
    APPROVED: { label: "Approved", cls: "cr-badge cr-badge-approved" },
    REJECTED: { label: "Rejected", cls: "cr-badge cr-badge-rejected" },
  };
  return map[s] || { label: s, cls: "cr-badge" };
}

function formatDate(ts) {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "2-digit" });
}

/* --- Icons --- */
function IconHome() { return <svg className="gn-nav-icon" viewBox="0 0 24 24" fill="none"><path d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5Z" stroke="#2b2b2b" strokeWidth="2" strokeLinejoin="round" /></svg>; }
function IconUser() { return <svg className="gn-nav-icon" viewBox="0 0 24 24" fill="none"><path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="#2b2b2b" strokeWidth="2" /><path d="M4 21a8 8 0 0 1 16 0" stroke="#2b2b2b" strokeWidth="2" strokeLinecap="round" /></svg>; }
function IconDoc() { return <svg className="gn-nav-icon" viewBox="0 0 24 24" fill="none"><path d="M7 3h7l3 3v15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" stroke="#2b2b2b" strokeWidth="2" strokeLinejoin="round" /><path d="M14 3v4h4" stroke="#2b2b2b" strokeWidth="2" /></svg>; }
function IconComplaint() { return <svg className="gn-nav-icon" viewBox="0 0 24 24" fill="none"><path d="M7 3h10a2 2 0 0 1 2 2v16l-4-3H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" stroke="#2b2b2b" strokeWidth="2" strokeLinejoin="round" /><path d="M8 8h8M8 12h6" stroke="#2b2b2b" strokeWidth="2" strokeLinecap="round" /></svg>; }
function IconBell() { return <svg className="gn-nav-icon" viewBox="0 0 24 24" fill="none"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z" stroke="#2b2b2b" strokeWidth="2" strokeLinejoin="round" /><path d="M10 19a2 2 0 0 0 4 0" stroke="#2b2b2b" strokeWidth="2" strokeLinecap="round" /></svg>; }
function ProfileIcon() { return <svg className="gn-profile-ico" viewBox="0 0 24 24" fill="none"><path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="#1c1c1c" strokeWidth="2" /><path d="M4 20a8 8 0 0 1 16 0" stroke="#1c1c1c" strokeWidth="2" strokeLinecap="round" /></svg>; }

export default function CertificateRequest() {
  /* Form state */
  const [certType, setCertType] = useState("");
  const [purpose, setPurpose] = useState("");
  const [nicNumber, setNicNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  /* Citizen profile + family members */
  const [myNic, setMyNic] = useState("");
  const [myName, setMyName] = useState("");
  const [members, setMembers] = useState([]);
  const [selectedFor, setSelectedFor] = useState("self");

  /* Request history */
  const [requests, setRequests] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState("");

  const loadRequests = async () => {
    setListLoading(true);
    try {
      const r = await api.get("/api/certificate/my");
      if (r.data.ok) setRequests(r.data.requests);
    } catch {
      setListError("Failed to load your requests.");
    } finally {
      setListLoading(false);
    }
  };

  /* Load citizen profile NIC + family members on mount */
  useEffect(() => {
    loadRequests();
    // Load citizen NIC from household registration profile
    api.get("/api/citizen/me/profile").then(r => {
      if (r.data.ok && r.data.profile) {
        const nic = r.data.profile.nic || "";
        const name = r.data.profile.full_name || "Myself";
        setMyNic(nic);
        setMyName(name);
        setNicNumber(nic);
      }
    }).catch(() => {});
    // Load family members for dropdown
    api.get("/api/certificate/my-members").then(r => {
      if (r.data.ok) setMembers(r.data.members);
    }).catch(() => {});
  }, []);

  /* When "Request for" selection changes, auto-fill NIC */
  const handleSelectFor = (e) => {
    const val = e.target.value;
    setSelectedFor(val);
    if (val === "self") {
      setNicNumber(myNic);
    } else {
      const member = members.find(m => String(m.member_id) === val);
      if (member) setNicNumber(member.nic_number || "");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(""); setSubmitSuccess("");
    if (!certType) { setSubmitError("Please select a certificate type."); return; }
    if (!nicNumber.trim()) { setSubmitError("Please enter your NIC number."); return; }

    setSubmitting(true);
    try {
      await api.post("/api/certificate", { cert_type: certType, purpose, nic_number: nicNumber });
      setSubmitSuccess("✅ Your request has been submitted successfully!");
      setCertType(""); setPurpose(""); setSelectedFor("self"); setNicNumber(myNic);
      loadRequests();
    } catch (ex) {
      setSubmitError(ex.response?.data?.error || "Failed to submit request.");
    } finally {
      setSubmitting(false);
    }
  };

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
        <div className="gn-header-right" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link to="/about" className="gn-about-btn">About Us</Link>
          <NotificationDropdown />
          <div className="gn-profile-btn" role="button" tabIndex={0} aria-label="Profile"><ProfileIcon /></div>
        </div>
      </header>

      {/* Nav */}
      <nav className="gn-nav">
        <Link to="/citizen" className="gn-nav-item"><IconHome /><span>Home</span></Link>
        <Link to="/household" className="gn-nav-item"><IconUser /><span>Household</span></Link>
        <Link to="/certificates" className="gn-nav-item gn-nav-active"><IconDoc /><span>Certificates</span></Link>
        <Link to="/complaints" className="gn-nav-item"><IconComplaint /><span>Complaints</span></Link>
        <Link to="/notices" className="gn-nav-item"><IconBell /><span>Notices</span></Link>
      </nav>

      {/* Content */}
      <main className="gn-content">
        <div className="gn-form-wrap">
          <h2 className="gn-form-title">Certificate Request Form</h2>
          <p className="gn-form-sub">Submit a request for official certificates issued by the Grama Niladhari office.</p>

          {submitSuccess && <div className="cr-alert cr-alert-ok">{submitSuccess}</div>}
          {submitError && <div className="cr-alert cr-alert-err">{submitError}</div>}

          <form className="gn-form-grid" onSubmit={handleSubmit}>
            {/* Left column */}
            <div className="gn-left-col">
              <div className="gn-field">
                <label className="cr-label">Certificate Type <span className="cr-req">*</span></label>
                <select className="gn-input gn-select" value={certType} onChange={e => setCertType(e.target.value)}>
                  <option value="">Select Certificate Type</option>
                  {CERT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="gn-field">
                <label className="cr-label">Requesting For <span className="cr-req">*</span></label>
                <select className="gn-input gn-select" value={selectedFor} onChange={handleSelectFor}>
                  <option value="self">{myName || "Myself"}</option>
                  {members.map(m => (
                    <option key={m.member_id} value={String(m.member_id)}>
                      {m.full_name} ({m.relationship_to_head})
                    </option>
                  ))}
                </select>
              </div>

              <div className="gn-field">
                <label className="cr-label">NIC Number <span className="cr-req">*</span></label>
                <input
                  className="gn-input"
                  type="text"
                  placeholder="e.g. 200012345678 or 991234567V"
                  value={nicNumber}
                  onChange={e => setNicNumber(e.target.value)}
                  maxLength={12}
                />
                <span style={{ fontSize: "0.78rem", color: "#888", marginTop: "4px", display: "block" }}>
                  Auto-filled from household registration. Edit if needed.
                </span>
              </div>

              <div className="gn-field">
                <label className="cr-label">Purpose / Additional Information</label>
                <textarea className="gn-textarea" placeholder="Describe the purpose of the certificate request…" value={purpose} onChange={e => setPurpose(e.target.value)} rows={5} />
              </div>

              <div className="gn-submit-row">
                <button className="gn-submit-btn" type="submit" disabled={submitting}>
                  {submitting ? "Submitting…" : "Submit Request"}
                </button>
              </div>
            </div>

            {/* Right column — info */}
            <div className="gn-right-col">
              <div className="cr-info-box">
                <h3>📄 Supported Certificate Types</h3>
                <ul>
                  {CERT_TYPES.map(t => <li key={t}>{t}</li>)}
                </ul>
                <p className="cr-info-note">Your personal details (name, NIC, address) will be automatically filled from your registered profile.</p>
              </div>
            </div>
          </form>
        </div>

        {/* Request History */}
        <div className="cr-history">
          <h2 className="cr-history-title">My Certificate Requests</h2>
          {listLoading && <div className="cr-state">Loading…</div>}
          {listError && <div className="cr-state cr-state-err">{listError}</div>}
          {!listLoading && requests.length === 0 && <div className="cr-state">You have not submitted any requests yet.</div>}

          {!listLoading && requests.length > 0 && (
            <table className="cr-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Type</th>
                  <th>Purpose</th>
                  <th>Status</th>
                  <th>GN Note</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => {
                  const badge = statusBadge(r.status);
                  return (
                    <tr key={r.request_id}>
                      <td className="cr-td-id">#{r.request_id}</td>
                      <td>{r.cert_type}</td>
                      <td className="cr-td-muted">{r.purpose || "—"}</td>
                      <td><span className={badge.cls}>{badge.label}</span></td>
                      <td className="cr-td-muted">{r.gn_note || "—"}</td>
                      <td className="cr-td-date">{formatDate(r.created_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
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
          <div className="gn-copyright">© 2025 Grama Niladhari Division - Maspanna. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
