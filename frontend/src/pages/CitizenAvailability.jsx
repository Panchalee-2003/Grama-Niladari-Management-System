import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import NotificationDropdown from "../components/NotificationDropdown";
import CitizenProfileDropdown from "../components/CitizenProfileDropdown";
import emblem from "../assets/emblem.png";
import "../styles/citizenDashboard.css";
import "../styles/availability.css";

/* Icons */
function IconHome() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5Z" stroke="#1f1f1f" strokeWidth="2"/></svg>; }
function IconUser() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="#1f1f1f" strokeWidth="2"/><path d="M4 20a8 8 0 0 1 16 0" stroke="#1f1f1f" strokeWidth="2" strokeLinecap="round"/></svg>; }
function IconDoc() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M7 3h7l3 3v15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" stroke="#1f1f1f" strokeWidth="2"/><path d="M14 3v4h4" stroke="#1f1f1f" strokeWidth="2"/></svg>; }
function IconComplaint() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M7 3h10a2 2 0 0 1 2 2v16l-4-2-4 2-4-2-4 2V5a2 2 0 0 1 2-2Z" stroke="#1f1f1f" strokeWidth="2"/><path d="M8 7h8M8 11h8M8 15h6" stroke="#1f1f1f" strokeWidth="2" strokeLinecap="round"/></svg>; }
function IconBell() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z" stroke="#1f1f1f" strokeWidth="2"/><path d="M9.5 19a2.5 2.5 0 0 0 5 0" stroke="#1f1f1f" strokeWidth="2" strokeLinecap="round"/></svg>; }

export default function CitizenAvailability() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availabilities, setAvailabilities] = useState([]);
  const [selectedDateDetails, setSelectedDateDetails] = useState(null);

  useEffect(() => {
    fetchAvailabilities();
  }, [currentDate.getFullYear(), currentDate.getMonth()]);

  const fetchAvailabilities = async () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
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

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const handleDateClick = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const record = availabilities.find(a => a.date.split('T')[0] === dateStr);
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
        <Link className="cd-nav-item" to="/availability" style={{borderBottom: "3px solid #0C7A3B"}}><span style={{fontWeight:"bold"}}>GN Schedule</span></Link>
      </nav>

      <div className="cd-main" style={{padding: "20px 40px"}}>
        <h2>Grama Niladhari Schedule</h2>
        <p>Check the GN's availability before visiting the office to avoid inconvenience.</p>
        
        <div style={{display: 'flex', gap: '20px'}}>
          <div style={{flex: 2, background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)'}}>
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

          <div style={{flex: 1}}>
            {selectedDateDetails ? (
              <div style={{background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)'}}>
                <h3 style={{marginTop: 0}}>Date Details: {selectedDateDetails.date}</h3>
                <p><strong>Status:</strong> {selectedDateDetails.status}</p>
                {selectedDateDetails.start && <p><strong>Time:</strong> {selectedDateDetails.start.substring(0,5)} to {selectedDateDetails.end?.substring(0,5)}</p>}
                <p><strong>Notes / Location:</strong><br/>{selectedDateDetails.note}</p>
              </div>
            ) : (
              <div style={{background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', color: '#666'}}>
                Click on any date in the calendar to see detailed schedule information including field visit locations and specific active hours.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
