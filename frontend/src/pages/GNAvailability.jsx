import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import GNProfileDropdown from "../components/GNProfileDropdown";
import "../styles/gnDashboard.css";
import "../styles/availability.css";
import { clearAuth } from "../auth/auth";

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
        {/* Simplified Sidebar for brevity just keeping nav */}
        <div className="gn-brand">
          <div className="gn-brand-title">Maspanna Division</div>
          <div className="gn-brand-sub">Grama Niladhari</div>
        </div>
        <nav className="gn-menu">
           <Link to="/gn" className="gn-item"><span>Dashboard</span></Link>
           <Link to="/gn-availability" className="gn-item gn-item-active"><span>Availability</span></Link>
           {/* Add others but minimal for speed */}
           <Link to="/gn-households" className="gn-item"><span>Households</span></Link>
        </nav>
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
