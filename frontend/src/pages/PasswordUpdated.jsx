import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

function CheckIcon() {
  return (
    <svg width="54" height="54" viewBox="0 0 64 64" fill="none">
      {/* outer green ring */}
      <circle cx="32" cy="32" r="24" stroke="#0E7A34" strokeWidth="4" />
      {/* light green fill */}
      <circle cx="32" cy="32" r="22" fill="#DFF7E1" />
      {/* check mark */}
      <path
        d="M24 33.5l5.2 5.2L40 28"
        stroke="#0E7A34"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PasswordUpdated() {
  const nav = useNavigate();

  return (
    <AuthLayout hideHeader>
      <div className="pw-updated-page">
        <div className="pw-updated-card">
          <div className="pw-check">
            <CheckIcon />
          </div>

          <div className="pw-title">Password Updated</div>

          <div className="pw-sub">
            Your login credentials have been successfully reset.
          </div>

          <button
            className="btn-main pw-btn"
            onClick={() => nav("/login")}
            type="button"
          >
            Proceed To Login Now
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}
