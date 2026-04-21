import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/gnDashboard.css";
import "../styles/householdVerify.css"; // Reuse sidebar styles
import "../styles/settings.css";
import GNProfileDropdown from "../components/GNProfileDropdown";

function IconHome() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
function IconPeople() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M2 21a8 8 0 0 1 16 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconDoc() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 3h7l3 3v15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M14 3v4h4" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function IconFlag() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 3v18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M6 4h10l-2 4 2 4H6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconBell() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z"
        stroke="currentColor"
        strokeWidth="2"
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
function IconCoin() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <ellipse
        cx="12"
        cy="7"
        rx="8"
        ry="3"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M4 7v10c0 1.7 3.6 3 8 3s8-1.3 8-3V7"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
function IconSettings() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M19.4 15a7.7 7.7 0 0 0 .1-1l2-1.2-2-3.4-2.3.6a7.4 7.4 0 0 0-1.7-1L15 6h-6l-.5 2.4a7.4 7.4 0 0 0-1.7 1l-2.3-.6-2 3.4 2 1.2a7.7 7.7 0 0 0 0 2l-2 1.2 2 3.4 2.3-.6a7.4 7.4 0 0 0 1.7 1L9 22h6l.5-2.4a7.4 7.4 0 0 0 1.7-1l2.3.6 2-3.4-2-1.2a7.7 7.7 0 0 0-.1-1Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconGlobe() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path
        d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
function IconPalette() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 22.14a4.48 4.48 0 0 0-4.47-4.48 4.48 4.48 0 0 1-4.47-4.47"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

export default function GNSettings() {
  const [lang, setLang] = useState("english");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSave = () => {
    setSaving(true);
    setSuccess("");
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      setSuccess("Settings updated successfully!");
    }, 800);
  };

  return (
    <div className="gn-wrap">
      {/* SIDEBAR */}
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
            <span>Allowances & Aids</span>
          </Link>
        </nav>
        <div className="gn-settings">
          <Link
            to="/gn/settings"
            className="gn-item gn-item-settings gn-item-active"
          >
            <span className="gn-ico">
              <IconSettings />
            </span>
            <span>Settings</span>
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="gn-main" style={{ background: bgColor }}>
        <header className="hv-topbar">
          <div className="hv-top-title">GN Digital System</div>
          <div className="hv-top-icons">
            <GNProfileDropdown />
          </div>
        </header>

        <div className="settings-page">
          <h1 className="settings-h1">Account Settings</h1>

          <div className="settings-grid">
            {/* Preferred Language Card */}
            <div className="settings-card">
              <div className="settings-card-title">
                <div className="settings-icon-wrap">
                  <IconGlobe />
                </div>
                Preferred Language
              </div>
              <div className="settings-form-group">
                <label className="settings-label">Select System Language</label>
                <select
                  className="settings-select"
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                >
                  <option value="english">English</option>
                  <option value="sinhala">Sinhala (සිංහල)</option>
                  <option value="tamil">Tamil (தமிழ்)</option>
                </select>
              </div>
              <p style={{ fontSize: "13px", color: "#777", marginTop: "10px" }}>
                Choosing a language will change the system labels and
                notifications.
              </p>
            </div>

            {/* Customization Card */}
            <div className="settings-card">
              <div className="settings-card-title">
                <div className="settings-icon-wrap">
                  <IconPalette />
                </div>
                Appearance & Customization
              </div>
              <div className="settings-form-group">
                <label className="settings-label">Background Color</label>
                <div
                  style={{ display: "flex", gap: "10px", alignItems: "center" }}
                >
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    style={{
                      width: "44px",
                      height: "44px",
                      padding: "2px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  />
                  <input
                    type="text"
                    className="settings-input"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    style={{ flex: 1 }}
                  />
                </div>
              </div>
              <div className="settings-form-group">
                <label className="settings-label">Dark Mode</label>
                <button
                  className="settings-input"
                  style={{ textAlign: "left", cursor: "pointer" }}
                  onClick={() =>
                    setBgColor(bgColor === "#1a1a1a" ? "#ffffff" : "#1a1a1a")
                  }
                >
                  {bgColor === "#1a1a1a"
                    ? "Switch to Light Mode"
                    : "Switch to Dark Mode"}
                </button>
              </div>
            </div>

            {/* Account Information Card */}
            <div className="settings-card">
              <div className="settings-card-title">
                <div className="settings-icon-wrap">
                  <IconPeople />
                </div>
                Account Information
              </div>
              <div className="settings-form-group">
                <label className="settings-label">Registered Name</label>
                <input
                  className="settings-input"
                  value="J.A. Jayawardena"
                  readOnly
                />
              </div>
              <div className="settings-form-group">
                <label className="settings-label">
                  Grama Niladhari Division
                </label>
                <input
                  className="settings-input"
                  value="Maspanna (GN 12)"
                  readOnly
                />
              </div>
              <p style={{ fontSize: "12px", color: "#999" }}>
                Member information is verified by the District Secretariat.
              </p>
            </div>

            {/* Notifications Card */}
            <div className="settings-card">
              <div className="settings-card-title">
                <div className="settings-icon-wrap">
                  <IconBell />
                </div>
                Notification Preferences
              </div>
              <div className="settings-form-group">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 0",
                  }}
                >
                  <input type="checkbox" id="email-notif" defaultChecked />
                  <label
                    htmlFor="email-notif"
                    className="settings-label"
                    style={{ margin: 0 }}
                  >
                    Email alerts for new certificate requests
                  </label>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 0",
                  }}
                >
                  <input type="checkbox" id="sms-notif" />
                  <label
                    htmlFor="sms-notif"
                    className="settings-label"
                    style={{ margin: 0 }}
                  >
                    SMS alerts for urgent complaints
                  </label>
                </div>
              </div>
              <button
                className="settings-btn-save"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Updating..." : "Save All Changes"}
              </button>
              {success && <div className="settings-success">{success}</div>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
