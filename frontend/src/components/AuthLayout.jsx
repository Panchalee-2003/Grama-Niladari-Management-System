import "../styles/auth.css";
import bg from "../assets/bg.jpg";

export default function AuthLayout({
  title,
  subtitle,
  children,
  cardClassName = "",
  hideHeader = false,
}) {
  return (
    <div
      className="auth-bg"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,.25), rgba(0,0,0,.25)), url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className={`auth-card ${title ? "auth-card--register" : "auth-card--login"} ${cardClassName}`}
      >
        {!hideHeader && (
          <div className="auth-header">
            <div className="reg-header-title">
              {title || "GRAMA NILADHARI DIVISION MASPANNA"}
            </div>
            {subtitle && <div className="reg-header-sub">{subtitle}</div>}
          </div>
        )}

        <div className="auth-body">{children}</div>
      </div>
    </div>
  );
}
