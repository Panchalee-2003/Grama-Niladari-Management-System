import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import "../styles/NotificationDropdown.css";

function IconBell() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 19a2.5 2.5 0 0 0 5 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* Returns icon emoji + colours based on notification type */
function notifMeta(n) {
  if (n.type === "notice") {
    return { emoji: "📢", bg: "#EEF2FF", color: "#4F46E5" };
  }
  if (n.isSuccess) {
    return { emoji: "✅", bg: "#E9FBF0", color: "#15803D" };
  }
  return { emoji: "❌", bg: "#FFF1F1", color: "#DC2626" };
}

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    loadNotifications();

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
        const unreadIds = JSON.parse(localStorage.getItem("readList") || "[]");
        const count = res.data.notifications.filter(
          (n) => !unreadIds.includes(n.id),
        ).length;
        setUnreadCount(count);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  const toggleDropdown = () => {
    if (!isOpen) {
      const ids = notifications.map((n) => n.id);
      localStorage.setItem("readList", JSON.stringify(ids));
      setUnreadCount(0);
    }
    setIsOpen(!isOpen);
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="notif-wrapper" ref={dropdownRef}>
      <button
        className="notif-bell-btn"
        onClick={toggleDropdown}
        aria-label="Notifications"
      >
        <IconBell />
        {unreadCount > 0 && (
          <span className="notif-badge">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notif-dropdown">
          <div className="notif-header">
            <h3>Notifications</h3>
            {notifications.length > 0 && (
              <span className="notif-count">{notifications.length}</span>
            )}
          </div>

          <div className="notif-body">
            {notifications.length === 0 ? (
              <div className="notif-empty">No new notifications.</div>
            ) : (
              notifications.map((n) => {
                const { emoji, bg, color } = notifMeta(n);
                return (
                  <div
                    key={n.id}
                    className={`notif-item${n.type === "notice" ? " notif-item--notice" : ""}`}
                  >
                    <div
                      className="notif-icon"
                      style={{ background: bg, color }}
                    >
                      {emoji}
                    </div>
                    <div className="notif-content">
                      <p className="notif-title">{n.title}</p>
                      {n.message && <p className="notif-desc">{n.message}</p>}
                      <span className="notif-date">{formatDate(n.date)}</span>
                    </div>
                    {n.type === "notice" && (
                      <span className="notif-tag">Notice</span>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div className="notif-footer">
            <Link
              to="/notices"
              className="notif-footer-link"
              onClick={() => setIsOpen(false)}
            >
              View all notices →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
