import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "../styles/complaintManagement.css";
import api from "../api/api";

// --- Icons ---
function IconDash() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 13h7V4H4v9ZM13 20h7v-7h-7v7ZM13 11h7V4h-7v7ZM4 20h7v-5H4v5Z" fill="#0B1B12" /></svg>;
}
function IconUsers() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3ZM8 11c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3ZM8 13c-2.67 0-8 1.34-8 4v2h12v-2c0-2.66-5.33-4-4-4Zm8 0c-.34 0-.7.02-1.07.05 1.16.84 2.07 1.97 2.07 3.45v2h7v-2c0-2.66-5.33-4-8-4Z" fill="#0B1B12" /></svg>;
}
function IconDoc() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M7 3h7l3 3v15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" stroke="#0B1B12" strokeWidth="2" /><path d="M14 3v4h4" stroke="#0B1B12" strokeWidth="2" /></svg>;
}
function IconFlag() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 21V4" stroke="#0B1B12" strokeWidth="2" strokeLinecap="round" /><path d="M4 5h13l-2 4 2 4H4" stroke="#0B1B12" strokeWidth="2" strokeLinejoin="round" /></svg>;
}
function IconBell() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z" stroke="#0B1B12" strokeWidth="2" /><path d="M9.5 19a2.5 2.5 0 0 0 5 0" stroke="#0B1B12" strokeWidth="2" strokeLinecap="round" /></svg>;
}
function IconHand() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M7 22h10c2 0 3-1 3-3v-7c0-1.1-.9-2-2-2h-1V6a2 2 0 1 0-4 0v3H11V5a2 2 0 1 0-4 0v9H6c-1.1 0-2 .9-2 2v1c0 3 2 5 3 5Z" fill="#0B1B12" opacity="0.9" /></svg>;
}
function IconProfile() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="#fff" strokeWidth="2" /><path d="M4 20a8 8 0 0 1 16 0" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>;
}

const TABS = ["ALL", "PENDING", "PROCESSING", "RESOLVED"];

const STATUS_META = {
  PENDING: { label: "Pending", cls: "cmp-pill-pending" },
  PROCESSING: { label: "Processing", cls: "cmp-pill-processing" },
  RESOLVED: { label: "Resolved", cls: "cmp-pill-resolved" },
};

function formatDate(ts) {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "2-digit" });
}

