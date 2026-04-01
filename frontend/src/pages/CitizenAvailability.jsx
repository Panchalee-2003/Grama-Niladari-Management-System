import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import NotificationDropdown from "../components/NotificationDropdown";
import CitizenProfileDropdown from "../components/CitizenProfileDropdown";
import emblem from "../assets/emblem.png";
import Footer from "../components/Footer";
import "../styles/citizenDashboard.css";
import "../styles/availability.css";

/* Icons */
function IconHome() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5Z" stroke="#1f1f1f" strokeWidth="2"/></svg>; }
function IconUser() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="#1f1f1f" strokeWidth="2"/><path d="M4 20a8 8 0 0 1 16 0" stroke="#1f1f1f" strokeWidth="2" strokeLinecap="round"/></svg>; }
function IconDoc() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M7 3h7l3 3v15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" stroke="#1f1f1f" strokeWidth="2"/><path d="M14 3v4h4" stroke="#1f1f1f" strokeWidth="2"/></svg>; }
function IconComplaint() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M7 3h10a2 2 0 0 1 2 2v16l-4-2-4 2-4-2-4 2V5a2 2 0 0 1 2-2Z" stroke="#1f1f1f" strokeWidth="2"/><path d="M8 7h8M8 11h8M8 15h6" stroke="#1f1f1f" strokeWidth="2" strokeLinecap="round"/></svg>; }
function IconBell() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z" stroke="#1f1f1f" strokeWidth="2"/><path d="M9.5 19a2.5 2.5 0 0 0 5 0" stroke="#1f1f1f" strokeWidth="2" strokeLinecap="round"/></svg>; }
function IconCalendar() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="#000000" strokeWidth="2" />
      <line x1="16" y1="2" x2="16" y2="6" stroke="#000000" strokeWidth="2" />
      <line x1="8" y1="2" x2="8" y2="6" stroke="#000000" strokeWidth="2" />
      <line x1="3" y1="10" x2="21" y2="10" stroke="#000000" strokeWidth="2" />
    </svg>
  );
}

