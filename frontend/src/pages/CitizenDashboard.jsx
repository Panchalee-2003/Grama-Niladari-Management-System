import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/citizenDashboard.css";
import hero from "../assets/paddy.jpg";
import emblem from "../assets/emblem.png";
import NotificationDropdown from "../components/NotificationDropdown";
import CitizenProfileDropdown from "../components/CitizenProfileDropdown";
import LanguageSwitcher from "../components/LanguageSwitcher";
import Footer from "../components/Footer";

/* Icons */
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
function IconMedal() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 15a5 5 0 1 0-5-5 5 5 0 0 0 5 5Z"
        stroke="#1f1f1f"
        strokeWidth="2"
      />
      <path
        d="M9 14l-2 7 5-2 5 2-2-7"
        stroke="#1f1f1f"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconCalendar() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="4"
        width="18"
        height="18"
        rx="2"
        ry="2"
        stroke="#000000"
        strokeWidth="2"
      />
      <line x1="16" y1="2" x2="16" y2="6" stroke="#000000" strokeWidth="2" />
      <line x1="8" y1="2" x2="8" y2="6" stroke="#000000" strokeWidth="2" />
      <line x1="3" y1="10" x2="21" y2="10" stroke="#000000" strokeWidth="2" />
    </svg>
  );
}

export default function CitizenDashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="cd-page">
      {/* TOP HEADER */}
      <header className="cd-top">
        <div className="cd-brand">
          <img className="cd-emblem" src={emblem} alt="Sri Lanka Emblem" />
          <div className="cd-brand-text">
            <div className="cd-title">{t("dashboard.title")}</div>
            <div className="cd-subtitle">{t("dashboard.subtitle")}</div>
          </div>
        </div>

        <div className="cd-top-actions">
          <LanguageSwitcher />
          <Link to="/about" className="cd-about">
            {t("nav.aboutUs")}
          </Link>
          <NotificationDropdown />
          <CitizenProfileDropdown />
        </div>
      </header>

      {/* NAV BAR */}
      <nav className="cd-nav">
        <Link className="cd-nav-item" to="/citizen">
          <IconHome />
          <span>{t("nav.home")}</span>
        </Link>

        <Link className="cd-nav-item" to="/household">
          <IconUser />
          <span>{t("nav.household")}</span>
        </Link>

        <Link className="cd-nav-item" to="/certificates">
          <IconDoc />
          <span>{t("nav.certificates")}</span>
        </Link>

        <Link className="cd-nav-item" to="/complaints">
          <IconComplaint />
          <span>{t("nav.complaints")}</span>
        </Link>

        <Link className="cd-nav-item" to="/notices">
          <IconBell />
          <span>{t("nav.notices")}</span>
        </Link>
        <Link className="cd-nav-item" to="/availability">
          <IconCalendar />
          <span>{t("nav.gnSchedule")}</span>
        </Link>
      </nav>

      <div className="cd-main">
        {/* HERO */}
        <section
          className="cd-hero"
          style={{ backgroundImage: `url(${hero})` }}
        >
          <div className="cd-hero-overlay">
            <h1>{t("dashboard.heroTitle")}</h1>
            <p>{t("dashboard.heroDesc")}</p>

            {/* Register Now -> Household */}
            <Link to="/household" className="cd-hero-btn">
              {t("dashboard.registerNow")}
            </Link>
          </div>
        </section>

        {/* CARDS */}
        <section className="cd-cards">
          {/* Certificates */}
          <Link to="/certificates" className="cd-card-link">
            <div className="cd-card">
              <div className="cd-card-icon cd-icon-green">
                <IconMedal />
              </div>
              <h3>{t("dashboard.cardCertTitle")}</h3>
              <p>{t("dashboard.cardCertDesc")}</p>
            </div>
          </Link>

          {/* Households */}
          <Link to="/household" className="cd-card-link">
            <div className="cd-card">
              <div className="cd-card-icon cd-icon-yellow">
                <IconUser />
              </div>
              <h3>{t("dashboard.cardCitizenTitle")}</h3>
              <p>{t("dashboard.cardCitizenDesc")}</p>
            </div>
          </Link>

          {/* Notices */}
          <Link to="/notices" className="cd-card-link">
            <div className="cd-card">
              <div className="cd-card-icon cd-icon-blue">
                <IconBell />
              </div>
              <h3>{t("dashboard.cardNoticesTitle")}</h3>
              <p>{t("dashboard.cardNoticesDesc")}</p>
            </div>
          </Link>
        </section>
      </div>

      <Footer />
    </div>
  );
}
