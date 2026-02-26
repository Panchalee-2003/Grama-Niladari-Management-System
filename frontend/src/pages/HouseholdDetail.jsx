import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/householdDetail.css";
import api from "../api/api";

/* ===== Icons (inline SVG) ===== */
function IconSearch() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" stroke="#7A8CA7" strokeWidth="2" />
      <path d="M20 20l-3.5-3.5" stroke="#7A8CA7" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconUser() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="#ffffff" strokeWidth="2" />
      <path d="M4 20a8 8 0 0 1 16 0" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconHome() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5Z" stroke="#fff" strokeWidth="2" />
    </svg>
  );
}
function IconPeople() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M16 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3Z" stroke="#fff" strokeWidth="2" />
      <path d="M6 12a3 3 0 1 0-3-3 3 3 0 0 0 3 3Z" stroke="#fff" strokeWidth="2" />
      <path d="M2 21a6 6 0 0 1 8-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 21a6 6 0 0 1 12 0" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconDoc() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M7 3h7l3 3v15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" stroke="#fff" strokeWidth="2" />
      <path d="M14 3v4h4" stroke="#fff" strokeWidth="2" />
    </svg>
  );
}
function IconChat() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
function IconBell() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z" stroke="#fff" strokeWidth="2" />
      <path d="M9.5 19a2.5 2.5 0 0 0 5 0" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconAid() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7" stroke="#fff" strokeWidth="2" />
      <path d="M4 12l8-8 8 8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 7v14" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconHouseCard() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5Z" stroke="#1E8E3E" strokeWidth="2" />
    </svg>
  );
}
function IconMembersCard() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M8 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3Z" stroke="#1E8E3E" strokeWidth="2" />
      <path d="M17 12a3 3 0 1 0-3-3 3 3 0 0 0 3 3Z" stroke="#1E8E3E" strokeWidth="2" />
      <path d="M2 21a6 6 0 0 1 10 0" stroke="#1E8E3E" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 21a6 6 0 0 1 10 0" stroke="#1E8E3E" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconMoneyCard() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 1v22" stroke="#1E8E3E" strokeWidth="2" strokeLinecap="round" />
      <path d="M17 5H9a3 3 0 0 0 0 6h6a3 3 0 0 1 0 6H6" stroke="#1E8E3E" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconInfo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10Z" stroke="#7A8CA7" strokeWidth="2" />
      <path d="M12 10v7" stroke="#7A8CA7" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 7h.01" stroke="#7A8CA7" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
function IconReject() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M18 6 6 18" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 6l12 12" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconCheck() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M20 6 9 17l-5-5" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function statusLabel(s) {
  if (s === "PENDING") return "Pending Review";
  if (s === "VERIFIED") return "Verified";
  if (s === "REJECTED") return "Rejected";
  return s;
}

