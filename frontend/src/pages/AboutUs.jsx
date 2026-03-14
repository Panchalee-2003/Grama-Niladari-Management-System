import { Link, useNavigate } from "react-router-dom";
import "../styles/aboutUs.css";
import { clearAuth } from "../auth/auth";

import emblem from "../assets/emblem.png";
import NotificationDropdown from "../components/NotificationDropdown";
import CitizenProfileDropdown from "../components/CitizenProfileDropdown";

/* Icons - Same as CitizenDashboard */
function IconHome() {
    return (
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
            <path
                d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5Z"
                stroke="#1f1f1f"
                strokeWidth="2"
            />
        </svg>
    );
}

function IconUser() {
    return (
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
            <path
                d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
                stroke="#1f1f1f"
                strokeWidth="2"
            />
            <path
                d="M4 20a8 8 0 0 1 16 0"
                stroke="#1f1f1f"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}

function IconDoc() {
    return (
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
            <path
                d="M7 3h7l3 3v15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
                stroke="#1f1f1f"
                strokeWidth="2"
            />
            <path d="M14 3v4h4" stroke="#1f1f1f" strokeWidth="2" />
        </svg>
    );
}

function IconComplaint() {
    return (
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
            <path
                d="M7 3h10a2 2 0 0 1 2 2v16l-4-2-4 2-4-2-4 2V5a2 2 0 0 1 2-2Z"
                stroke="#1f1f1f"
                strokeWidth="2"
            />
            <path
                d="M8 7h8M8 11h8M8 15h6"
                stroke="#1f1f1f"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}

function IconBell() {
    return (
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
            <path
                d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z"
                stroke="#1f1f1f"
                strokeWidth="2"
            />
            <path
                d="M9.5 19a2.5 2.5 0 0 0 5 0"
                stroke="#1f1f1f"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}

import hero from "../assets/paddy.jpg";
export default function AboutUs() {
    const navigate = useNavigate();

    const services = [
        { id: "01", name: "Grama Niladhari certificate", provider: "GN", providedBy: "Grama Niladhari", maxTime: "03 days" },
        { id: "02", name: "Recommendation letter", provider: "GN", providedBy: "Grama Niladhari", maxTime: "03 days" },
        { id: "03", name: "Issuing Volunteer certificate", provider: "GN", providedBy: "Giving recommendation to Divisional Secretary", maxTime: "02 days" },
        { id: "04", name: "Assessment report", provider: "GN", providedBy: "Giving recommendation to Divisional Secretary", maxTime: "02 days" },
        { id: "05", name: "Certifying documents and applications", provider: "GN", providedBy: "Grama Niladhari", maxTime: "01 day" },
        { id: "06", name: "Cutting jack trees", provider: "GN", providedBy: "To divisional secretary", maxTime: "01 day" },
        { id: "07", name: "Permits for timber transportation", provider: "GN", providedBy: "Giving recommendation to Divisional Secretary", maxTime: "02 days" },
        { id: "08", name: "Issuing permits for felling trees", provider: "GN", providedBy: "Giving recommendation to Divisional Secretary", maxTime: "02 days" },
        { id: "09", name: "Explosives", provider: "GN", providedBy: "Grama Niladhari", maxTime: "02 days" },
        { id: "10", name: "Providing report on death persons", provider: "GN", providedBy: "Report of natural death", maxTime: "03 hours" },
        { id: "11", name: "Issuing permits for vehicles", provider: "GN", providedBy: "Grama Niladhari", maxTime: "01 day" },
        { id: "12", name: "Giving reports of complaints", provider: "GN", providedBy: "Grama Niladhari", maxTime: "07 days" },
        { id: "13", name: "Recommendation for public aids", provider: "GN", providedBy: "Giving recommendation to Divisional Secretary", maxTime: "03 days" },
        { id: "14", name: "Registration of land deeds", provider: "GN", providedBy: "Grama Niladhari", maxTime: "03 days" },
        { id: "15", name: "Providing information for scholarship", provider: "GN", providedBy: "Giving recommendation to Divisional Secretary", maxTime: "03 days" },
        { id: "16", name: "Aids on presidential funds", provider: "GN", providedBy: "Giving recommendation to Divisional Secretary", maxTime: "02 days" }
    ];

    return (
        <div className="au-page">
            {/* TOP HEADER */}
            <header className="au-top">
                <div className="au-brand">
                    <img className="au-emblem" src={emblem} alt="Sri Lanka Emblem" />
                    <div className="au-brand-text">
                        <div className="au-title">Grama Niladhari Division - Maspanna</div>
                        <div className="au-subtitle">Ministry of Home Affairs</div>
                    </div>
                </div>

                <div className="au-top-actions">
                    <Link to="/about" className="au-about-btn">About Us</Link>
                    <NotificationDropdown />
                    <CitizenProfileDropdown />
                </div>
            </header>

            {/* NAV BAR */}
            <nav className="au-nav">
                <Link className="au-nav-item" to="/citizen">
                    <IconHome />
                    <span>Home</span>
                </Link>

                <Link className="au-nav-item" to="/household">
                    <IconUser />
                    <span>Household</span>
                </Link>

                <Link className="au-nav-item" to="/certificates">
                    <IconDoc />
                    <span>Certificates</span>
                </Link>

                <Link className="au-nav-item" to="/complaints">
                    <IconComplaint />
                    <span>Complaints</span>
                </Link>

                <Link className="au-nav-item" to="/notices">
                    <IconBell />
                    <span>Notices</span>
                </Link>
            </nav>

            <div className="au-main">
                {/* HERO WITH VISION & MISSION */}
                <section className="au-hero" style={{ backgroundImage: `url(${hero})` }}>
                    <div className="au-hero-content">
                        <div className="au-vision-card">
                            <h2>Our Vision</h2>
                            <p>To provide efficient and fruitful state service to the customer.</p>
                        </div>

                        <div className="au-mission-card">
                            <h2>Our Mission</h2>
                            <p>
                                To assure an efficient and fruitful state service which fulfill the desires of the people through the government policy and the proper administrative structure and ensure resources coordination.
                            </p>
                        </div>
                    </div>
                </section>

                {/* SERVICES TABLE */}
                <section className="au-services">
                    <table className="au-table">
                        <thead>
                            <tr>
                                <th>Serial Number</th>
                                <th>Service Provided</th>
                                <th>Service Provided by GN</th>
                                <th>Max time / Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map((service) => (
                                <tr key={service.id}>
                                    <td>{service.id}</td>
                                    <td>{service.name}</td>
                                    <td>{service.providedBy}</td>
                                    <td>{service.maxTime}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </div>

            {/* FOOTER */}
            <footer className="au-footer">
                <div className="au-footer-grid">
                    <div>
                        <h4>Contact Information</h4>
                        <p>Grama Niladhari officer, Maspanna</p>
                        <p>Phone: 0768187908</p>
                        <p>Email: chasara88@gmail.com</p>
                    </div>

                    <div>
                        <h4>Office Hours</h4>
                        <p>Tuesday 08:15 to 16:30</p>
                        <p>Thursday 08:15 to 16:30</p>
                        <p>Saturday 08:15 to 12:30</p>
                    </div>

                    <div>
                        <h4>Quick links</h4>
                        <p className="au-footer-link">Citizen Login</p>
                        <p className="au-footer-link">New Registration</p>
                        <p className="au-footer-link">Complaints</p>
                    </div>
                </div>

                <div className="au-footer-line" />

                <div className="au-footer-copy">
                    © 2025 Grama Niladhari Division - Maspanna. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
