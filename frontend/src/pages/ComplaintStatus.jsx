import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/complaintStatus.css";
import emblem from "../assets/emblem.png";
import NotificationDropdown from "../components/NotificationDropdown";
import CitizenProfileDropdown from "../components/CitizenProfileDropdown";
import api from "../api/api";

function IconHome() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
      <path d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5Z" stroke="#1f1f1f" strokeWidth="2" />
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
function IconCalendar() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="#1f1f1f" strokeWidth="2" />
      <line x1="16" y1="2" x2="16" y2="6" stroke="#1f1f1f" strokeWidth="2" />
      <line x1="8" y1="2" x2="8" y2="6" stroke="#1f1f1f" strokeWidth="2" />
      <line x1="3" y1="10" x2="21" y2="10" stroke="#1f1f1f" strokeWidth="2" />
    </svg>
  );
}

const STATUS_LABELS = {
  PENDING: { label: "Pending", cls: "cst-pending" },
  PROCESSING: { label: "Processing", cls: "cst-processing" },
  RESOLVED: { label: "Resolved", cls: "cst-completed" },
};

function formatDate(ts) {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "2-digit" });
}

export default function ComplaintStatus() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(null); // complaint_id of open detail
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    api.get("/api/complaint/my")
      .then((r) => { if (r.data.ok) setComplaints(r.data.complaints); })
      .catch(() => setError("Failed to load complaints."))
      .finally(() => setLoading(false));
  }, []);

  const toggleDetail = async (id) => {
    if (expanded === id) { setExpanded(null); setDetail(null); return; }
    setExpanded(id);
    setDetail(null);
    setDetailLoading(true);
    try {
      const r = await api.get(`/api/complaint/${id}`);
      if (r.data.ok) setDetail(r.data);
    } catch { /* ignore */ }
    setDetailLoading(false);
  };

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
        <div className="cd-top-right" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link to="/about" className="cd-about-btn">About Us</Link>
          <NotificationDropdown />
          <CitizenProfileDropdown />
        </div>
      </header>

      {/* NAV */}
      <nav className="cd-nav">
        <Link className="cd-nav-item" to="/citizen"><IconHome /><span>Home</span></Link>
        <Link className="cd-nav-item" to="/household"><IconUser /><span>Household</span></Link>
        <Link className="cd-nav-item" to="/certificates"><IconDoc /><span>Certificates</span></Link>
        <Link className="cd-nav-item cd-active" to="/complaints"><IconComplaint /><span>Complaints</span></Link>
        <Link className="cd-nav-item" to="/notices"><IconBell /><span>Notices</span></Link>
        <Link className="cd-nav-item" to="/availability"><IconCalendar /><span>GN Schedule</span></Link>
      </nav>

      {/* MAIN */}
      <main className="cst-main">
        <div className="cst-header-row">
          <h1 className="cst-title">Your Complaint Status</h1>
          <Link to="/complaints" className="cst-new-btn">+ New Complaint</Link>
        </div>

        {loading && <div className="cst-loading">Loading complaints…</div>}
        {error && <div className="cst-error">{error}</div>}

        {!loading && complaints.length === 0 && (
          <div className="cst-empty">
            <p>You have not submitted any complaints yet.</p>
            <Link to="/complaints" className="cst-new-btn">Submit a Complaint</Link>
          </div>
        )}

        {!loading && complaints.length > 0 && (
          <div className="cst-table">
            <div className="cst-row cst-head">
              <div>Complaint No</div>
              <div>Subject</div>
              <div>Date Filed</div>
              <div>Status</div>
              <div>Responses</div>
              <div></div>
            </div>

            {complaints.map((c) => {
              const s = STATUS_LABELS[c.status] || { label: c.status, cls: "" };
              const isOpen = expanded === c.complaint_id;
              return (
                <div key={c.complaint_id}>
                  <div className="cst-row">
                    <div className="cst-id">#{c.complaint_id}</div>
                    <div>{c.subject}</div>
                    <div>{formatDate(c.created_at)}</div>
                    <div><span className={`cst-status ${s.cls}`}>{s.label}</span></div>
                    <div>{c.response_count > 0 ? `${c.response_count} response${c.response_count > 1 ? "s" : ""}` : "—"}</div>
                    <div>
                      <button className="cst-toggle-btn" onClick={() => toggleDetail(c.complaint_id)}>
                        {isOpen ? "▲ Hide" : "▼ View"}
                      </button>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="cst-detail-panel">
                      {detailLoading && <div className="cst-loading">Loading details…</div>}
                      {detail && (
                        <>
                          {detail.complaint.description && (
                            <div className="cst-detail-desc">
                              <strong>Description:</strong>
                              <p>{detail.complaint.description}</p>
                            </div>
                          )}

                          <div className="cst-responses">
                            <strong>GN Officer Responses{detail.responses.length === 0 ? " (none yet)" : ""}:</strong>
                            {detail.responses.map((r) => (
                              <div key={r.response_id} className="cst-response-bubble">
                                <div className="cst-response-meta">
                                  <span className="cst-response-author">{r.gn_name || "GN Officer"}</span>
                                  <span className="cst-response-date">{formatDate(r.created_at)}</span>
                                </div>
                                <p className="cst-response-msg">{r.message}</p>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
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