export default function HouseholdDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const householdId = location.state?.household_id;

  const [household, setHousehold] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState("");

  useEffect(() => {
    if (!householdId) {
      setError("No household selected. Please go back and choose one.");
      setLoading(false);
      return;
    }
    fetchDetail();
    // eslint-disable-next-line
  }, [householdId]);

  async function fetchDetail() {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/api/household/${householdId}/detail`);
      if (res.data.ok) {
        setHousehold(res.data.household);
        setMembers(res.data.members);
      } else {
        setError(res.data.error || "Failed to load household");
      }
    } catch (err) {
      setError(err?.response?.data?.error || "Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(newStatus) {
    setActionLoading(true);
    setActionMsg("");
    try {
      const res = await api.patch(`/api/household/${householdId}/status`, { status: newStatus });
      if (res.data.ok) {
        setHousehold((prev) => ({ ...prev, status: newStatus }));
        setActionMsg(
          newStatus === "VERIFIED"
            ? "✅ Household successfully verified!"
            : "❌ Household has been rejected."
        );
        // Navigate back after short delay
        setTimeout(() => navigate("/gn-households"), 1500);
      } else {
        setActionMsg("⚠️ " + (res.data.error || "Failed to update status"));
      }
    } catch (err) {
      setActionMsg("⚠️ " + (err?.response?.data?.error || "Server error"));
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="hd-wrap">
      {/* Sidebar */}
      <aside className="hd-side">
        <div className="hd-side-brand">
          <div className="hd-side-title">Maspanna Division</div>
          <div className="hd-side-sub">GRAMA NILADHARI</div>
        </div>

        <nav className="hd-side-nav">
          <Link className="hd-side-item" to="/gn">
            <span className="hd-side-ico"><IconHome /></span>
            <span>Dashboard</span>
          </Link>

          <Link className="hd-side-item hd-side-active" to="/gn-households">
            <span className="hd-side-ico"><IconPeople /></span>
            <span>Households</span>
          </Link>

          <Link className="hd-side-item" to="/gn-certificates">
            <span className="hd-side-ico"><IconDoc /></span>
            <span>Certificates</span>
          </Link>

          <Link className="hd-side-item" to="/gn-complaints">
            <span className="hd-side-ico"><IconChat /></span>
            <span>Complaints</span>
          </Link>

          <Link className="hd-side-item" to="/gn-notices">
            <span className="hd-side-ico"><IconBell /></span>
            <span>Notices</span>
          </Link>

          <Link className="hd-side-item" to="/gn-allowances">
            <span className="hd-side-ico"><IconAid /></span>
            <span>Allowances &amp; Aids</span>
          </Link>
        </nav>

        <div className="hd-side-bottom">
          <button className="hd-side-settings">Settings</button>
        </div>
      </aside>

      {/* Main */}
      <section className="hd-main">
        {/* Topbar */}
        <header className="hd-top">
          <div className="hd-top-left">
            <span className="hd-top-brand">GN Digital System</span>
            <span className="hd-top-slash">/</span>
            <span className="hd-top-page">Review Registration</span>
          </div>

          <div className="hd-top-right">
            <div className="hd-top-search"><IconSearch /></div>
            <div className="hd-top-profile" aria-label="profile">
              <IconUser />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="hd-content">
          <div className="hd-backrow">
            <Link className="hd-back" to="/gn-households">← Back to Registrations</Link>
          </div>

          {/* Loading / Error states */}
          {loading && (
            <div className="hd-state-msg">Loading household details…</div>
          )}
          {!loading && error && (
            <div className="hd-state-msg hd-state-error">{error}</div>
          )}

          {/* Main content when data is loaded */}
          {!loading && !error && household && (
            <>
              <div className="hd-title-row">
                <div>
                  <div className="hd-h1">Household ID: {household.household_id}</div>
                  <div className="hd-sub">
                    Application submitted on{" "}
                    {new Date(household.created_at).toLocaleDateString("en-GB", {
                      day: "numeric", month: "long", year: "numeric"
                    })}
                  </div>
                </div>

                <div className={`hd-pill hd-pill-${household.status.toLowerCase()}`}>
                  <span className="hd-pill-dot" />
                  <span>{statusLabel(household.status)}</span>
                </div>
              </div>

              <div className="hd-grid">
                {/* Left column */}
                <div className="hd-col-left">
                  <div className="hd-card">
                    <div className="hd-card-head">
                      <span className="hd-card-ico"><IconHouseCard /></span>
                      <span className="hd-card-title">Basic Information</span>
                    </div>

                    <div className="hd-kv">
                      <div className="hd-k">HOUSEHOLDER NAME</div>
                      <div className="hd-v">{household.householder_name}</div>
                    </div>

                    <div className="hd-kv" style={{ marginTop: 14 }}>
                      <div className="hd-k">ADDRESS</div>
                      <div className="hd-v">{household.address}</div>
                    </div>

                    {household.phone_number && (
                      <div className="hd-kv" style={{ marginTop: 14 }}>
                        <div className="hd-k">PHONE</div>
                        <div className="hd-v">{household.phone_number}</div>
                      </div>
                    )}

                    <div className="hd-badges" style={{ marginTop: 14 }}>
                      {household.water_supply === "Yes" || household.water_supply === "YES" ? (
                        <span className="hd-badge blue">💧 Water Connected</span>
                      ) : (
                        <span className="hd-badge gray">💧 No Water Connection</span>
                      )}
                      {household.electricity_connection === "Yes" || household.electricity_connection === "YES" ? (
                        <span className="hd-badge yellow">⚡ Electricity Connected</span>
                      ) : (
                        <span className="hd-badge gray">⚡ No Electricity</span>
                      )}
                    </div>
                  </div>

                  <div className="hd-card">
                    <div className="hd-card-head">
                      <span className="hd-card-ico"><IconMoneyCard /></span>
                      <span className="hd-card-title">Financial Info</span>
                    </div>

                    <div className="hd-fin-row">
                      <span className="hd-fin-label">Income Source</span>
                      <span className="hd-fin-value">{household.income_source || "—"}</span>
                    </div>

                    <div className="hd-fin-row">
                      <span className="hd-fin-label">Monthly Income Range</span>
                      <span className="hd-fin-value">{household.income_range || "—"}</span>
                    </div>

                    <div className="hd-fin-row">
                      <span className="hd-fin-label">Receiving Govt Aid</span>
                      <span className={household.govt_aid === "Yes" ? "hd-fin-ok" : "hd-fin-value"}>
                        {household.govt_aid || "—"}
                      </span>
                    </div>

                    {household.notes && (
                      <div className="hd-fin-row">
                        <span className="hd-fin-label">Notes</span>
                        <span className="hd-fin-value">{household.notes}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right column */}
                <div className="hd-col-right">
                  <div className="hd-card hd-card-tall">
                    <div className="hd-card-head">
                      <span className="hd-card-ico"><IconMembersCard /></span>
                      <span className="hd-card-title">Family Members</span>
                    </div>

                    <div className="hd-table">
                      <div className="hd-tr hd-th">
                        <div>NAME</div>
                        <div>NIC NUMBER</div>
                        <div>EMPLOYMENT</div>
                        <div className="hd-ta-right">RELATIONSHIP</div>
                      </div>

                      {members.length === 0 && (
                        <div className="hd-tr">
                          <div style={{ gridColumn: "span 4", color: "#999", fontStyle: "italic" }}>
                            No family members recorded.
                          </div>
                        </div>
                      )}

                      {members.map((m) => (
                        <div key={m.member_id} className="hd-tr">
                          <div className="hd-namecell">
                            <div className="hd-name">{m.full_name}</div>
                            <div className="hd-role">{m.relationship_to_head || "—"}</div>
                          </div>
                          <div className="hd-muted">{m.nic_number || "—"}</div>
                          <div>
                            <span className={`hd-chip ${m.employment_status ? "green" : "gray"}`}>
                              {m.employment_status || "—"}
                            </span>
                          </div>
                          <div className="hd-ta-right hd-muted">
                            {m.relationship_to_head || "—"}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="hd-card-foot">
                      <div className="hd-foot-left">
                        Showing {members.length} family member{members.length !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>

        {/* Bottom actions */}
        {!loading && !error && household && (
          <footer className="hd-actions">
            <div className="hd-actions-left">
              <IconInfo />
              <span>Review all details before finalizing decision.</span>
              {actionMsg && <span className="hd-action-msg">{actionMsg}</span>}
            </div>

            <div className="hd-actions-right">
              {household.status === "PENDING" ? (
                <>
                  <button
                    className="hd-btn outline red"
                    onClick={() => updateStatus("REJECTED")}
                    disabled={actionLoading}
                  >
                    <IconReject />
                    <span>Reject Application</span>
                  </button>

                  <button
                    className="hd-btn solid green"
                    onClick={() => updateStatus("VERIFIED")}
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <span>Processing…</span>
                    ) : (
                      <>
                        <IconCheck />
                        <span>APPROVE</span>
                      </>
                    )}
                  </button>
                </>
              ) : (
                <div className={`hd-status-done hd-status-${household.status.toLowerCase()}`}>
                  {statusLabel(household.status)}
                </div>
              )}
            </div>
          </footer>
        )}
      </section>
    </div>
  );
}
