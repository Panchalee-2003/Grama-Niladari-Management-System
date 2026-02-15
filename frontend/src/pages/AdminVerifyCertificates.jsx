import { Link, useNavigate } from "react-router-dom";
import "../styles/adminVerifyCertificates.css";
import { clearAuth } from "../auth/auth";

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

    const handleLogout = () => {
        clearAuth();
        navigate("/login");
    };

    // Sample certificate data
    const certificates = [
        {
            id: "CERT-2023-001",
            citizenName: "Aaliyah Sharma",
            certificateType: "Birth Certificate",
            gnVerified: "Yes",
            submissionDate: "2023-08-15",
            status: "Pending",
        },
        {
            id: "CERT-2023-002",
            citizenName: "Ethan Patel",
            certificateType: "Marriage Certificate",
            gnVerified: "No",
            submissionDate: "2023-08-16",
            status: "Pending",
        },
        {
            id: "CERT-2023-003",
            citizenName: "Olivia Singh",
            certificateType: "Death Certificate",
            gnVerified: "Yes",
            submissionDate: "2023-08-17",
            status: "Verified",
        },
        {
            id: "CERT-2023-004",
            citizenName: "Noah Varma",
            certificateType: "Birth Certificate",
            gnVerified: "Yes",
            submissionDate: "2023-08-18",
            status: "Rejected",
        },
        {
            id: "CERT-2023-005",
            citizenName: "Isabella Kapoor",
            certificateType: "Marriage Certificate",
            gnVerified: "No",
            submissionDate: "2023-08-19",
            status: "Pending",
        },
        {
            id: "CERT-2023-006",
            citizenName: "Liam Kumar",
            certificateType: "Death Certificate",
            gnVerified: "Yes",
            submissionDate: "2023-08-20",
            status: "Verified",
        },
    ];

    const getStatusClass = (status) => {
        if (status === "Verified") return "avc-status-verified";
        if (status === "Rejected") return "avc-status-rejected";
        return "avc-status-pending";
    };

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
                            <span>Certificate Type</span>
                            <IconChevronDown />
                        </div>
                        <div className="avc-filter">
                            <span>Status</span>
                            <IconChevronDown />
                        </div>
                        <div className="avc-filter">
                            <span>Date Range</span>
                            <IconChevronDown />
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
                                {certificates.map((cert) => (
                                    <tr key={cert.id}>
                                        <td className="avc-cert-id">{cert.id}</td>
                                        <td className="avc-citizen-name">{cert.citizenName}</td>
                                        <td className="avc-cert-type">{cert.certificateType}</td>
                                        <td className="avc-gn-verified">{cert.gnVerified}</td>
                                        <td className="avc-date">{cert.submissionDate}</td>
                                        <td>
                                            <span className={`avc-status ${getStatusClass(cert.status)}`}>
                                                {cert.status}
                                            </span>
                                        </td>
                                        <td className="avc-actions">
                                            <button className="avc-action-btn">View</button>
                                            <button className="avc-action-btn">Verify</button>
                                            <button className="avc-action-btn">Reject</button>
                                            <button className="avc-action-btn">Download</button>
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
