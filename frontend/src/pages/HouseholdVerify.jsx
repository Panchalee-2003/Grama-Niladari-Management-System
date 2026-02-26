import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/householdVerify.css";
import api from "../api/api";

/* ========== ICONS (same style) ========== */
function IconDashboard() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 13h7V4H4v9Zm9 7h7V11h-7v9ZM4 20h7v-5H4v5Zm9-11h7V4h-7v5Z"
        stroke="#0b2b16"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconPeople() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M16 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3Z" stroke="#0b2b16" strokeWidth="2" />
      <path d="M6 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3Z" stroke="#0b2b16" strokeWidth="2" />
      <path
        d="M6 13c-2.2 0-4 1.3-4 3v2h8v-2c0-1.7-1.8-3-4-3Z"
        stroke="#0b2b16"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M16 13c-2.2 0-4 1.3-4 3v2h10v-2c0-1.7-1.8-3-4-3Z"
        stroke="#0b2b16"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconDoc() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M7 3h7l3 3v15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" stroke="#0b2b16" strokeWidth="2" />
      <path d="M14 3v4h4" stroke="#0b2b16" strokeWidth="2" />
    </svg>
  );
}

function IconFlag() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M5 3v18" stroke="#0b2b16" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M5 4h12l-2 4 2 4H5"
        stroke="#0b2b16"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconBell() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z" stroke="#0b2b16" strokeWidth="2" />
      <path d="M9.5 19a2.5 2.5 0 0 0 5 0" stroke="#0b2b16" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconCoins() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M21 7c0 2.2-4 4-9 4S3 9.2 3 7s4-4 9-4 9 1.8 9 4Z" stroke="#0b2b16" strokeWidth="2" />
      <path d="M21 12c0 2.2-4 4-9 4s-9-1.8-9-4" stroke="#0b2b16" strokeWidth="2" />
      <path d="M21 17c0 2.2-4 4-9 4s-9-1.8-9-4" stroke="#0b2b16" strokeWidth="2" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z" stroke="#111" strokeWidth="2" />
      <path d="M16.5 16.5 21 21" stroke="#111" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconUserCircle() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="#fff" strokeWidth="2" />
      <path d="M4 20a8 8 0 0 1 16 0" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconGear() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
        stroke="#0b2b16"
        strokeWidth="2"
      />
      <path
        d="M19.4 15a7.9 7.9 0 0 0 .1-2l2-1.2-2-3.5-2.2.7a7.2 7.2 0 0 0-1.7-1L15 5h-6l-.6 2.9a7.2 7.2 0 0 0-1.7 1L4.5 8.3l-2 3.5 2 1.2a7.9 7.9 0 0 0 .1 2l-2 1.2 2 3.5 2.2-.7a7.2 7.2 0 0 0 1.7 1L9 23h6l.6-2.9a7.2 7.2 0 0 0 1.7-1l2.2.7 2-3.5-2-1.2Z"
        stroke="#0b2b16"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M15 18 9 12l6-6" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M9 18l6-6-6-6" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const PAGE_SIZE = 10;

const FILTERS = ["All", "Pending", "Verified", "Rejected"];

function statusLabel(s) {
  if (s === "PENDING") return "Pending";
  if (s === "VERIFIED") return "Verified";
  if (s === "REJECTED") return "Rejected";
  return s;
}

