import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/adminVerifyCertificates.css";
import { clearAuth } from "../auth/auth";
import api from "../api/api";
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

function IconChevronDown() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
                d="M6 9l6 6 6-6"
                stroke="#111"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default function AdminVerifyCertificates() {
    const navigate = useNavigate();
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("All Types");
    const [filterStatus, setFilterStatus] = useState("All Statuses");
    const [filterDateRange, setFilterDateRange] = useState("All Time");

    const CERT_TYPES = [
        "All Types",
        "Residence and character Certificate",
        "Income Certificate",
        "Registration of delayed births",
        "Request for financial assistance from the President's fund for medical treatment",
        "Application for obtaining housing loan funds",
        "Notification of the death of a pensioner",
    ];
    
    const STATUS_OPTIONS = ["All Statuses", "PENDING", "VERIFIED", "REJECTED"];
    const DATE_RANGES = ["All Time", "Today", "This Week", "This Month"];

    const handleLogout = () => {
        clearAuth();
        navigate("/login");
    };

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const res = await api.get("/api/certificate/all");
                if (res.data.ok) {
                    setCertificates(res.data.requests);
                }
            } catch (err) {
                console.error("Failed to fetch certificates", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCertificates();
    }, []);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const res = await api.patch(`/api/certificate/${id}/admin-status`, { admin_status: newStatus });
            if (res.data.ok) {
                setCertificates(prev => prev.map(cert => 
                    cert.request_id === id ? { ...cert, admin_status: newStatus } : cert
                ));
            }
        } catch (err) {
            alert(err.response?.data?.error || "Error updating status");
        }
    };

    const handleDownload = async (id) => {
        try {
            const res = await api.get(`/api/certificate/${id}/pdf`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('link');
            link.href = url;
            link.setAttribute('download', `certificate_${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (err) {
            alert("Error downloading certificate.");
        }
    };

    const getStatusClass = (status) => {
        if (status === "VERIFIED") return "avc-status-verified";
        if (status === "REJECTED") return "avc-status-rejected";
        return "avc-status-pending";
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("en-GB");
    };

    const filteredCertificates = certificates.filter(cert => {
        // Search
        const searchStr = searchQuery.toLowerCase();
        const applicantName = cert.member_name || cert.citizen_name || "";
        const matchesSearch = 
            String(cert.request_id).toLowerCase().includes(searchStr) ||
            applicantName.toLowerCase().includes(searchStr) ||
            (cert.nic_number?.toLowerCase() || "").includes(searchStr);

        // Type
        const matchesType = filterType === "All Types" || cert.cert_type === filterType;

        // Status
        const adminStatus = cert.admin_status || "PENDING";
        const matchesStatus = filterStatus === "All Statuses" || adminStatus === filterStatus;

        // Date
        let matchesDate = true;
        if (filterDateRange !== "All Time" && cert.created_at) {
            const certDate = new Date(cert.created_at);
            const now = new Date();
            if (filterDateRange === "Today") {
                matchesDate = certDate.toDateString() === now.toDateString();
            } else if (filterDateRange === "This Week") {
                // Ensure we don't mutate `now` unnecessarily.
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(now.getDate() - 7);
                matchesDate = certDate >= oneWeekAgo;
            } else if (filterDateRange === "This Month") {
                matchesDate = certDate.getMonth() === now.getMonth() && certDate.getFullYear() === now.getFullYear();
            }
        }

        return matchesSearch && matchesType && matchesStatus && matchesDate;
    });

    return (
        <div className="avc-page">
            {/* LEFT SIDEBAR */}
            <aside className="avc-sidebar">
                <div className="avc-brand">
                    <div className="avc-brand-title">Maspanna Division</div>
                    <div className="avc-brand-sub">Grama Niladhari</div>
                </div>

                <div className="avc-nav">
                    <Link to="/admin-dashboard" className="avc-nav-item">
                        <IconDashboard />
                        <span>Dashboard</span>
                    </Link>

                    <Link to="/admin-verify-certificates" className="avc-nav-item avc-nav-active">
                        <IconDoc />
                        <span>Verify Certificates</span>
                    </Link>
                </div>

                <div className="avc-settings">
                    <Link to="#" className="avc-settings-link">
                        <IconSettings />
                        <span>Settings</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="avc-settings-link"
                        style={{
                            width: "100%",
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            textAlign: "left",
                            padding: "0",
                        }}
                    >
                        <IconLogout />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* RIGHT CONTENT */}
            <section className="avc-content">
                {/* TOP BAR */}
                <header className="avc-topbar">
                    <div className="avc-topbar-title">GN Digital System</div>

                    <div className="avc-search-wrap">
                        <input
                            type="text"
                            className="avc-search-bar"
                            placeholder="Search by Certificate ID or Citizen Name"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="avc-search-icon">
                            <IconSearch />
                        </div>
                    </div>

                    <div className="avc-user-circle" aria-label="profile">
                        <IconUser />
                    </div>
                </header>

                {/* MAIN */}
                <main className="avc-main">
                    <h1 className="avc-title">Analyze Certificates</h1>

                    {/* FILTERS */}
                    <div className="avc-filters">
                        <div className="avc-filter">
                            <select 
                                value={filterType} 
                                onChange={(e) => setFilterType(e.target.value)}
                                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', fontWeight: '600', color: '#111', width: '100%', cursor: 'pointer' }}
                            >
                                {CERT_TYPES.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                        <div className="avc-filter">
                            <select 
                                value={filterStatus} 
                                onChange={(e) => setFilterStatus(e.target.value)}
                                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', fontWeight: '600', color: '#111', width: '100%', cursor: 'pointer' }}
                            >
                                {STATUS_OPTIONS.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>
                        <div className="avc-filter">
                            <select 
                                value={filterDateRange} 
                                onChange={(e) => setFilterDateRange(e.target.value)}
                                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', fontWeight: '600', color: '#111', width: '100%', cursor: 'pointer' }}
                            >
                                {DATE_RANGES.map(range => (
                                    <option key={range} value={range}>{range}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="avc-table-wrap">
                        <table className="avc-table">
                            <thead>
                                <tr>
                                    <th>Certificate ID</th>
                                    <th>Citizen Name</th>
                                    <th>Certificate Type</th>
                                    <th>GN Verified</th>
                                    <th>Submission Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading && (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>Loading...</td>
                                    </tr>
                                )}
                                {!loading && filteredCertificates.length === 0 && (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>No certificates found.</td>
                                    </tr>
                                )}
                                {!loading && filteredCertificates.map((cert) => (
                                    <tr key={cert.request_id}>
                                        <td className="avc-cert-id">{cert.request_id}</td>
                                        <td className="avc-citizen-name">{cert.member_name || cert.citizen_name}</td>
                                        <td className="avc-cert-type">{cert.cert_type}</td>
                                        <td className="avc-gn-verified">
                                            <span style={{color: cert.status === 'APPROVED' ? '#155724' : cert.status === 'REJECTED' ? '#721c24' : '#856404'}}>{cert.status || "PENDING"}</span>
                                        </td>
                                        <td className="avc-date">{formatDate(cert.created_at)}</td>
                                        <td>
                                            <span className={`avc-status ${getStatusClass(cert.admin_status || 'PENDING')}`}>
                                                {cert.admin_status || "PENDING"}
                                            </span>
                                        </td>
                                        <td className="avc-actions">
                                            {(cert.admin_status === "PENDING" || !cert.admin_status) && (
                                                <>
                                                    <button className="avc-action-btn" onClick={() => handleStatusUpdate(cert.request_id, "VERIFIED")}>Verify</button>
                                                    <button className="avc-action-btn" onClick={() => handleStatusUpdate(cert.request_id, "REJECTED")}>Reject</button>
                                                </>
                                            )}
                                            {(cert.admin_status === "VERIFIED" && cert.status === "APPROVED") && (
                                                <button className="avc-action-btn" onClick={() => handleDownload(cert.request_id)}>Download</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </section>
        </div>
    );
}
