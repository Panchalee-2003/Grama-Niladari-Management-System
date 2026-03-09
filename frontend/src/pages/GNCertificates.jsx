import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "../styles/gnDashboard.css";
import "../styles/gnCertificates.css";
import "../styles/householdVerify.css";
import api from "../api/api";

/* --- Icons --- */
function IconHome() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5Z" stroke="currentColor" strokeWidth="2" /></svg>; }
function IconPeople() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="currentColor" strokeWidth="2" /><path d="M2 21a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>; }
function IconDoc() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M7 3h7l3 3v15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="2" /><path d="M14 3v4h4" stroke="currentColor" strokeWidth="2" /></svg>; }
function IconFlag() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M6 3v18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M6 4h10l-2 4 2 4H6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>; }
function IconBell() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z" stroke="currentColor" strokeWidth="2" /><path d="M9.5 19a2.5 2.5 0 0 0 5 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>; }
function IconCoin() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="7" rx="8" ry="3" stroke="currentColor" strokeWidth="2" /><path d="M4 7v10c0 1.7 3.6 3 8 3s8-1.3 8-3V7" stroke="currentColor" strokeWidth="2" /><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" stroke="currentColor" strokeWidth="2" /></svg>; }
function IconProfile() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="#fff" strokeWidth="2" /><path d="M4 20a8 8 0 0 1 16 0" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>; }
function IconSettings() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" stroke="currentColor" strokeWidth="2" /><path d="M19.4 15a7.7 7.7 0 0 0 .1-1l2-1.2-2-3.4-2.3.6a7.4 7.4 0 0 0-1.7-1L15 6h-6l-.5 2.4a7.4 7.4 0 0 0-1.7 1l-2.3-.6-2 3.4 2 1.2a7.7 7.7 0 0 0 0 2l-2 1.2 2 3.4 2.3-.6a7.4 7.4 0 0 0 1.7 1L9 22h6l.5-2.4a7.4 7.4 0 0 0 1.7-1l2.3.6 2-3.4-2-1.2a7.7 7.7 0 0 0-.1-1Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>; }

const TABS = ["ALL", "PENDING", "APPROVED", "REJECTED"];

function formatDate(ts) {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "2-digit" });
}

