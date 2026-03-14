import { useState, useEffect, useRef } from "react";
import api from "../api/api";
import "../styles/NotificationDropdown.css";

function IconBell() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9.5 19a2.5 2.5 0 0 0 5 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Fetch notifications initially
    loadNotifications();

    // Handle clicks outside to close dropdown
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await api.get("/api/citizen/me/notifications");
      if (res.data.ok) {
        setNotifications(res.data.notifications);
        // By default, let's just make all fetched notifications unread until the dropdown is opened
        // Or for simplicity, unread count could be length of notifications
        const unreadIds = JSON.parse(localStorage.getItem('readList') || '[]');
        const count = res.data.notifications.filter(n => !unreadIds.includes(n.id)).length;
        setUnreadCount(count);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  const toggleDropdown = () => {
    if (!isOpen) {
      // mark all as read when opened
      const ids = notifications.map(n => n.id);
      localStorage.setItem('readList', JSON.stringify(ids));
      setUnreadCount(0);
    }
    setIsOpen(!isOpen);
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric", hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="notif-wrapper" ref={dropdownRef}>
      <button className="notif-bell-btn" onClick={toggleDropdown} aria-label="Notifications">
        <IconBell />
        {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notif-dropdown">
          <div className="notif-header">
            <h3>Notifications</h3>
          </div>
          <div className="notif-body">
            {notifications.length === 0 ? (
              <div className="notif-empty">No new notifications.</div>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className="notif-item">
                  <div className="notif-icon" style={{ background: n.isSuccess ? '#E9FBF0' : '#FFF1F1', color: n.isSuccess ? '#15803D' : '#DC2626' }}>
                     {n.isSuccess ? '✅' : '❌'}
                  </div>
                  <div className="notif-content">
                    <p className="notif-title">{n.title}</p>
                    <p className="notif-desc">{n.message}</p>
                    <span className="notif-date">{formatDate(n.date)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
