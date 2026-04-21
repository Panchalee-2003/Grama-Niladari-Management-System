import { useState, useEffect, useRef } from "react";
import api from "../api/api";
import { clearAuth } from "../auth/auth";
import { useNavigate } from "react-router-dom";
import "../styles/CitizenProfileDropdown.css";

function IconUser() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M4 20a8 8 0 0 1 16 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16 17l5-5-5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 12H9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function CitizenProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = async () => {
    const willOpen = !isOpen;
    setIsOpen(willOpen);

    if (willOpen && !profile) {
      setLoading(true);
      try {
        const res = await api.get("/api/citizen/me/profile");
        if (res.data.ok) {
          setProfile(res.data.profile);
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <div className="cpd-wrapper" ref={dropdownRef}>
      <button className="cpd-btn" onClick={toggleDropdown} aria-label="Profile">
        <IconUser />
      </button>

      {isOpen && (
        <div className="cpd-dropdown">
          <div className="cpd-header">
            <h3>My Profile</h3>
          </div>
          <div className="cpd-body">
            {loading ? (
              <div className="cpd-loading">Loading details...</div>
            ) : profile ? (
              <div className="cpd-info">
                <div className="cpd-field">
                  <span className="cpd-label">Full Name</span>
                  <span className="cpd-value">
                    {profile.full_name || "N/A"}
                  </span>
                </div>
                <div className="cpd-field">
                  <span className="cpd-label">NIC Number</span>
                  <span className="cpd-value">{profile.nic || "N/A"}</span>
                </div>
                <div className="cpd-field">
                  <span className="cpd-label">Phone</span>
                  <span className="cpd-value">{profile.phone || "N/A"}</span>
                </div>
                <div className="cpd-field">
                  <span className="cpd-label">Email</span>
                  <span className="cpd-value">{profile.email || "N/A"}</span>
                </div>
              </div>
            ) : (
              <div className="cpd-empty">
                No profile details found. Please register your household first.
              </div>
            )}
          </div>
          <div className="cpd-footer">
            <button className="cpd-logout-btn" onClick={handleLogout}>
              <IconLogout /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