export default function CitizenAvailability() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availabilities, setAvailabilities] = useState([]);
  const [selectedDateDetails, setSelectedDateDetails] = useState(null);

  useEffect(() => {
    fetchAvailabilities();
  }, [currentDate.getFullYear(), currentDate.getMonth()]);

  const toLocalDateStr = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const fetchAvailabilities = async () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const startStr = toLocalDateStr(new Date(year, month, 1));
    const endStr = toLocalDateStr(new Date(year, month + 1, 0));

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

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const handleDateClick = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const record = availabilities.find(a => {
      const d = typeof a.date === 'string' ? a.date.substring(0, 10) : toLocalDateStr(new Date(a.date));
      return d === dateStr;
    });
    if (record) {
      setSelectedDateDetails({
        date: dateStr,
        status: record.status.replace('_', ' '),
        start: record.start_time,
        end: record.end_time,
        note: record.note
      });
    } else {
      setSelectedDateDetails({
        date: dateStr,
        status: "NOT DEFINED",
        note: "The Grama Niladhari has not scheduled availability for this date."
      });
    }
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const numDays = daysInMonth(year, month);
    const firstDay = firstDayOfMonth(year, month);
    const todayStr = toLocalDateStr(new Date());

    const blanks = Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }).map((_, i) => <div key={`blank-${i}`} className="cal-day cal-blank"></div>);
    const days = Array.from({ length: numDays }).map((_, i) => {
      const day = i + 1;
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const record = availabilities.find(a => {
        const d = typeof a.date === 'string' ? a.date.substring(0, 10) : toLocalDateStr(new Date(a.date));
        return d === dateStr;
      });
      let statusClass = "";
      if (record) {
        if (record.status === 'AVAILABLE') statusClass = 'cal-avail';
        else if (record.status === 'FIELD_VISIT') statusClass = 'cal-field';
        else if (record.status === 'UNAVAILABLE') statusClass = 'cal-unavail';
      }
      const isToday = dateStr === todayStr;

      return (
        <div key={`day-${day}`} className={`cal-day ${statusClass}${isToday ? ' cal-today' : ''}`} onClick={() => handleDateClick(day)}>
          <span className="cal-day-num">{day}</span>
          {record && <span className="cal-day-label">{record.status.replace('_', ' ')}</span>}
          {record && record.start_time && <span className="cal-day-time">{record.start_time.substring(0,5)} - {record.end_time?.substring(0,5)}</span>}
        </div>
      );
    });

    return [...blanks, ...days];
  };

  return (
    <div className="cd-page">
      <header className="cd-top">
        <div className="cd-brand">
          <img className="cd-emblem" src={emblem} alt="Sri Lanka Emblem" />
          <div className="cd-brand-text">
            <div className="cd-title">Grama Niladhari Division - Maspanna</div>
            <div className="cd-subtitle">Ministry of Home Affairs</div>
          </div>
        </div>
        <div className="cd-top-actions">
          <Link to="/about" className="cd-about">About Us</Link>
          <NotificationDropdown />
          <CitizenProfileDropdown />
        </div>
      </header>

      <nav className="cd-nav">
        <Link className="cd-nav-item" to="/citizen"><IconHome /><span>Home</span></Link>
        <Link className="cd-nav-item" to="/household"><IconUser /><span>Household</span></Link>
        <Link className="cd-nav-item" to="/certificates"><IconDoc /><span>Certificates</span></Link>
        <Link className="cd-nav-item" to="/complaints"><IconComplaint /><span>Complaints</span></Link>
        <Link className="cd-nav-item" to="/notices"><IconBell /><span>Notices</span></Link>
        <Link className="cd-nav-item" to="/availability" style={{borderBottom: "3px solid #0C7A3B"}}>
          <IconCalendar />
          <span style={{fontWeight:"bold"}}>GN Schedule</span>
        </Link>
      </nav>

      <div className="cd-main" style={{padding: "20px 40px", color: "#1f1f1f"}}>
        <h2 style={{color: "#1f1f1f", marginBottom: "15px"}}>Grama Niladhari Schedule</h2>
        <p style={{color: "#333", marginBottom: "30px"}}>Check the GN's availability before visiting the office to avoid inconvenience.</p>
        
        <div style={{display: 'flex', gap: '20px', alignItems: 'flex-start'}}>
          <div className="cal-small" style={{flex: 1.4, background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)'}}>
            <div className="cal-header">
              <button className="cal-btn" onClick={prevMonth}>&lt;</button>
              <h2 className="cal-title">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
              <button className="cal-btn" onClick={nextMonth}>&gt;</button>
            </div>

            <div className="cal-legend">
              <span className="cal-legend-item"><span className="cal-dot dot-avail"></span> Available</span>
              <span className="cal-legend-item"><span className="cal-dot dot-field"></span> Field</span>
              <span className="cal-legend-item"><span className="cal-dot dot-unavail"></span> Off</span>
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

          <div style={{flex: 1, position: 'sticky', top: '20px'}}>
            {selectedDateDetails ? (
              <div style={{background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', borderTop: '4px solid #0C7A3B'}}>
                <h3 style={{marginTop: 0, marginBottom: '20px', color: '#111', borderBottom: '1px solid #eee', paddingBottom: '10px'}}>Date Details: {selectedDateDetails.date}</h3>
                <div style={{marginBottom: '15px'}}>
                   <label style={{fontSize: '0.75rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', display: 'block', marginBottom: '4px'}}>Status</label>
                   <span style={{fontSize: '1.1rem', fontWeight: 600, color: '#0C7A3B'}}>{selectedDateDetails.status}</span>
                </div>
                {selectedDateDetails.start && (
                  <div style={{marginBottom: '15px'}}>
                    <label style={{fontSize: '0.75rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', display: 'block', marginBottom: '4px'}}>Hours</label>
                    <span style={{fontSize: '1rem', color: '#444'}}>{selectedDateDetails.start.substring(0,5)} to {selectedDateDetails.end?.substring(0,5)}</span>
                  </div>
                )}
                <div>
                  <label style={{fontSize: '0.75rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', display: 'block', marginBottom: '4px'}}>Notes / Location</label>
                  <p style={{fontSize: '0.95rem', color: '#555', lineHeight: 1.5, margin: 0}}>{selectedDateDetails.note || "No additional details provided."}</p>
                </div>
              </div>
            ) : (
              <div style={{background: 'rgba(255,255,255,0.7)', padding: '30px', borderRadius: '12px', border: '2px dashed #ccc', textAlign: 'center', color: '#777'}}>
                <div style={{fontSize: '2rem', marginBottom: '10px'}}>📆</div>
                <p>Click on any date in the calendar to see the Grama Niladhari's full schedule for that day.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
