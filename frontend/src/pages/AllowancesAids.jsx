import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/api.js";
import "../styles/allowancesAids.css";
import GNProfileDropdown from "../components/GNProfileDropdown";

function IconHome() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-10.5Z"
        stroke="#0B0B0B"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M16 11a4 4 0 1 0-8 0"
        stroke="#0B0B0B"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M4 21a8 8 0 0 1 16 0"
        stroke="#0B0B0B"
        strokeWidth="1.8"
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
        stroke="#0B0B0B"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M14 3v4h4"
        stroke="#0B0B0B"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconFlag() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 3v18"
        stroke="#0B0B0B"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M6 4h11l-1.5 3L17 10H6"
        stroke="#0B0B0B"
        strokeWidth="1.8"
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
        stroke="#0B0B0B"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 19a2.5 2.5 0 0 0 5 0"
        stroke="#0B0B0B"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconAid() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12h14"
        stroke="#0B0B0B"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 5v14"
        stroke="#0B0B0B"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="4"
        stroke="#0B0B0B"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function IconGear() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
        stroke="#0B0B0B"
        strokeWidth="1.8"
      />
      <path
        d="M19.4 15a8.2 8.2 0 0 0 .1-1 8.2 8.2 0 0 0-.1-1l2-1.5-2-3.4-2.4 1a8 8 0 0 0-1.7-1L15 3h-6l-.3 2.1a8 8 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.5a8.2 8.2 0 0 0-.1 1c0 .34.03.67.1 1l-2 1.5 2 3.4 2.4-1c.54.4 1.1.73 1.7 1L9 21h6l.3-2.1c.6-.27 1.16-.6 1.7-1l2.4 1 2-3.4-2-1.5Z"
        stroke="#0B0B0B"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="6.5" stroke="#0B0B0B" strokeWidth="1.8" />
      <path
        d="M20 20l-3.4-3.4"
        stroke="#0B0B0B"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconProfile() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
        stroke="#0B0B0B"
        strokeWidth="1.8"
      />
      <path
        d="M4 20a8 8 0 0 1 16 0"
        stroke="#0B0B0B"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconDownload() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3v10"
        stroke="#0B0B0B"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M8 10l4 4 4-4"
        stroke="#0B0B0B"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M4 21h16"
        stroke="#0B0B0B"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconFile() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 3h8l3 3v15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
        stroke="#0B0B0B"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M15 3v4h4"
        stroke="#0B0B0B"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const mockRows = [
  { id: "12345", name: "Samantha Patel", nic: "12345678" },
  { id: "67890", name: "Ethan Silva", nic: "12345678" },
  { id: "24680", name: "Isabella Rodriguez", nic: "12345678" },
  { id: "13579", name: "Noah Chen", nic: "12345678" },
  { id: "98765", name: "Olivia Kapoor", nic: "12345678" },
  { id: "54321", name: "Liam O'Malley", nic: "12345678" },
  { id: "11223", name: "Ava Dubois", nic: "12345678" },
  { id: "33445", name: "Jackson Lee", nic: "12345678" },
];