export default function GNCertificates() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");
  const [modal, setModal] = useState(null);   // selected request
  const [noteText, setNoteText] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const loadRequests = useCallback(async (status) => {
    setLoading(true); setError("");
    try {
      const params = status && status !== "ALL" ? `?status=${status}` : "";
      const r = await api.get(`/api/certificate/all${params}`);
      if (r.data.ok) setRequests(r.data.requests);
    } catch (ex) {
      setError(ex.response?.data?.error || "Failed to load requests.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadRequests(activeTab); }, [activeTab, loadRequests]);

  const openModal = (req) => {
    setModal(req);
    setNewStatus(req.status);
    setNoteText(req.gn_note || "");
  };
  const closeModal = () => setModal(null);

  const handleSave = async () => {
    if (!modal) return;
    setSaving(true);
    try {
      const r = await api.patch(`/api/certificate/${modal.request_id}/status`, {
        status: newStatus,
        gn_note: noteText,
      });
      if (r.data.ok) {
        setRequests(prev => prev.map(req =>
          req.request_id === modal.request_id
            ? { ...req, status: newStatus, gn_note: noteText }
            : req
        ));
        setModal(prev => ({ ...prev, status: newStatus, gn_note: noteText }));
      }
    } catch (ex) {
      alert(ex.response?.data?.error || "Failed to update status.");
    } finally {
      setSaving(false);
    }
  };

  const pillClass = (s) => {
    if (s === "APPROVED") return "gnc-pill gnc-pill-approved";
    if (s === "REJECTED") return "gnc-pill gnc-pill-rejected";
    return "gnc-pill"; // PENDING
  };

  return (
    <div className="gn-wrap">
      {/* SIDEBAR */}
      <aside className="gn-sidebar">
        <div className="gn-brand">
          <div className="gn-brand-title">Maspanna Division</div>
          <div className="gn-brand-sub">Grama Niladhari</div>
        </div>
        <nav className="gn-menu">
          <Link to="/gn" className="gn-item"><span className="gn-ico"><IconHome /></span><span>Dashboard</span></Link>
          <Link to="/gn-households" className="gn-item"><span className="gn-ico"><IconPeople /></span><span>Households</span></Link>
          <Link to="/gn-certificates" className="gn-item gn-item-active"><span className="gn-ico"><IconDoc /></span><span>Certificates</span></Link>
          <Link to="/gn-complaints" className="gn-item"><span className="gn-ico"><IconFlag /></span><span>Complaints</span></Link>
          <Link to="/gn-notices" className="gn-item"><span className="gn-ico"><IconBell /></span><span>Notices</span></Link>
          <Link to="/gn-allowances" className="gn-item"><span className="gn-ico"><IconCoin /></span><span>Allowances &amp; Aids</span></Link>
        </nav>
        <div className="gn-settings">
          <Link to="/gn/settings" className="gn-item gn-item-settings">
            <span className="gn-ico"><IconSettings /></span><span>Settings</span>
          </Link>
        </div>
      </aside>

      {/* MAIN */}
      <main className="gn-main">
        {/* TOP BAR */}
        <header className="hv-topbar">
          <div className="hv-top-title">GN Digital System</div>
          <div className="hv-top-search">
            <input className="hv-top-search-input" placeholder="Search…" readOnly />
          </div>
          <div className="hv-top-icons">
            <div className="hv-profile" aria-label="profile"><IconProfile /></div>
          </div>
        </header>

        {/* PAGE BODY */}
        <div className="gnc-page">
          <h1 className="gnc-title">Certificate Requests</h1>

          {/* Tab filters */}
          <div className="gnc-tabs">
            {TABS.map(t => (
              <button
                key={t}
                className={`gnc-tab-btn ${activeTab === t ? "gnc-tab-active" : ""}`}
                onClick={() => setActiveTab(t)}
              >
                {t.charAt(0) + t.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {loading && <div className="gnc-state">Loading…</div>}
          {error && <div className="gnc-state gnc-state-err">{error}</div>}
          {!loading && requests.length === 0 && <div className="gnc-state">No requests found.</div>}

          {!loading && requests.length > 0 && (
            <div className="gnc-table-wrap">
              <table className="gnc-table">
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Citizen Name</th>
                    <th>NIC</th>
                    <th>Certificate Type</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((r) => (
                    <tr key={r.request_id}>
                      <td className="gnc-id">#{r.request_id}</td>
                      <td className="gnc-name">{r.citizen_name}</td>
                      <td className="gnc-nic">{r.nic_number || "—"}</td>
                      <td className="gnc-type">{r.cert_type}</td>
                      <td><span className={pillClass(r.status)}>{r.status.charAt(0) + r.status.slice(1).toLowerCase()}</span></td>
                      <td className="gnc-date">{formatDate(r.created_at)}</td>
                      <td className="gnc-actions">
                        <button className="gnc-action-btn" onClick={() => openModal(r)}>Review</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* MODAL */}
      {modal && (
        <div className="gnc-modal-overlay" onClick={closeModal}>
          <div className="gnc-modal" onClick={e => e.stopPropagation()}>
            <button className="gnc-modal-close" onClick={closeModal}>✕</button>

            <h2 className="gnc-modal-title">Certificate Request #{modal.request_id}</h2>

            <div className="gnc-modal-section">
              <div className="gnc-modal-row"><span>Citizen:</span><strong>{modal.citizen_name}</strong></div>
              <div className="gnc-modal-row"><span>NIC (Profile):</span><strong>{modal.nic_number || "—"}</strong></div>
              {modal.submitted_nic && modal.submitted_nic !== modal.nic_number && (
                <div className="gnc-modal-row"><span>NIC (Submitted):</span><strong>{modal.submitted_nic}</strong></div>
              )}
              <div className="gnc-modal-row"><span>Phone:</span><strong>{modal.phone_number || "—"}</strong></div>
              <div className="gnc-modal-row"><span>Certificate Type:</span><strong>{modal.cert_type}</strong></div>
              <div className="gnc-modal-row"><span>Date Requested:</span><strong>{formatDate(modal.created_at)}</strong></div>
            </div>

            {modal.purpose && (
              <div className="gnc-modal-desc">
                <strong>Purpose / Notes from Citizen:</strong>
                <p>{modal.purpose}</p>
              </div>
            )}

            <div className="gnc-modal-form">
              <label className="gnc-modal-label">Update Status</label>
              <select className="gnc-modal-select" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>

              <label className="gnc-modal-label">GN Officer Note (optional)</label>
              <textarea
                className="gnc-modal-textarea"
                rows={3}
                placeholder="Add a note for the citizen (e.g. reason for rejection, instructions to collect)…"
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
              />

              <div className="gnc-modal-btns">
                <button className="gnc-save-btn" onClick={handleSave} disabled={saving}>
                  {saving ? "Saving…" : "Save Changes"}
                </button>
                <button className="gnc-cancel-btn" onClick={closeModal}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