export default function ComplaintManagement() {
  const [tab, setTab] = useState("ALL");
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal state
  const [modal, setModal] = useState(null);          // complaint object
  const [modalDetail, setModalDetail] = useState(null); // { complaint, responses }
  const [modalLoading, setModalLoading] = useState(false);

  // Response form
  const [responseMsg, setResponseMsg] = useState("");
  const [responseSubmitting, setResponseSubmitting] = useState(false);
  const [responseError, setResponseError] = useState("");

  // Status update
  const [statusUpdating, setStatusUpdating] = useState(false);

  const fetchComplaints = useCallback(async (filterTab) => {
    setLoading(true);
    setError("");
    try {
      const params = filterTab && filterTab !== "ALL" ? `?status=${filterTab}` : "";
      const r = await api.get(`/api/complaint/all/list${params}`);
      if (r.data.ok) setComplaints(r.data.complaints);
    } catch {
      setError("Failed to load complaints.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchComplaints(tab); }, [tab, fetchComplaints]);

  const openModal = async (c) => {
    setModal(c);
    setModalDetail(null);
    setResponseMsg("");
    setResponseError("");
    setModalLoading(true);
    try {
      const r = await api.get(`/api/complaint/${c.complaint_id}`);
      if (r.data.ok) setModalDetail(r.data);
    } catch { /* ignore */ }
    setModalLoading(false);
  };

  const closeModal = () => { setModal(null); setModalDetail(null); };

  const handleStatusChange = async (newStatus) => {
    if (!modalDetail) return;
    setStatusUpdating(true);
    try {
      const r = await api.patch(`/api/complaint/${modalDetail.complaint.complaint_id}/status`, { status: newStatus });
      if (r.data.ok) {
        setModalDetail((prev) => ({ ...prev, complaint: { ...prev.complaint, status: newStatus } }));
        setComplaints((prev) =>
          prev.map((c) => c.complaint_id === modalDetail.complaint.complaint_id ? { ...c, status: newStatus } : c)
        );
      }
    } catch { /* ignore */ }
    setStatusUpdating(false);
  };

  const handleAddResponse = async (e) => {
    e.preventDefault();
    setResponseError("");
    if (!responseMsg.trim()) { setResponseError("Response message cannot be empty."); return; }
    setResponseSubmitting(true);
    try {
      const r = await api.post(`/api/complaint/${modalDetail.complaint.complaint_id}/response`, { message: responseMsg });
      if (r.data.ok) {
        setModalDetail((prev) => ({ ...prev, responses: [...prev.responses, r.data.response] }));
        // If status was PENDING, backend auto-advances to PROCESSING
        setModalDetail((prev) => ({
          ...prev,
          complaint: { ...prev.complaint, status: prev.complaint.status === "PENDING" ? "PROCESSING" : prev.complaint.status }
        }));
        setComplaints((prev) =>
          prev.map((c) => c.complaint_id === modalDetail.complaint.complaint_id
            ? { ...c, response_count: c.response_count + 1, status: c.status === "PENDING" ? "PROCESSING" : c.status }
            : c)
        );
        setResponseMsg("");
      }
    } catch (ex) {
      setResponseError(ex.response?.data?.error || "Failed to send response.");
    } finally {
      setResponseSubmitting(false);
    }
  };

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
          <Link className="cmp-item cmp-active" to="/gn-complaints"><span className="cmp-i"><IconFlag /></span>Complaints</Link>
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
          <div className="cmp-top-right">
            <div className="cmp-profile" aria-label="profile"><IconProfile /></div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="cmp-content">
          <div className="cmp-title">Complaints Management</div>

          {/* TABS */}
          <div className="cmp-tabs">
            {TABS.map((t) => (
              <div key={t} className={`cmp-tab ${tab === t ? "cmp-tab-active" : ""}`} onClick={() => setTab(t)}>
                {t.charAt(0) + t.slice(1).toLowerCase()}
              </div>
            ))}
          </div>
          <div className="cmp-tabs-line" />

          {/* TABLE */}
          <div className="cmp-card">
            {error && <div className="cmp-error">{error}</div>}
            {loading ? (
              <div className="cmp-loading">Loading complaints…</div>
            ) : complaints.length === 0 ? (
              <div className="cmp-empty">No complaints found{tab !== "ALL" ? ` with status "${tab}"` : ""}.</div>
            ) : (
              <div className="cmp-table">
                <div className="cmp-row cmp-head">
                  <div>ID</div>
                  <div>Subject</div>
                  <div>Date Filed</div>
                  <div>Status</div>
                  <div>Citizen</div>
                  <div>Resp.</div>
                  <div className="cmp-muted">Actions</div>
                </div>
                {complaints.map((c) => {
                  const s = STATUS_META[c.status] || { label: c.status, cls: "" };
                  return (
                    <div className="cmp-row" key={c.complaint_id}>
                      <div className="cmp-muted">#{c.complaint_id}</div>
                      <div className="cmp-subject">{c.subject}</div>
                      <div className="cmp-muted">{formatDate(c.created_at)}</div>
                      <div><span className={`cmp-pill ${s.cls}`}>{s.label}</span></div>
                      <div className="cmp-muted">{c.citizen_name}</div>
                      <div className="cmp-muted">{c.response_count}</div>
                      <div className="cmp-actions">
                        <button className="cmp-link-btn" onClick={() => openModal(c)}>View / Respond</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* DETAIL MODAL */}
      {modal && (
        <div className="cmp-modal-overlay" onClick={closeModal}>
          <div className="cmp-modal" onClick={(e) => e.stopPropagation()}>
            <button className="cmp-modal-close" onClick={closeModal}>✕</button>

            {modalLoading && <div className="cmp-loading">Loading…</div>}

            {modalDetail && (
              <>
                {/* Header */}
                <div className="cmp-modal-header">
                  <div>
                    <h2 className="cmp-modal-title">{modalDetail.complaint.subject}</h2>
                    <div className="cmp-modal-meta">
                      <span>#{modalDetail.complaint.complaint_id}</span>
                      <span>•</span>
                      <span>{modalDetail.complaint.citizen_name}</span>
                      <span>•</span>
                      <span>{formatDate(modalDetail.complaint.created_at)}</span>
                    </div>
                  </div>

                  {/* Status dropdown */}
                  <div className="cmp-status-update">
                    <label className="cmp-status-label">Status:</label>
                    <select
                      className="cmp-status-select"
                      value={modalDetail.complaint.status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      disabled={statusUpdating}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="RESOLVED">Resolved</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                {modalDetail.complaint.description && (
                  <div className="cmp-modal-desc">
                    <strong>Description:</strong>
                    <p>{modalDetail.complaint.description}</p>
                  </div>
                )}

                {/* Responses */}
                <div className="cmp-modal-responses">
                  <strong>Responses ({modalDetail.responses.length})</strong>
                  {modalDetail.responses.length === 0 && (
                    <p className="cmp-no-responses">No responses yet. Add the first response below.</p>
                  )}
                  {modalDetail.responses.map((r) => (
                    <div key={r.response_id} className="cmp-response-bubble">
                      <div className="cmp-response-meta">
                        <span className="cmp-response-author">{r.gn_name || "GN Officer"}</span>
                        <span className="cmp-response-date">{formatDate(r.created_at)}</span>
                      </div>
                      <p className="cmp-response-msg">{r.message}</p>
                    </div>
                  ))}
                </div>

                {/* Add Response Form */}
                <form className="cmp-response-form" onSubmit={handleAddResponse}>
                  <label className="cmp-response-form-label">Add Response:</label>
                  {responseError && <div className="cmp-error" style={{ marginBottom: "0.5rem" }}>{responseError}</div>}
                  <textarea
                    className="cmp-response-input"
                    rows={3}
                    placeholder="Type your response to the citizen…"
                    value={responseMsg}
                    onChange={(e) => setResponseMsg(e.target.value)}
                  />
                  <button className="cmp-response-submit" type="submit" disabled={responseSubmitting}>
                    {responseSubmitting ? "Sending…" : "Send Response"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
