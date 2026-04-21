import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import GNProfileDropdown from "../components/GNProfileDropdown";
import "../styles/gnDashboard.css";
import "../styles/availability.css";
import { clearAuth } from "../auth/auth";
import { IconHome, IconPeople, IconDoc, IconFlag, IconBell, IconCoin, IconSettings, IconLogout } from "../components/icons";

export default function GNAvailability() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availabilities, setAvailabilities] = useState([]);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState({
    status: "AVAILABLE",
    start_time: "",
    end_time: "",
    note: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAvailabilities();
  }, [currentDate.getFullYear(), currentDate.getMonth()]);

  /**
   * Converts a given Date object to a local YYYY-MM-DD string format.
   * This ensures the frontend date strings perfectly match the backend DB format,
   * avoiding timezone shift bugs which previously caused offsets.
   *
   * @param {Date} d - The javascript Date object
   * @returns {string} The localized date string (e.g. "2024-04-21")
   */
  const toLocalDateStr = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  /**
   * Fetches availability data for the Grama Niladhari for the currently selected month.
   * Calculates the exact start and end dates of the current month and requests records from the API.
   */
  const fetchAvailabilities = async () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const startStr = toLocalDateStr(new Date(year, month, 1));
    const endStr = toLocalDateStr(new Date(year, month + 1, 0));

    try {
      const res = await api.get(
        `/api/availability?start_date=${startStr}&end_date=${endStr}`,
      );
      if (res.data.ok) {
        setAvailabilities(res.data.availabilities);
      }
    } catch (err) {
      console.error("Failed to fetch availability", err);
    }
  };

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  /**
   * Handles user interaction when clicking on a calendar day.
   * Determines if the clicked date has an existing availability record.
   * If so, pre-fills the modal data with the existing shift. If not, initializes a new form entry.
   *
   * @param {number} day - The day of the month clicked (1-31)
   */
  const handleDateClick = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDate(dateStr);

    // DB returns DATE as 'YYYY-MM-DD'
    const existing = availabilities.find((a) => {
      const d =
        typeof a.date === "string"
          ? a.date.substring(0, 10)
          : toLocalDateStr(new Date(a.date));
      return d === dateStr;
    });
    if (existing) {
      setFormData({
        status: existing.status,
        start_time: existing.start_time
          ? existing.start_time.substring(0, 5)
          : "",
        end_time: existing.end_time ? existing.end_time.substring(0, 5) : "",
        note: existing.note || "",
      });
    } else {
      setFormData({
        status: "AVAILABLE",
        start_time: "",
        end_time: "",
        note: "",
      });
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

  const handleClear = async () => {
    if (!window.confirm(`Remove availability entry for ${selectedDate}?`))
      return;
    setLoading(true);
    try {
      await api.delete(`/api/availability/${selectedDate}`);
      await fetchAvailabilities();
      setModalOpen(false);
    } catch (err) {
      alert(`Failed to clear: ${err.response?.data?.error || err.message}`);
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
    const todayStr = toLocalDateStr(new Date());

    const blanks = Array.from({
      length: firstDay === 0 ? 6 : firstDay - 1,
    }).map((_, i) => (
      <div key={`blank-${i}`} className="cal-day cal-blank"></div>
    ));
    const days = Array.from({ length: numDays }).map((_, i) => {
      const day = i + 1;
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const record = availabilities.find((a) => {
        const d =
          typeof a.date === "string"
            ? a.date.substring(0, 10)
            : toLocalDateStr(new Date(a.date));
        return d === dateStr;
      });
      let statusClass = "";
      if (record) {
        if (record.status === "AVAILABLE") statusClass = "cal-avail";
        else if (record.status === "FIELD_VISIT") statusClass = "cal-field";
        else if (record.status === "UNAVAILABLE") statusClass = "cal-unavail";
      }
      const isToday = dateStr === todayStr;

      return (
        <div
          key={`day-${day}`}
          className={`cal-day ${statusClass}${isToday ? " cal-today" : ""}`}
          onClick={() => handleDateClick(day)}
        >
          <span className="cal-day-num">{day}</span>
          {record && (
            <span className="cal-day-label">
              {record.status.replace("_", " ")}
            </span>
          )}
          {record && record.start_time && (
            <span className="cal-day-time">
              {record.start_time.substring(0, 5)} -{" "}
              {record.end_time?.substring(0, 5)}
            </span>
          )}
        </div>
      );
    });

    return [...blanks, ...days];
  };

  const prevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  const nextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );

  return (
    <div className="gn-wrap">
      <aside className="gn-sidebar">
        <div className="gn-brand">
          <div className="gn-brand-title">Maspanna Division</div>
          <div className="gn-brand-sub">Grama Niladhari</div>
        </div>
        <nav className="gn-menu">
          <Link to="/gn" className="gn-item">
            <span className="gn-ico">
              <IconHome />
            </span>
            <span>Dashboard</span>
          </Link>
          <Link to="/gn-availability" className="gn-item gn-item-active">
            <span className="gn-ico">
              <IconBell />
            </span>
            <span>Availability</span>
          </Link>
          <Link to="/gn-households" className="gn-item">
            <span className="gn-ico">
              <IconPeople />
            </span>
            <span>Households</span>
          </Link>
          <Link to="/gn-certificates" className="gn-item">
            <span className="gn-ico">
              <IconDoc />
            </span>
            <span>Certificates</span>
          </Link>
          <Link to="/gn-complaints" className="gn-item">
            <span className="gn-ico">
              <IconFlag />
            </span>
            <span>Complaints</span>
          </Link>
          <Link to="/gn-notices" className="gn-item">
            <span className="gn-ico">
              <IconBell />
            </span>
            <span>Notices</span>
          </Link>
          <Link to="/gn-allowances" className="gn-item">
            <span className="gn-ico">
              <IconCoin />
            </span>
            <span>Allowances &amp; Aids</span>
          </Link>
        </nav>

        <div className="gn-settings">
          <Link to="/gn/settings" className="gn-item gn-item-settings">
            <span className="gn-ico">
              <IconSettings />
            </span>
            <span>Settings</span>
          </Link>
          <button
            onClick={handleLogout}
            className="gn-item gn-item-settings"
            style={{
              width: "100%",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <span className="gn-ico">
              <IconLogout />
            </span>
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
            <button className="cal-btn" onClick={prevMonth}>
              &lt; Prev
            </button>
            <h2 className="cal-title">
              {currentDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <button className="cal-btn" onClick={nextMonth}>
              Next &gt;
            </button>
          </div>

          <div className="cal-legend">
            <span className="cal-legend-item">
              <span className="cal-dot dot-avail"></span> Available
            </span>
            <span className="cal-legend-item">
              <span className="cal-dot dot-field"></span> Field Visit
            </span>
            <span className="cal-legend-item">
              <span className="cal-dot dot-unavail"></span> Unavailable
            </span>
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
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="FIELD_VISIT">Field Visit</option>
                  <option value="UNAVAILABLE">Unavailable</option>
                </select>
              </div>
              <div className="cal-form-group">
                <label>Start Time</label>
                <input
                  type="time"
                  value={formData.start_time}
                  onChange={(e) =>
                    setFormData({ ...formData, start_time: e.target.value })
                  }
                />
              </div>
              <div className="cal-form-group">
                <label>End Time</label>
                <input
                  type="time"
                  value={formData.end_time}
                  onChange={(e) =>
                    setFormData({ ...formData, end_time: e.target.value })
                  }
                />
              </div>
              <div className="cal-form-group">
                <label>Note / Location</label>
                <textarea
                  value={formData.note}
                  onChange={(e) =>
                    setFormData({ ...formData, note: e.target.value })
                  }
                  rows={3}
                  placeholder="E.g., Visiting North division, returning at 2 PM"
                ></textarea>
              </div>
              <div className="cal-form-actions">
                <button
                  type="button"
                  className="cal-btn-cancel"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                {availabilities.find(
                  (a) =>
                    (typeof a.date === "string"
                      ? a.date.substring(0, 10)
                      : toLocalDateStr(new Date(a.date))) === selectedDate,
                ) && (
                  <button
                    type="button"
                    className="cal-btn-cancel"
                    style={{ color: "#e74c3c", borderColor: "#e74c3c" }}
                    onClick={handleClear}
                    disabled={loading}
                  >
                    Clear
                  </button>
                )}
                <button
                  type="submit"
                  className="cal-btn-save"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