function AllowancesAids() {
  const [filters, setFilters] = useState({
    age_group: "",
    income_range: "",
    employment_status: "",
    household_size: "",
    aid_type: "",
    special_needs: "",
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchResults = async () => {
    setLoading(true);
    setError("");
    try {
      // Build query string
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const res = await api.get(
        `/api/gn/allowances/filter?${params.toString()}`,
      );
      if (res.data.ok) {
        setResults(res.data.results);
      } else {
        throw new Error(res.data.error || "Failed to fetch results");
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching filtered data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch all when first mounted
    fetchResults();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const downloadCSV = () => {
    if (results.length === 0) {
      alert("No data to download");
      return;
    }

    // Define CSV headers
    const headers = ["Member_ID", "Name", "NIC_Number"];

    // Map data to CSV rows
    const rows = results.map((r) => [
      r.id,
      `"${r.name}"`, // Quote strings to handle commas in names
      r.nic,
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `eligible_citizens_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = async () => {
    if (results.length === 0) {
      alert("No data to download");
      return;
    }

    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const res = await api.get(
        `/api/gn/allowances/download-pdf?${params.toString()}`,
        {
          responseType: "blob", // Specify blob to handle binary PDF data
        },
      );

      const url = URL.createObjectURL(res.data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `eligible_citizens_${new Date().toISOString().split("T")[0]}.pdf`,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      alert("Failed to download PDF.");
    }
  };

  return (
    <div className="aa-page">
      {/* Sidebar */}
      <aside className="aa-sidebar">
        <div className="aa-sideTop">
          <div className="aa-sideTitle">Maspanna Division</div>
          <div className="aa-sideSub">Grama Niladhari</div>
        </div>

        <nav className="aa-nav">
          <Link className="aa-navItem" to="/gn">
            <span className="aa-navIcon">
              <IconHome />
            </span>
            <span className="aa-navText">Dashboard</span>
          </Link>
          <Link className="aa-navItem" to="/gn-households">
            <span className="aa-navIcon">
              <IconUsers />
            </span>
            <span className="aa-navText">Households</span>
          </Link>
          <Link className="aa-navItem" to="/gn-certificates">
            <span className="aa-navIcon">
              <IconDoc />
            </span>
            <span className="aa-navText">Certificates</span>
          </Link>
          <Link className="aa-navItem" to="/gn-complaints">
            <span className="aa-navIcon">
              <IconFlag />
            </span>
            <span className="aa-navText">Complaints</span>
          </Link>
          <Link className="aa-navItem" to="/gn-notices">
            <span className="aa-navIcon">
              <IconBell />
            </span>
            <span className="aa-navText">Notices</span>
          </Link>
          <Link className="aa-navItem aa-active" to="/gn-allowances">
            <span className="aa-navIcon">
              <IconAid />
            </span>
            <span className="aa-navText">Allowances &amp; Aids</span>
          </Link>
        </nav>

        <div className="aa-sideBottom">
          <Link className="aa-settings" to="/gn">
            <span className="aa-navIcon">
              <IconGear />
            </span>
            <span className="aa-navText">Settings</span>
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="aa-main">
        {/* Top bar */}
        <div className="aa-topbar">
          <div className="aa-topLeft">GN Digital System</div>
          <div className="aa-topCenter">
            <div className="aa-searchWrap">
              <input className="aa-searchBar" type="text" />
              <div className="aa-searchIcon">
                <IconSearch />
              </div>
            </div>
          </div>
          <div className="aa-topRight">
            <GNProfileDropdown />
          </div>
        </div>

        <div className="aa-divider" />

        {/* Content */}
        <section className="aa-content">
          <h1 className="aa-h1">Allowances &amp; Aids</h1>
          <p className="aa-sub">
            Manage citizen eligibility and approves for various aid programs.
          </p>

          <div className="aa-grid">
            {/* Filters */}
            <div className="aa-filters">
              <div className="aa-sectionTitle">Filter Citizens</div>

              <div className="aa-field">
                <div className="aa-label">By Age Group</div>
                <select
                  className="aa-select"
                  name="age_group"
                  value={filters.age_group}
                  onChange={handleFilterChange}
                >
                  <option value="">All Ages</option>
                  <option>18 - 25</option>
                  <option>26 - 40</option>
                  <option>41 - 60</option>
                  <option>60+</option>
                </select>
              </div>

              <div className="aa-field">
                <div className="aa-label">By Income Level</div>
                <select
                  className="aa-select"
                  name="income_range"
                  value={filters.income_range}
                  onChange={handleFilterChange}
                >
                  <option value="">All Incomes</option>
                  <option>&lt; 25,000</option>
                  <option>25,000 - 50,000</option>
                  <option>50,000 - 100,000</option>
                  <option>&gt; 100,000</option>
                </select>
              </div>

              <div className="aa-field">
                <div className="aa-label">By Employment Type</div>
                <select
                  className="aa-select"
                  name="employment_status"
                  value={filters.employment_status}
                  onChange={handleFilterChange}
                >
                  <option value="">All Employment Types</option>
                  <option>Employed</option>
                  <option>Unemployed</option>
                  <option>Student</option>
                  <option>Retired</option>
                </select>
              </div>

              <div className="aa-field">
                <div className="aa-label">By Household Size</div>
                <select
                  className="aa-select"
                  name="household_size"
                  value={filters.household_size}
                  onChange={handleFilterChange}
                >
                  <option value="">Any Size</option>
                  <option>1 - 2</option>
                  <option>3 - 4</option>
                  <option>5+</option>
                </select>
              </div>

              <div className="aa-field">
                <div className="aa-label">By Aid Type</div>
                <select
                  className="aa-select"
                  name="aid_type"
                  value={filters.aid_type}
                  onChange={handleFilterChange}
                >
                  <option value="">Any Aid Type</option>
                  <option>Samurdhi</option>
                  <option>Comfort Allowance</option>
                  <option>Elder</option>
                  <option>Public Assistance</option>
                  <option>Disability</option>
                  <option>Sickness Assistance</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="aa-field">
                <div className="aa-label">People with special needs</div>
                <select
                  className="aa-select"
                  name="special_needs"
                  value={filters.special_needs}
                  onChange={handleFilterChange}
                >
                  <option value="">Any</option>
                  <option value="Yes">Yes</option>
                  <option value="None">No</option>
                </select>
              </div>

              <div className="aa-applyRow">
                <button
                  className="aa-applyBtn"
                  type="button"
                  onClick={fetchResults}
                  disabled={loading}
                >
                  {loading ? "Searching..." : "Apply Filters"}
                </button>
                <button
                  className="aa-applyBtn"
                  type="button"
                  style={{
                    marginLeft: "10px",
                    backgroundColor: "#e2e8f0",
                    color: "#1e293b",
                  }}
                  onClick={() => {
                    setFilters({
                      age_group: "",
                      income_range: "",
                      employment_status: "",
                      household_size: "",
                      aid_type: "",
                      special_needs: "",
                    });
                    setTimeout(
                      () => document.querySelector(".aa-applyBtn").click(),
                      0,
                    );
                  }}
                  disabled={loading}
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Eligible citizens */}
            <div className="aa-right">
              <div className="aa-rightHeader">
                <div className="aa-rightTitle">
                  Eligible citizens ({results.length})
                </div>

                <div className="aa-actions">
                  <button
                    className="aa-iconBtn"
                    type="button"
                    aria-label="download"
                  >
                    <IconDownload />
                  </button>
                  <button
                    className="aa-iconBtn"
                    type="button"
                    aria-label="file"
                  >
                    <IconFile />
                  </button>

                  <button
                    className="aa-csvBtn"
                    type="button"
                    onClick={downloadCSV}
                    disabled={results.length === 0}
                  >
                    <span className="aa-csvIcon">
                      <IconDownload />
                    </span>
                    Download CSV
                  </button>
                  <button
                    className="aa-csvBtn"
                    type="button"
                    onClick={downloadPDF}
                    disabled={results.length === 0}
                    style={{
                      marginLeft: "10px",
                      backgroundColor: "#ef4444",
                      color: "white",
                      border: "none",
                    }}
                  >
                    <span className="aa-csvIcon">
                      <IconFile />
                    </span>
                    Download PDF
                  </button>
                </div>
              </div>

              <div className="aa-card">
                {error && (
                  <div style={{ color: "red", marginBottom: "10px" }}>
                    {error}
                  </div>
                )}
                <div className="aa-tableHead">
                  <div className="aa-th">Member_ID</div>
                  <div className="aa-th">Name</div>
                  <div className="aa-th">
                    NIC
                    <br />
                    NO
                  </div>
                </div>

                {loading && results.length === 0 ? (
                  <div className="aa-row">
                    <div
                      className="aa-td"
                      style={{ gridColumn: "1 / -1", textAlign: "center" }}
                    >
                      Loading data...
                    </div>
                  </div>
                ) : results.length === 0 ? (
                  <div className="aa-row">
                    <div
                      className="aa-td"
                      style={{ gridColumn: "1 / -1", textAlign: "center" }}
                    >
                      No citizens found matching the criteria.
                    </div>
                  </div>
                ) : (
                  results.map((r) => (
                    <div className="aa-row" key={r.id}>
                      <div className="aa-td aa-id">{r.id}</div>
                      <div className="aa-td aa-name">{r.name}</div>
                      <div className="aa-td aa-nic">{r.nic}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AllowancesAids;