export default function HouseholdVerify() {
  const navigate = useNavigate();
  const [households, setHouseholds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Fetch all households on mount
  useEffect(() => {
    fetchHouseholds();
  }, []);

  async function fetchHouseholds() {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/household/all");
      if (res.data.ok) {
        setHouseholds(res.data.households);
      } else {
        setError(res.data.error || "Failed to load households");
      }
    } catch (err) {
      setError(err?.response?.data?.error || "Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  // Derived: pending count for sidebar badge
  const pendingCount = households.filter((h) => h.status === "PENDING").length;

  // Apply filter + search
  const filtered = households.filter((h) => {
    const matchesFilter =
      activeFilter === "All" ||
      h.status === activeFilter.toUpperCase();
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      h.householder_name?.toLowerCase().includes(q) ||
      String(h.household_id).includes(q) ||
      h.address?.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function handleFilterClick(f) {
    setActiveFilter(f);
    setPage(1);
  }

  function handleSearchChange(e) {
    setSearch(e.target.value);
    setPage(1);
  }

  function viewDetail(householdId) {
    navigate("/gn-households/detail", { state: { household_id: householdId } });
  }

  return (
    <div className="hv-wrap">
      {/* SIDEBAR */}
      <aside className="hv-sidebar">
        <div className="hv-side-title">
          <div className="hv-side-main">Maspanna Division</div>
          <div className="hv-side-sub">Grama Niladhari</div>
        </div>

        <nav className="hv-menu">
          <Link className="hv-item" to="/gn">
            <span className="hv-ico"><IconDashboard /></span>
            <span>Dashboard</span>
          </Link>

          <Link className="hv-item hv-item-active" to="/gn-households">
            <span className="hv-ico"><IconPeople /></span>
            <span>Households</span>
            {pendingCount > 0 && (
              <span className="hv-badge">{pendingCount}</span>
            )}
          </Link>

          <Link className="hv-item" to="/gn-certificates">
            <span className="hv-ico"><IconDoc /></span>
            <span>Certificates</span>
          </Link>

          <Link className="hv-item" to="/gn-complaints">
            <span className="hv-ico"><IconFlag /></span>
            <span>Complaints</span>
          </Link>

          <Link className="hv-item" to="/gn-notices">
            <span className="hv-ico"><IconBell /></span>
            <span>Notices</span>
          </Link>

          <Link className="hv-item" to="/gn-allowances">
            <span className="hv-ico"><IconCoins /></span>
            <span>Allowances &amp; Aids</span>
          </Link>
        </nav>

        <div className="hv-settings">
          <Link className="hv-settings-btn" to="/gn-settings" aria-label="settings">
            <IconGear />
            <span>Settings</span>
          </Link>
        </div>
      </aside>

      {/* MAIN */}
      <section className="hv-main">
        {/* TOP BAR */}
        <header className="hv-topbar">
          <div className="hv-top-title">GN Digital System</div>

          <div className="hv-top-search">
            <input
              className="hv-top-search-input"
              placeholder="Search by name, address, or ID…"
              value={search}
              onChange={handleSearchChange}
            />
          </div>

          <div className="hv-top-icons">
            <div className="hv-top-search-ico" aria-label="search">
              <IconSearch />
            </div>
            <div className="hv-profile" aria-label="profile">
              <IconUserCircle />
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="hv-content">
          <h1 className="hv-h1">Household Registrations</h1>
          <div className="hv-sub">
            Manage and process household registrations within your division
          </div>

          {/* BIG SEARCH */}
          <div className="hv-big-search">
            <span className="hv-big-search-ico">
              <IconSearch />
            </span>
            <input
              className="hv-big-search-input"
              placeholder="Search by Household ID or Householder's Name"
              value={search}
              onChange={handleSearchChange}
            />
          </div>

          {/* FILTER CHIPS */}
          <div className="hv-chips">
            {FILTERS.map((f) => (
              <div
                key={f}
                className={`hv-chip ${activeFilter === f ? "hv-chip-active" : ""}`}
                onClick={() => handleFilterClick(f)}
                style={{ cursor: "pointer" }}
              >
                {f}
                {f === "Pending" && pendingCount > 0 && (
                  <span className="hv-chip-count"> ({pendingCount})</span>
                )}
              </div>
            ))}
          </div>

          {/* SORT / Count row */}
          <div className="hv-sort">
            <div className="hv-sort-box">
              <div className="hv-sort-text">
                {filtered.length} record{filtered.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>

          {/* LIST */}
          <div className="hv-list">
            {loading && (
              <div className="hv-state-msg">Loading households…</div>
            )}
            {!loading && error && (
              <div className="hv-state-msg hv-state-error">{error}</div>
            )}
            {!loading && !error && paginated.length === 0 && (
              <div className="hv-state-msg">
                No households found{activeFilter !== "All" ? ` with status "${activeFilter}"` : ""}.
              </div>
            )}

            {!loading && !error && paginated.map((h) => (
              <div key={h.household_id} className="hv-row">
                <p className={`hv-status ${h.status.toLowerCase()}`}>
                  Status: {statusLabel(h.status)}
                </p>
                <div className="hv-id">Household ID: {h.household_id}</div>
                <div className="hv-meta">Householder: {h.householder_name}</div>
                <div className="hv-meta">Address: {h.address}</div>
                <div className="hv-meta hv-meta-small">
                  Members: {h.member_count} &nbsp;|&nbsp;
                  Submitted: {new Date(h.created_at).toLocaleDateString("en-GB")}
                </div>
                <button className="hv-view" onClick={() => viewDetail(h.household_id)}>
                  View Details
                </button>
                <div className="hv-divider" />
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          <div className="hv-pagination">
            <button
              className="hv-page-btn"
              aria-label="prev"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <IconChevronLeft />
            </button>
            <span className="hv-page-info">{safePage} / {totalPages}</span>
            <button
              className="hv-page-btn"
              aria-label="next"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <IconChevronRight />
            </button>
          </div>
        </main>
      </section>
    </div>
  );
}
