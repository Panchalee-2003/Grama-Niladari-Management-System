import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/postNotice.css";
import "../styles/householdVerify.css";
import api from "../api/api";

/* ---------- Icons (SVG) ---------- */
function IconDashboard() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 4h7v7H4V4ZM13 4h7v7h-7V4ZM4 13h7v7H4v-7ZM13 13h7v7h-7v-7Z" stroke="#0b0b0b" strokeWidth="2" /></svg>;
}
function IconUsers() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z" stroke="#0b0b0b" strokeWidth="2" /><path d="M4 20a8 8 0 0 1 16 0" stroke="#0b0b0b" strokeWidth="2" strokeLinecap="round" /></svg>;
}
function IconDoc() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M7 3h7l3 3v15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" stroke="#0b0b0b" strokeWidth="2" /><path d="M14 3v4h4" stroke="#0b0b0b" strokeWidth="2" /></svg>;
}
function IconFlag() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 3v18" stroke="#0b0b0b" strokeWidth="2" strokeLinecap="round" /><path d="M6 4h11l-2 4 2 4H6" stroke="#0b0b0b" strokeWidth="2" strokeLinejoin="round" /></svg>;
}
function IconBell() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z" stroke="#0b0b0b" strokeWidth="2" /><path d="M9.5 19a2.5 2.5 0 0 0 5 0" stroke="#0b0b0b" strokeWidth="2" strokeLinecap="round" /></svg>;
}
function IconCoin() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 20c4.418 0 8-1.79 8-4s-3.582-4-8-4-8 1.79-8 4 3.582 4 8 4Z" stroke="#0b0b0b" strokeWidth="2" /><path d="M4 16V8M20 16V8" stroke="#0b0b0b" strokeWidth="2" /><path d="M12 12c4.418 0 8-1.79 8-4s-3.582-4-8-4-8 1.79-8 4 3.582 4 8 4Z" stroke="#0b0b0b" strokeWidth="2" /></svg>;
}
function IconProfile() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="#fff" strokeWidth="2" /><path d="M4 20a8 8 0 0 1 16 0" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>;
}
function IconCalendar() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M7 3v3M17 3v3" stroke="#2f6b45" strokeWidth="2" strokeLinecap="round" /><path d="M4 7h16" stroke="#2f6b45" strokeWidth="2" /><path d="M6 5h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" stroke="#2f6b45" strokeWidth="2" /></svg>;
}
function IconUpload() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 16V4" stroke="#2f6b45" strokeWidth="2" strokeLinecap="round" /><path d="M7 9l5-5 5 5" stroke="#2f6b45" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M4 20h16" stroke="#2f6b45" strokeWidth="2" strokeLinecap="round" /></svg>;
}

const API_BASE = "http://localhost:5000";

function formatDate(ts) {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "2-digit" });
}

