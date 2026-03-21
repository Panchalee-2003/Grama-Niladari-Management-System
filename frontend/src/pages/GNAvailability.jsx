import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import GNProfileDropdown from "../components/GNProfileDropdown";
import "../styles/gnDashboard.css";
import "../styles/availability.css";
import { clearAuth } from "../auth/auth";

/* --- Icons (inline SVG) --- */
function IconHome() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5Z" stroke="currentColor" strokeWidth="2" />
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
      <path d="M7 3h7l3 3v15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="2" />
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
function IconSettings() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" stroke="currentColor" strokeWidth="2" />
      <path d="M19.4 15a7.7 7.7 0 0 0 .1-1l2-1.2-2-3.4-2.3.6a7.4 7.4 0 0 0-1.7-1L15 6h-6l-.5 2.4a7.4 7.4 0 0 0-1.7 1l-2.3-.6-2 3.4 2 1.2a7.7 7.7 0 0 0 0 2l-2 1.2 2 3.4 2.3-.6a7.4 7.4 0 0 0 1.7 1L9 22h6l.5-2.4a7.4 7.4 0 0 0 1.7-1l2.3.6 2-3.4-2-1.2a7.7 7.7 0 0 0-.1-1Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
function IconLogout() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 17l5-5-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function GNAvailability() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availabilities, setAvailabilities] = useState([]);
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState({ status: "AVAILABLE", start_time: "", end_time: "", note: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAvailabilities();
  }, [currentDate.getFullYear(), currentDate.getMonth()]);

  const fetchAvailabilities = async () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Format YYYY-MM-DD
    const startStr = firstDay.toISOString().split('T')[0];
    const endStr = lastDay.toISOString().split('T')[0];
    
    try {
      const res = await api.get(`/api/availability?start_date=${startStr}&end_date=${endStr}`);
      if (res.data.ok) {
        setAvailabilities(res.data.availabilities);
      }
    } catch (err) {
      console.error("Failed to fetch availability", err);
    }
  };

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handleDateClick = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    
    // Check if exists
    const existing = availabilities.find(a => a.date.split('T')[0] === dateStr);
    if (existing) {
      setFormData({
        status: existing.status,
        start_time: existing.start_time ? existing.start_time.substring(0, 5) : "",
        end_time: existing.end_time ? existing.end_time.substring(0, 5) : "",
        note: existing.note || ""
      });
    } else {
      setFormData({ status: "AVAILABLE", start_time: "", end_time: "", note: "" });
    }
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/availability", { ...formData, date: selectedDate });
      await fetchAvailabilities();
      setModalOpen(false);
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message;
      alert(`Failed to save availability: ${errMsg}`);
      console.error("Save error details:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const numDays = daysInMonth(year, month);
    const firstDay = firstDayOfMonth(year, month);
    
    const blanks = Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }).map((_, i) => <div key={`blank-${i}`} className="cal-day cal-blank"></div>);
    const days = Array.from({ length: numDays }).map((_, i) => {
      const day = i + 1;
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const record = availabilities.find(a => a.date.split('T')[0] === dateStr);
      let statusClass = "";
      if (record) {
        if (record.status === 'AVAILABLE') statusClass = 'cal-avail';
        else if (record.status === 'FIELD_VISIT') statusClass = 'cal-field';
        else if (record.status === 'UNAVAILABLE') statusClass = 'cal-unavail';
      }

      return (
        <div key={`day-${day}`} className={`cal-day ${statusClass}`} onClick={() => handleDateClick(day)}>
          <span className="cal-day-num">{day}</span>
          {record && <span className="cal-day-label">{record.status.replace('_', ' ')}</span>}
          {record && record.start_time && <span className="cal-day-time">{record.start_time.substring(0,5)} - {record.end_time?.substring(0,5)}</span>}
        </div>
      );
    });

    return [...blanks, ...days];
  };

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  return (
    <div className="gn-wrap">
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
           <Link to="/gn-availability" className="gn-item gn-item-active">
             <span className="gn-ico"><IconBell /></span>
             <span>Availability</span>
           </Link>
           <Link to="/gn-households" className="gn-item">
             <span className="gn-ico"><IconPeople /></span>
             <span>Households</span>
           </Link>
           <Link to="/gn-certificates" className="gn-item">
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
          <button
            onClick={handleLogout}
            className="gn-item gn-item-settings"
            style={{ width: "100%", border: "none", background: "transparent", cursor: "pointer", textAlign: "left" }}
          >
            <span className="gn-ico"><IconLogout /></span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="gn-main">
        <div className="gn-topbar">
          <div className="gn-top-left">Manage Availability</div>
          <div className="gn-top-right">
            <GNProfileDropdown />
          </div>
        </div>
        
        <div className="gn-content">
          <div className="cal-header">
            <button className="cal-btn" onClick={prevMonth}>&lt; Prev</button>
            <h2 className="cal-title">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
            <button className="cal-btn" onClick={nextMonth}>Next &gt;</button>
          </div>

          <div className="cal-legend">
            <span className="cal-legend-item"><span className="cal-dot dot-avail"></span> Available</span>
            <span className="cal-legend-item"><span className="cal-dot dot-field"></span> Field Visit</span>
            <span className="cal-legend-item"><span className="cal-dot dot-unavail"></span> Unavailable</span>
          </div>

          <div className="cal-grid">
            <div className="cal-day-name">Mon</div>
            <div className="cal-day-name">Tue</div>
            <div className="cal-day-name">Wed</div>
            <div className="cal-day-name">Thu</div>
            <div className="cal-day-name">Fri</div>
            <div className="cal-day-name">Sat</div>
            <div className="cal-day-name">Sun</div>
            {renderCalendar()}
          </div>
        </div>
      </main>

      {modalOpen && (
        <div className="cal-modal-overlay">
          <div className="cal-modal">
            <h3>Set Availability for {selectedDate}</h3>
            <form onSubmit={handleSave}>
              <div className="cal-form-group">
                <label>Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                  <option value="AVAILABLE">Available</option>
                  <option value="FIELD_VISIT">Field Visit</option>
                  <option value="UNAVAILABLE">Unavailable</option>
                </select>
              </div>
              <div className="cal-form-group">
                <label>Start Time</label>
                <input type="time" value={formData.start_time} onChange={e => setFormData({...formData, start_time: e.target.value})} />
              </div>
              <div className="cal-form-group">
                <label>End Time</label>
                <input type="time" value={formData.end_time} onChange={e => setFormData({...formData, end_time: e.target.value})} />
              </div>
              <div className="cal-form-group">
                <label>Note / Location</label>
                <textarea value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} rows={3} placeholder="E.g., Visiting North division, returning at 2 PM"></textarea>
              </div>
              <div className="cal-form-actions">
                <button type="button" className="cal-btn-cancel" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="cal-btn-save" disabled={loading}>{loading ? "Saving..." : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
