import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/gnDashboard.css";
import { clearAuth } from "../auth/auth";
import api from "../api/api";

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
function IconSearch() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" stroke="currentColor" strokeWidth="2" />
      <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconProfile() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="#0B2B16" strokeWidth="2" />
      <path d="M4 20a8 8 0 0 1 16 0" stroke="#0B2B16" strokeWidth="2" strokeLinecap="round" />
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

function StatCard({ title, value, loading }) {
  return (
    <div className="gn-summary-card">
      <div className="gn-s-title">{title}</div>
      <div className="gn-s-number">
        {loading ? <span className="gn-loading-num">—</span> : value}
      </div>
    </div>
  );
}

export default function GNDashboard() {
  const navigate = useNavigate();

  const [gnName, setGnName] = useState("");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [profileRes, statsRes] = await Promise.all([
          api.get("/api/gn/profile"),
          api.get("/api/gn/stats"),
        ]);

        if (profileRes.data.ok && profileRes.data.profile) {
          setGnName(profileRes.data.profile.name);
        }

        if (statsRes.data.ok) {
          setStats(statsRes.data.stats);
        }
      } catch (err) {
        console.error("GN Dashboard fetch error:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <div className="gn-wrap">
      {/* LEFT SIDEBAR */}
      <aside className="gn-sidebar">
        <div className="gn-brand">
          <div className="gn-brand-title">Maspanna Division</div>
          <div className="gn-brand-sub">Grama Niladhari</div>
        </div>

        <nav className="gn-menu">
          <Link to="/gn" className="gn-item gn-item-active">
            <span className="gn-ico"><IconHome /></span>
            <span>Dashboard</span>
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

      {/* MAIN CONTENT */}
      <main className="gn-main">
        {/* TOP BAR */}
        <div className="gn-topbar">
          <div className="gn-top-left">GN Digital System</div>

          <div className="gn-search">
            <input className="gn-search-input" type="text" placeholder="Search..." />
            <span className="gn-search-ico"><IconSearch /></span>
          </div>

          <div className="gn-top-right">
            <div className="gn-profile-circle">
              <IconProfile />
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="gn-content">
          <h1 className="gn-welcome">
            Welcome, {gnName ? `${gnName}` : loading ? "Loading..." : "Officer"}
          </h1>

          {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}

          <h2 className="gn-section-title">Quick Summary</h2>
          <div className="gn-summary">
            <StatCard
              title={<>Total Registered<br />Households</>}
              value={stats?.total_households ?? 0}
              loading={loading}
            />
            <StatCard
              title={<>Pending<br />Verifications</>}
              value={stats?.pending_households ?? 0}
              loading={loading}
            />
            <StatCard
              title={<>Verified<br />Households</>}
              value={stats?.verified_households ?? 0}
              loading={loading}
            />
            <StatCard
              title="Open Complaints"
              value={stats?.open_complaints ?? 0}
              loading={loading}
            />
          </div>

          <h2 className="gn-section-title">Action Shortcuts</h2>
          <div className="gn-actions">
            <button className="gn-action-btn" onClick={() => navigate("/gn-households")}>Verify Households</button>
            <button className="gn-action-btn" onClick={() => navigate("/gn-certificates")}>Issue Certificates</button>
            <button className="gn-action-btn" onClick={() => navigate("/gn-complaints")}>View Complaints</button>
            <button className="gn-action-btn" onClick={() => navigate("/gn-notices")}>Post Notice</button>
            <button className="gn-action-btn">Generate Reports</button>
          </div>

          <h2 className="gn-section-title">Analytics</h2>
          <div className="gn-analytics">
            <div className="gn-chart">
              <div className="gn-chart-title">Household Status Breakdown</div>
              {!loading && stats && (
                <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-end", height: "120px", padding: "0 1rem" }}>
                  {[
                    { label: "Pending", value: stats.pending_households, color: "#f59e0b" },
                    { label: "Verified", value: stats.verified_households, color: "#22c55e" },
                    { label: "Rejected", value: stats.rejected_households, color: "#ef4444" },
                  ].map(({ label, value, color }) => {
                    const max = Math.max(stats.pending_households, stats.verified_households, stats.rejected_households, 1);
                    const height = Math.max((value / max) * 100, 4);
                    return (
                      <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, gap: "0.4rem" }}>
                        <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>{value}</span>
                        <div style={{ width: "100%", height: `${height}px`, background: color, borderRadius: "4px 4px 0 0", transition: "height 0.5s ease" }} />
                        <span style={{ fontSize: "0.7rem", color: "var(--text-muted, #666)" }}>{label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
              {loading && <div style={{ padding: "2rem", textAlign: "center", color: "#888" }}>Loading...</div>}
              <div className="gn-months" />
            </div>

            <div className="gn-chart">
              <div className="gn-chart-title">Complaints Overview</div>
              {!loading && stats && (
                <div style={{ padding: "1rem 1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                    <span style={{ fontSize: "0.9rem" }}>Total Complaints</span>
                    <strong>{stats.total_complaints}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                    <span style={{ fontSize: "0.9rem" }}>Open / Unresolved</span>
                    <strong style={{ color: "#ef4444" }}>{stats.open_complaints}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "0.9rem" }}>Resolved</span>
                    <strong style={{ color: "#22c55e" }}>{stats.total_complaints - stats.open_complaints}</strong>
                  </div>
                </div>
              )}
              {loading && <div style={{ padding: "2rem", textAlign: "center", color: "#888" }}>Loading...</div>}
              <div className="gn-months" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