export default function PostNotice() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [noticeDate, setNoticeDate] = useState("");
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const [notices, setNotices] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [deleting, setDeleting] = useState(null);

  // Load existing notices
  const loadNotices = async () => {
    setListLoading(true);
    setListError("");
    try {
      const r = await api.get("/api/notice");
      if (r.data.ok) setNotices(r.data.notices);
    } catch {
      setListError("Failed to load notices.");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => { loadNotices(); }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) { setImage(null); return; }
    if (file.size > 5 * 1024 * 1024) {
      setSubmitError("Image must be under 5 MB.");
      e.target.value = "";
      setImage(null);
      return;
    }
    setSubmitError("");
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");
    if (!title.trim()) { setSubmitError("Title is required."); return; }

    const fd = new FormData();
    fd.append("title", title);
    fd.append("description", description);
    fd.append("notice_date", noticeDate);
    if (image) fd.append("image", image);

    setSubmitting(true);
    try {
      await api.post("/api/notice", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setSubmitSuccess("✅ Notice posted successfully!");
      setTitle(""); setDescription(""); setNoticeDate(""); setImage(null);
      const fi = document.getElementById("notice-img-input");
      if (fi) fi.value = "";
      loadNotices();
    } catch (ex) {
      setSubmitError(ex.response?.data?.error || "Failed to post notice.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this notice?")) return;
    setDeleting(id);
    try {
      await api.delete(`/api/notice/${id}`);
      setNotices((prev) => prev.filter((n) => n.notice_id !== id));
    } catch {
      alert("Failed to delete notice.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="pn-wrap">
      {/* SIDEBAR */}
      <aside className="pn-sidebar">
        <div className="pn-brand">
          <div className="pn-brand-title">Maspanna Division</div>
          <div className="pn-brand-sub">Grama Niladhari</div>
        </div>
        <nav className="pn-menu">
          <Link className="pn-item" to="/gn"><span className="pn-ico"><IconDashboard /></span><span>Dashboard</span></Link>
          <Link className="pn-item" to="/gn-households"><span className="pn-ico"><IconUsers /></span><span>Households</span></Link>
          <Link className="pn-item" to="/gn-certificates"><span className="pn-ico"><IconDoc /></span><span>Certificates</span></Link>
          <Link className="pn-item" to="/gn-complaints"><span className="pn-ico"><IconFlag /></span><span>Complaints</span></Link>
          <Link className="pn-item pn-active" to="/gn-notices"><span className="pn-ico"><IconBell /></span><span>Notices</span></Link>
          <Link className="pn-item" to="/gn-allowances"><span className="pn-ico"><IconCoin /></span><span>Allowances &amp; Aids</span></Link>
        </nav>
        <div className="pn-settings"><span className="pn-gear">⚙</span><span>Settings</span></div>
      </aside>

      {/* MAIN */}
      <section className="pn-main">
        {/* TOP BAR — standard GN header */}
        <header className="hv-topbar">
          <div className="hv-top-title">GN Digital System</div>
          <div className="hv-top-search">
            <input className="hv-top-search-input" placeholder="Search…" readOnly />
          </div>
          <div className="hv-top-icons">
            <div className="hv-profile" aria-label="profile"><IconProfile /></div>
          </div>
        </header>

        <div className="pn-content">
          <h1 className="pn-h1">Public Notices</h1>
          <div className="pn-sub">Create and manage public notices for the Maspanna Division</div>

          {/* ── POST FORM ── */}
          <form className="pn-form" onSubmit={handleSubmit}>
            {submitSuccess && <div className="pn-alert pn-alert-ok">{submitSuccess}</div>}
            {submitError && <div className="pn-alert pn-alert-err">{submitError}</div>}

            <div className="pn-field">
              <div className="pn-label">Title <span className="pn-req">*</span></div>
              <input className="pn-input" placeholder="Enter notice title" value={title} onChange={e => setTitle(e.target.value)} maxLength={255} />
            </div>

            <div className="pn-field">
              <div className="pn-label">Description</div>
              <textarea className="pn-textarea" placeholder="Enter notice description…" value={description} onChange={e => setDescription(e.target.value)} rows={4} />
            </div>

            <div className="pn-field pn-date">
              <div className="pn-label">Date</div>
              <div className="pn-date-wrap">
                <input className="pn-input" type="date" value={noticeDate} onChange={e => setNoticeDate(e.target.value)} />
                <span className="pn-cal"><IconCalendar /></span>
              </div>
            </div>

            <div className="pn-field">
              <div className="pn-label">Image Upload (optional)</div>
              <label className="pn-upload">
                <input id="notice-img-input" className="pn-upload-input" type="file" accept="image/*" onChange={handleImageChange} />
                <span className="pn-upload-icon"><IconUpload /></span>
                <span className="pn-upload-text">{image ? image.name : "Choose an image…"}</span>
              </label>
            </div>

            <button className="pn-btn" type="submit" disabled={submitting}>
              {submitting ? "Posting…" : "Post Notice"}
            </button>
          </form>

          {/* ── PREVIOUS NOTICES ── */}
          <h2 className="pn-h2">Previous Notices</h2>
          {listLoading && <div className="pn-state">Loading notices…</div>}
          {listError && <div className="pn-state pn-state-err">{listError}</div>}
          {!listLoading && notices.length === 0 && <div className="pn-state">No notices posted yet.</div>}

          {!listLoading && notices.length > 0 && (
            <div className="pn-table">
              <div className="pn-thead">
                <div>Title</div>
                <div>Description</div>
                <div>Date</div>
                <div>Image</div>
                <div className="pn-actions-col">Actions</div>
              </div>
              {notices.map((n) => (
                <div className="pn-row" key={n.notice_id}>
                  <div className="pn-cell pn-cell-title">{n.title}</div>
                  <div className="pn-cell pn-muted pn-cell-desc">{n.description || "—"}</div>
                  <div className="pn-cell pn-muted">{n.notice_date ? formatDate(n.notice_date) : formatDate(n.created_at)}</div>
                  <div className="pn-cell">
                    {n.image_path
                      ? <img src={`${API_BASE}/uploads/${n.image_path}`} alt="notice" className="pn-thumb" />
                      : <span className="pn-muted">—</span>}
                  </div>
                  <div className="pn-cell pn-actions">
                    <button
                      className="pn-del-btn"
                      onClick={() => handleDelete(n.notice_id)}
                      disabled={deleting === n.notice_id}
                    >
                      {deleting === n.notice_id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
