import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/adminStaffDashboard.css";
import { clearAuth } from "../auth/auth";
import api from "../api/api";
import emblem from "../assets/emblem.png";

/* ========= ICONS (SVG) ========= */
function IconDashboard() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 11.5L12 4l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V11.5Z"
        stroke="#0b0b0b"
        strokeWidth="2"
      />
    </svg>
  );
}

function IconDoc() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 3h7l3 3v15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
        stroke="#0b0b0b"
        strokeWidth="2"
      />
      <path d="M14 3v4h4" stroke="#0b0b0b" strokeWidth="2" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        stroke="#111"
        strokeWidth="2"
      />
      <path
        d="M21 21l-4.3-4.3"
        stroke="#111"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconUser() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
        stroke="#0b0b0b"
        strokeWidth="2"
      />
      <path
        d="M4 20a8 8 0 0 1 16 0"
        stroke="#0b0b0b"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
        stroke="#0b0b0b"
        strokeWidth="2"
      />
      <path
        d="M19.4 15a7.7 7.7 0 0 0 .1-2l2-1.2-2-3.4-2.3.6a7.6 7.6 0 0 0-1.7-1l-.3-2.3H11l-.3 2.3a7.6 7.6 0 0 0-1.7 1l-2.3-.6-2 3.4 2 1.2a7.7 7.7 0 0 0 .1 2l-2 1.2 2 3.4 2.3-.6a7.6 7.6 0 0 0 1.7 1l.3 2.3h4l.3-2.3a7.6 7.6 0 0 0 1.7-1l2.3.6 2-3.4-2-1.2Z"
        stroke="#0b0b0b"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
        stroke="#0b0b0b"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16 17l5-5-5-5"
        stroke="#0b0b0b"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 12H9"
        stroke="#0b0b0b"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function AdminStaffDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    pending_verifications: 0,
    approved_this_month: 0,
    rejected_this_month: 0,
    total_requests: 0,
    weekly: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/api/certificate/admin/stats");
        if (res.data.ok) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error("Failed to load admin stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const gnDivisions = [
    "Maspanna", "Wethalawa", "Kindigoda", "Kohilegama", "Ellanda", "Yalagamuwa", "Ritikumbura", "Wewegama",
    "Dimbulana", "Hathkinda", "Gampaha", "Ilukwela", "Kirklees", "Bambarapana", "Malwaththegama",
    "Medipokuna", "Pitiyakumbura", "Thuppitiya", "Panagoda", "Kirawanagama", "Pannalawela", "Lunuwaththa",
    "Unapana", "Rahupola", "Beraliyapola", "Sapugolla", "Ethkandawaka", "Alagolla", "Paranagama",
    "Thawalampola", "Hangunnawa", "Idamegama", "Mudanawa", "Ranhawadigama", "Kodakumbura", "Woldimar",
    "Uduhawara", "Malapolagama", "Welamedagama", "Korandekumbura", "Kumarapattiya", "Busdulla", "Balagala",
    "Kurundugolla", "Pallewela", "Perawella", "Medawela", "Galahagama", "Karagahaulapatha", "Medagodagama",
    "Thelhawadigama", "Umaela", "Ambagasdowa", "Dangamuwa", "Rathamba", "Daragala", "Ketagoda",
    "Pannalagama", "Metiwalalanda", "Hangiliella", "Ulugala", "Yahalaarawa", "Kendagolla",
    "Kotawera Udagama", "Kotawera Pahalagama", "Downside", "Udaperuwa", "Weliulla"
  ];

  return (
    <div className="asd-page">
      {/* LEFT SIDEBAR */}
      <aside className="asd-sidebar">
        <div className="asd-brand" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '15px' }}>
          <img src={emblem} alt="Sri Lanka Emblem" style={{ width: '50px', height: 'auto' }} />
          <div>
            <div className="asd-brand-title">Divisional Secretariat</div>
            <div className="asd-brand-sub" style={{ fontSize: '16px' }}>Uva Paranagama</div>
          </div>
        </div>

        <div className="asd-nav">
          <Link to="#" className="asd-nav-item asd-nav-active">
            <IconDashboard />
            <span>Dashboard</span>
          </Link>

          <Link to="/admin-verify-certificates" className="asd-nav-item asd-nav-muted">
            <IconDoc />
            <span>Verify Certificates</span>
          </Link>
        </div>

        <div className="asd-settings">
          <Link to="#" className="asd-settings-link">
            <IconSettings />
            <span>Settings</span>
          </Link>
          <button onClick={handleLogout} className="asd-settings-link" style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', padding: '0' }}>
            <IconLogout />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* RIGHT CONTENT */}
      <section className="asd-content">
        {/* TOP BAR */}
        <header className="asd-topbar">
          <div className="asd-topbar-title">Divisional Secretariat Digital System</div>

          <div className="asd-search-wrap">
            <div className="asd-search-bar" />
            <div className="asd-search-icon">
              <IconSearch />
            </div>
          </div>

          <div className="asd-user-circle" aria-label="profile">
            <IconUser />
          </div>
        </header>

        {/* MAIN */}
        <main className="asd-main">

          {/* GN DIVISIONS LIST */}
          <div style={{ marginBottom: '40px', width: '100%', overflow: 'hidden' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px', color: '#111' }}>Grama Niladhari Divisions - Uva Paranagama</h2>
            <div style={{ 
                display: 'flex', 
                overflowX: 'auto', 
                gap: '15px', 
                paddingBottom: '15px'
            }}>
                {gnDivisions.map(div => (
                    <div key={div} style={{
                        minWidth: '140px',
                        background: div === 'Maspanna' ? '#0C7A3B' : '#f4f6f8',
                        color: div === 'Maspanna' ? '#fff' : '#111',
                        padding: '15px',
                        borderRadius: '10px',
                        textAlign: 'center',
                        fontWeight: '600',
                        fontSize: '14px',
                        border: '1px solid #ddd',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        cursor: 'pointer',
                        userSelect: 'none',
                        flexShrink: 0
                    }}>
                        {div}
                    </div>
                ))}
            </div>
          </div>

          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px', color: '#111' }}>Maspanna Division Details</h2>

          {/* CARDS */}
          <div className="asd-cards">
            <div className="asd-card">
              <div className="asd-card-title">Certificates Pending Verification</div>
              <div className="asd-card-value">{loading ? "..." : stats.pending_verifications}</div>
            </div>

            <div className="asd-card">
              <div className="asd-card-title">Certificates Approved (This Month)</div>
              <div className="asd-card-value">{loading ? "..." : stats.approved_this_month}</div>
            </div>

            <div className="asd-card">
              <div className="asd-card-title">Certificates Rejected (This Month)</div>
              <div className="asd-card-value">{loading ? "..." : stats.rejected_this_month}</div>
            </div>

            <div className="asd-card">
              <div className="asd-card-title">Total Verification Requests</div>
              <div className="asd-card-value">{loading ? "..." : stats.total_requests}</div>
            </div>
          </div>

          {/* WEEKLY ACTIVITY */}
          <div className="asd-weekly">
            <div className="asd-weekly-title">Weekly Verification Activity</div>

            <div className="asd-weekly-box">
              <div className="asd-weekly-left">
                <div className="asd-weekly-sub">Verifications Processed</div>
                <div className="asd-weekly-num">{loading ? "..." : stats.total_requests}</div>
              </div>

              <div className="asd-chart">
                <div className="asd-bars" style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                  {stats.weekly && stats.weekly.length > 0 ? (
                    [...stats.weekly].reverse().map((w, i) => {
                      const heightPercent = stats.total_requests ? Math.max((w.count / stats.total_requests) * 100, 5) : 5;
                      return (
                        <div
                          key={i}
                          className="asd-bar"
                          style={{ height: `${heightPercent}%`, width: '40px', background: '#bfddc6', borderRadius: '4px' }}
                          title={`${w.count} requests`}
                        />
                      );
                    })
                  ) : (
                    <>
                       <div className="asd-bar" style={{height: '30%'}} />
                       <div className="asd-bar" style={{height: '50%'}} />
                       <div className="asd-bar" style={{height: '80%'}} />
                       <div className="asd-bar" style={{height: '40%'}} />
                    </>
                  )}
                </div>

                <div className="asd-bar-labels" style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                  {stats.weekly && stats.weekly.length > 0 ? (
                    [...stats.weekly].reverse().map((w, i) => (
                      <div key={i} style={{ width: '40px', textAlign: 'center', fontSize: '12px' }}>W{w.week}</div>
                    ))
                  ) : (
                    <>
                      <div>Week 1</div>
                      <div>Week 2</div>
                      <div>Week 3</div>
                      <div>Week 4</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </section>
    </div>
  );
}
