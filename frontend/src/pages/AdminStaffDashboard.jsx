import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/adminStaffDashboard.css";
import { clearAuth } from "../auth/auth";
import api from "../api/api";
import emblem from "../assets/emblem.png";

export default function AdminStaffDashboard() {
  const navigate = useNavigate();
  const [divisions, setDivisions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // List of 68 GN divisions in Uva Paranagama
  const gnDivisionsList = [
    "Maspanna",
    "Wethalawa",
    "Kindigoda",
    "Kohilegama",
    "Ellanda",
    "Yalagamuwa",
    "Ritikumbura",
    "Wewegama",
    "Dimbulana",
    "Hathkinda",
    "Gampaha",
    "Ilukwela",
    "Kirklees",
    "Bambarapana",
    "Malwaththegama",
    "Medipokuna",
    "Pitiyakumbura",
    "Thuppitiya",
    "Panagoda",
    "Kirawanagama",
    "Pannalawela",
    "Lunuwaththa",
    "Unapana",
    "Rahupola",
    "Beraliyapola",
    "Sapugolla",
    "Ethkandawaka",
    "Alagolla",
    "Paranagama",
    "Thawalampola",
    "Hangunnawa",
    "Idamegama",
    "Mudanawa",
    "Ranhawadigama",
    "Kodakumbura",
    "Woldimar",
    "Uduhawara",
    "Malapolagama",
    "Welamedagama",
    "Korandekumbura",
    "Kumarapattiya",
    "Busdulla",
    "Balagala",
    "Kurundugolla",
    "Pallewela",
    "Perawella",
    "Medawela",
    "Galahagama",
    "Karagahaulapatha",
    "Medagodagama",
    "Thelhawadigama",
    "Umaela",
    "Ambagasdowa",
    "Dangamuwa",
    "Rathamba",
    "Daragala",
    "Ketagoda",
    "Pannalagama",
    "Metiwalalanda",
    "Hangiliella",
    "Ulugala",
    "Yahalaarawa",
    "Kendagolla",
    "Kotawera Udagama",
    "Kotawera Pahalagama",
    "Downside",
    "Udaperuwa",
    "Weliulla",
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/api/certificate/admin/stats");
        let maspannaPending = 0;
        if (res.data.ok) {
          maspannaPending = res.data.stats.pending_verifications;
        }

        // Mock fetching all divisions
        const formattedDivisions = gnDivisionsList.map((div) => ({
          name: div,
          pendingRequests: div === "Maspanna" ? maspannaPending : 0,
        }));

        setDivisions(formattedDivisions);
      } catch (err) {
        console.error("Failed to load admin stats", err);
        setDivisions(
          gnDivisionsList.map((div) => ({
            name: div,
            pendingRequests: 0,
          })),
        );
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

  const filteredDivisions = divisions.filter((div) =>
    div.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="ds-page">
      {/* TOP HEADER */}
      <header className="ds-top">
        <div className="ds-brand">
          <img className="ds-emblem" src={emblem} alt="Sri Lanka Emblem" />
          <div className="ds-brand-text">
            <div className="ds-title">
              Divisional Secretariat - Uva Paranagama
            </div>
            <div className="ds-subtitle">
              Ministry of Home Affairs & Public Administration
            </div>
          </div>
        </div>

        <div className="ds-top-actions">
          <button className="ds-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <main className="ds-main">
        <div className="ds-dashboard-header">
          <h1 className="ds-overview-title">Divisional Secretariat Overview</h1>
          <div className="ds-search-wrap">
            <input
              type="text"
              className="ds-search-input"
              placeholder="Search GN Division..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="ds-loading">Loading divisions...</div>
        ) : (
          <div className="ds-grid">
            {filteredDivisions.length > 0 ? (
              filteredDivisions.map((div, index) => (
                <div key={index} className="ds-card">
                  <div className="ds-card-header">
                    <h3 className="ds-card-title">{div.name}</h3>
                    {div.pendingRequests > 0 && (
                      <span className="ds-badge">
                        {div.pendingRequests} Pending
                      </span>
                    )}
                    {div.pendingRequests === 0 && (
                      <span className="ds-badge ds-badge-empty">0 Pending</span>
                    )}
                  </div>
                  <div className="ds-card-body">
                    <button
                      className="ds-open-btn"
                      onClick={() => {
                        if (div.name === "Maspanna") {
                          navigate("/admin-verify-certificates");
                        } else {
                          alert(
                            "Information for this division is not added yet.",
                          );
                        }
                      }}
                      style={
                        div.name !== "Maspanna"
                          ? {
                              backgroundColor: "#a5d6a7",
                              cursor: "not-allowed",
                            }
                          : {}
                      }
                    >
                      {div.name === "Maspanna"
                        ? "Open Division"
                        : "Data Not Added Yet"}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="ds-no-results">
                No divisions found matching "{searchQuery}"
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
