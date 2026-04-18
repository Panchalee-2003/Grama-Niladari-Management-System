import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/householdRegistration.css";
import api from "../api/api";
import emblem from "../assets/emblem.png";
import NotificationDropdown from "../components/NotificationDropdown";
import CitizenProfileDropdown from "../components/CitizenProfileDropdown";

// --- Icons ---
function IconHome() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
      <path d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5Z" stroke="#1f1f1f" strokeWidth="2" />
    </svg>
  );
}
function IconUser() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
      <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="#1f1f1f" strokeWidth="2" />
      <path d="M4 20a8 8 0 0 1 16 0" stroke="#1f1f1f" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconDoc() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
      <path d="M7 3h7l3 3v15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" stroke="#1f1f1f" strokeWidth="2" />
      <path d="M14 3v4h4" stroke="#1f1f1f" strokeWidth="2" />
    </svg>
  );
}
function IconComplaint() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
      <path d="M7 3h10a2 2 0 0 1 2 2v16l-4-2-4 2-4-2-4 2V5a2 2 0 0 1 2-2Z" stroke="#1f1f1f" strokeWidth="2" />
      <path d="M8 7h8M8 11h8M8 15h6" stroke="#1f1f1f" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconBell() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z" stroke="#1f1f1f" strokeWidth="2" />
      <path d="M9.5 19a2.5 2.5 0 0 0 5 0" stroke="#1f1f1f" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// --- Success banner shown after submit ---
function SuccessBanner({ householdId }) {
  return (
    <div className="hh-success-wrap">
      <div className="hh-success-card">
        <div className="hh-success-icon">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#16a34a" />
            <path d="M7 12.5l3.5 3.5 6-7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="hh-success-title">Registration Submitted!</h2>
        <p className="hh-success-msg">
          Your household registration has been received and is now{" "}
          <span className="hh-pending-badge">Pending Verification</span> by the
          Grama Niladhari officer.
        </p>
        {householdId && (
          <p className="hh-success-id">Reference ID: <strong>#{householdId}</strong></p>
        )}
        <p className="hh-success-note">
          You will be notified once the GN officer reviews your application.
          Please visit the office if further information is required.
        </p>
        <Link to="/citizen" className="hh-success-home-btn">Back to Home</Link>
      </div>
    </div>
  );
}

const emptyMember = () => ({
  full_name: "",
  relationship: "",
  gender: "",
  religion: "",
  civil_status: "",
  nic: "",
  dob: "",
  education: "",
  employment: "",
  special_needs: "",
});

// ── Status card shown when citizen has already registered ──
function StatusCard({ household, onResubmit, onUpdate }) {
  const STATUS_CONFIG = {
    PENDING: {
      icon: (
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#F59E0B" />
          <path d="M12 7v5l3 3" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: "Pending Verification",
      color: "#B45309",
      bg: "#FEF3C7",
      border: "#F59E0B",
      msg: "Your registration has been received. The Grama Niladhari officer will review it shortly. No further action is needed.",
    },
    VERIFIED: {
      icon: (
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#16A34A" />
          <path d="M7 12.5l3.5 3.5 6-7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: "Registration Approved ✅",
      color: "#15803D",
      bg: "#E9FBF0",
      border: "#16A34A",
      msg: "Your household registration has been verified and approved by the Grama Niladhari officer.",
    },
    REJECTED: {
      icon: (
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#DC2626" />
          <path d="M8 8l8 8M16 8l-8 8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      ),
      title: "Registration Rejected",
      color: "#DC2626",
      bg: "#FFF1F1",
      border: "#DC2626",
      msg: "Your application was reviewed and rejected by the Grama Niladhari officer.",
    },
  };

  const cfg = STATUS_CONFIG[household.status] || STATUS_CONFIG["PENDING"];

  return (
    <div className="hh-success-wrap">
      <div
        className="hh-success-card"
        style={{ borderColor: cfg.border, background: cfg.bg }}
      >
        <div className="hh-success-icon">{cfg.icon}</div>
        <h2 className="hh-success-title" style={{ color: cfg.color }}>
          {cfg.title}
        </h2>

        <div className="hh-status-badge-row">
          <span
            className="hh-status-badge"
            style={{ background: cfg.border, color: "#fff" }}
          >
            {household.status}
          </span>
        </div>

        <p className="hh-success-msg">{cfg.msg}</p>

        {/* Rejection reason box — shown prominently for REJECTED */}
        {household.status === "REJECTED" && household.rejection_reason && (
          <div className="hh-rejection-reason">
            <div className="hh-rejection-reason-title">📋 Reason for Rejection</div>
            <div className="hh-rejection-reason-text">{household.rejection_reason}</div>
          </div>
        )}

        <div className="hh-status-info-box">
          <div className="hh-status-info-row">
            <span className="hh-status-info-label">Reference ID</span>
            <span className="hh-status-info-value">#{household.household_id}</span>
          </div>
          {household.householder_name && (
            <div className="hh-status-info-row">
              <span className="hh-status-info-label">Householder</span>
              <span className="hh-status-info-value">{household.householder_name}</span>
            </div>
          )}
          {household.address && (
            <div className="hh-status-info-row">
              <span className="hh-status-info-label">Address</span>
              <span className="hh-status-info-value">{household.address}</span>
            </div>
          )}
          <div className="hh-status-info-row">
            <span className="hh-status-info-label">Submitted</span>
            <span className="hh-status-info-value">
              {new Date(household.created_at).toLocaleDateString("en-GB", {
                day: "numeric", month: "long", year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Re-submit button for REJECTED applications */}
        {household.status === "REJECTED" && (
          <>
            <p className="hh-status-rejected-note">
              Review the reason above, correct the details, and re-submit your application.
            </p>
            <button
              className="hh-resubmit-btn"
              onClick={() => onResubmit(household.household_id)}
            >
              🔄 Re-submit Application
            </button>
          </>
        )}


        <Link
          to="/citizen"
          className="hh-success-home-btn"
          style={{ background: cfg.border, display: "block", marginTop: 14 }}
        >
          Back to Home
        </Link>

        {/* Update Registration button — shown only for VERIFIED */}
        {household.status === "VERIFIED" && (
          <button
            className="hh-update-reg-btn"
            onClick={() => onUpdate(household)}
          >
            <span className="hh-update-reg-icon">✏️</span>
            Update Registration
          </button>
        )}
      </div>
    </div>
  );
}

export default function HouseholdRegistration() {
  // ── Existing registration check (duplicate prevention) ──
  const [checkingExisting, setCheckingExisting] = useState(true);
  const [existingHousehold, setExistingHousehold] = useState(null);

  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [householdId, setHouseholdId] = useState(null);
  // When re-submitting a rejected application, holds the existing household_id
  const [resubmitHouseholdId, setResubmitHouseholdId] = useState(null);
  // When updating an approved (VERIFIED) application, holds the existing household_id
  const [updateHouseholdId, setUpdateHouseholdId] = useState(null);

  // On mount — check if this citizen already has a registration
  useEffect(() => {
    api.get("/api/household/my")
      .then((res) => {
        if (res.data.ok && res.data.households.length > 0) {
          setExistingHousehold(res.data.households[0]);
        }
      })
      .catch(() => {
        // silently ignore (e.g. token missing — ProtectedRoute handles redirect)
      })
      .finally(() => setCheckingExisting(false));
  }, []);

  // household basic info
  const [house, setHouse] = useState({
    holder_name: "",
    phone: "",
    house_no: "",
    address: "",
    electricity: "",
    water: "",
  });

  // dynamic members
  const [members, setMembers] = useState([emptyMember()]);

  // financial
  const [fin, setFin] = useState({
    income_source: "",
    govt_aid: "",
    income_range: "",
    notes: "",
  });

  // Each entry: { aid_type: string, receivers: string[] }
  const [aidEntries, setAidEntries] = useState([{ aid_type: "", receivers: [] }]);

  // ── Validation error states ──
  const [houseErrors, setHouseErrors] = useState({ phone: "" });
  const [nicErrors, setNicErrors] = useState([""]);


  function updateMember(index, key, value) {
    setMembers((prev) => prev.map((m, i) => (i === index ? { ...m, [key]: value } : m)));
  }

  // ── Validation helpers ──
  function validateNIC(val) {
    const trimmed = val.trim();
    if (trimmed === "") return "";
    const oldFmt = /^\d{9}[VXvx]$/;
    const newFmt = /^\d{12}$/;
    if (!oldFmt.test(trimmed) && !newFmt.test(trimmed)) {
      return "Please enter a valid Sri Lankan NIC number.";
    }
    return "";
  }

  function validatePhone(val) {
    const trimmed = val.trim();
    if (trimmed === "") return "";
    if (!/^0\d{9}$/.test(trimmed)) {
      return "Invalid phone number. Must be 10 digits starting with 0.";
    }
    return "";
  }

  function isMemberComplete(m) {
    return (
      m.full_name.trim() !== "" &&
      m.nic.trim() !== "" &&
      m.dob.trim() !== "" &&
      m.relationship.trim() !== ""
    );
  }

  function addMember() {
    setMembers((prev) => [...prev, emptyMember()]);
    setNicErrors((prev) => [...prev, ""]);
  }

  function removeMember(index) {
    setMembers((prev) => prev.filter((_, i) => i !== index));
    setNicErrors((prev) => prev.filter((_, i) => i !== index));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitError("");

    // ── Role guard: decode JWT to ensure the logged-in user is a CITIZEN ──
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setSubmitError("You are not logged in. Please log in as a citizen to submit.");
        return;
      }
      // JWT is three base64url segments; the middle one is the payload
      const payloadBase64 = token.split(".")[1];
      const payload = JSON.parse(atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/")));
      if (payload?.role !== "CITIZEN") {
        setSubmitError(
          "You are currently logged in as a " +
          (payload?.role || "non-citizen") +
          " account. Please log out and log in as a citizen to submit this form."
        );
        return;
      }
    } catch {
      setSubmitError("Session error. Please log out and log back in as a citizen.");
      return;
    }

    // Basic required-field guard
    if (!house.holder_name.trim() || !house.address.trim()) {
      setSubmitError("Please fill in Householder Name and Address.");
      return;
    }
    if (houseErrors.phone) {
      setSubmitError("Please fix the phone number error before submitting.");
      return;
    }
    const hasNicError = nicErrors.some((err) => err !== "");
    if (hasNicError) {
      setSubmitError("Please fix the NIC errors before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      let newHouseholdId;

      if (updateHouseholdId) {
        // 📝 UPDATE: Update the existing approved (VERIFIED) household
        const hhRes = await api.patch(`/api/household/${updateHouseholdId}/update`, {
          householder_name: house.holder_name.trim(),
          household_no: house.house_no.trim() || null,
          address: house.address.trim(),
          electricity_connection: house.electricity || "No",
          water_supply: house.water || "No",
          phone_number: house.phone.trim() || null,
          income_source: fin.income_source || null,
          govt_aid: fin.govt_aid || null,
          income_range: fin.income_range || null,
          notes: fin.notes.trim() || null,
        });
        if (!hhRes.data.ok) throw new Error(hhRes.data.error || "Failed to update registration");
        newHouseholdId = hhRes.data.household_id;

        // 📝 UPDATE: Also update the aids
        await api.post(`/api/household/${newHouseholdId}/aids`, { aids: aidEntries });
      } else if (resubmitHouseholdId) {
        // ♻️ RE-SUBMIT: Update the existing rejected household
        const hhRes = await api.patch(`/api/household/${resubmitHouseholdId}/resubmit`, {
          householder_name: house.holder_name.trim(),
          household_no: house.house_no.trim() || null,
          address: house.address.trim(),
          electricity_connection: house.electricity || "No",
          water_supply: house.water || "No",
          phone_number: house.phone.trim() || null,
          income_source: fin.income_source || null,
          govt_aid: fin.govt_aid || null,
          income_range: fin.income_range || null,
          notes: fin.notes.trim() || null,
        });
        if (!hhRes.data.ok) throw new Error(hhRes.data.error || "Failed to re-submit");
        newHouseholdId = hhRes.data.household_id;

        // ♻️ RE-SUBMIT: Update the aids
        await api.post(`/api/household/${newHouseholdId}/aids`, { aids: aidEntries });
      } else {
        // 1️⃣ NEW: Create the household
        const hhRes = await api.post("/api/household", {
          householder_name: house.holder_name.trim(),
          household_no: house.house_no.trim() || null,
          address: house.address.trim(),
          electricity_connection: house.electricity || "No",
          water_supply: house.water || "No",
          phone_number: house.phone.trim() || null,
          income_source: fin.income_source || null,
          govt_aid: fin.govt_aid || null,
          income_range: fin.income_range || null,
          notes: fin.notes.trim() || null,
        });
        if (!hhRes.data.ok) throw new Error(hhRes.data.error || "Failed to create household");
        newHouseholdId = hhRes.data.household_id;

        // 2️⃣ Create each family member (only on new submission)
        for (const m of members) {
          if (!m.full_name.trim()) continue;
          await api.post("/api/family", {
            household_id: newHouseholdId,
            full_name: m.full_name.trim(),
            nic_number: m.nic.trim() || null,
            dob: m.dob || null,
            gender: m.gender || null,
            relationship_to_head: m.relationship || null,
            civil_status: m.civil_status || null,
            education_level: m.education || null,
            employment_status: m.employment || null,
            religion: m.religion || null,
            special_needs: m.special_needs || null,
          });
        }
      }

      // 3️⃣ NEW: Save Aid entries for new household
      if (!resubmitHouseholdId && !updateHouseholdId) {
        await api.post(`/api/household/${newHouseholdId}/aids`, { aids: aidEntries });
      }

      // Show success state
      setHouseholdId(newHouseholdId);
      setSubmitted(true);
    } catch (err) {
      let msg =
        err?.response?.data?.error ||
        err?.message ||
        "Something went wrong. Please try again.";
      // Translate raw server "Forbidden" into a helpful message
      if (msg === "Forbidden" || msg === "Cannot resubmit this application" || msg === "Cannot update this application") {
        msg = "Access denied. Please make sure you are logged in as a citizen and the application is in the correct status.";
      }
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  function onReset() {
    window.location.reload();
  }

  function addAidEntry() {
    setAidEntries((prev) => [...prev, { aid_type: "", receivers: [] }]);
  }

  function removeAidEntry(index) {
    setAidEntries((prev) => prev.filter((_, i) => i !== index));
  }

  function updateAidType(index, value) {
    setAidEntries((prev) =>
      prev.map((e, i) => (i === index ? { ...e, aid_type: value } : e))
    );
  }

  function toggleReceiver(index, memberName) {
    setAidEntries((prev) =>
      prev.map((e, i) => {
        if (i !== index) return e;
        const already = e.receivers.includes(memberName);
        return {
          ...e,
          receivers: already
            ? e.receivers.filter((n) => n !== memberName)
            : [...e.receivers, memberName],
        };
      })
    );
  }

  // ── Shared page shell (header + nav) for status views ──
  const pageShell = (content) => (
    <div className="hh-page">
      <header className="cd-top">
        <div className="cd-top-left">
          <img className="cd-emblem" src={emblem} alt="Emblem" />
          <div className="cd-top-text">
            <div className="cd-title">Grama Niladhari Division - Maspanna</div>
            <div className="cd-subtitle">Ministry of Home Affairs</div>
          </div>
        </div>
        <div className="cd-top-right" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link to="/about" className="cd-about-btn">About Us</Link>
          <NotificationDropdown />
          <CitizenProfileDropdown />
        </div>
      </header>
      <nav className="cd-nav">
        <Link className="cd-nav-item" to="/citizen"><IconHome /><span>Home</span></Link>
        <Link className="cd-nav-item cd-active" to="/household"><IconUser /><span>Household</span></Link>
        <Link className="cd-nav-item" to="/certificates"><IconDoc /><span>Certificates</span></Link>
        <Link className="cd-nav-item" to="/complaints"><IconComplaint /><span>Complaints</span></Link>
        <Link className="cd-nav-item" to="/notices"><IconBell /><span>Notices</span></Link>
      </nav>
      {content}
    </div>
  );

  // 1️⃣ Loading while we check for existing registration
  if (checkingExisting) {
    return pageShell(
      <div className="hh-loading-wrap">
        <span className="hh-spinner hh-spinner-lg" />
        <p className="hh-loading-txt">Checking registration status…</p>
      </div>
    );
  }

  // 2️⃣ Citizen already has a registration — show status card
  if (existingHousehold) {
    return pageShell(
      <StatusCard
        household={existingHousehold}
        onResubmit={(hhId) => {
          setResubmitHouseholdId(hhId);
          setExistingHousehold(null); // clear to show form
        }}
        onUpdate={(hhData) => {
          // Pre-fill all form fields from the approved registration
          setUpdateHouseholdId(hhData.household_id);
          setHouse({
            holder_name: hhData.householder_name || "",
            phone: hhData.phone_number || "",
            house_no: hhData.household_no || "",
            address: hhData.address || "",
            electricity: hhData.electricity_connection || "",
            water: hhData.water_supply || "",
          });
          setFin({
            income_source: hhData.income_source || "",
            govt_aid: hhData.govt_aid || "",
            income_range: hhData.income_range || "",
            notes: hhData.notes || "",
          });
          setExistingHousehold(null); // clear to show form
        }}
      />
    );
  }

  // 3️⃣ Show success banner when submitted
  if (submitted) {
    return (
      <div className="hh-page">
        {/* TOP HEADER */}
        <header className="cd-top">
          <div className="cd-top-left">
            <img className="cd-emblem" src={emblem} alt="Emblem" />
            <div className="cd-top-text">
              <div className="cd-title">Grama Niladhari Division - Maspanna</div>
              <div className="cd-subtitle">Ministry of Home Affairs</div>
            </div>
          </div>
          <div className="cd-top-right" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Link to="/about" className="cd-about-btn">About Us</Link>
            <NotificationDropdown />
            <CitizenProfileDropdown />
          </div>
        </header>

        <nav className="cd-nav">
          <Link className="cd-nav-item" to="/citizen"><IconHome /><span>Home</span></Link>
          <Link className="cd-nav-item cd-active" to="/household"><IconUser /><span>Household</span></Link>
          <Link className="cd-nav-item" to="/certificates"><IconDoc /><span>Certificates</span></Link>
          <Link className="cd-nav-item" to="/complaints"><IconComplaint /><span>Complaints</span></Link>
          <Link className="cd-nav-item" to="/notices"><IconBell /><span>Notices</span></Link>
        </nav>

        <SuccessBanner householdId={householdId} />
      </div>
    );
  }

  return (
    <div className="hh-page">
      {/* TOP HEADER */}
      <header className="cd-top">
        <div className="cd-top-left">
          <img className="cd-emblem" src={emblem} alt="Emblem" />
          <div className="cd-top-text">
            <div className="cd-title">Grama Niladhari Division - Maspanna</div>
            <div className="cd-subtitle">Ministry of Home Affairs</div>
          </div>
        </div>

        <div className="cd-top-right" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link to="/about" className="cd-about-btn">About Us</Link>
          <NotificationDropdown />
          <CitizenProfileDropdown />
        </div>
      </header>

      {/* NAV BAR */}
      <nav className="cd-nav">
        <Link className="cd-nav-item" to="/citizen"><IconHome /><span>Home</span></Link>
        <Link className="cd-nav-item cd-active" to="/household"><IconUser /><span>Household</span></Link>
        <Link className="cd-nav-item" to="/certificates"><IconDoc /><span>Certificates</span></Link>
        <Link className="cd-nav-item" to="/complaints"><IconComplaint /><span>Complaints</span></Link>
        <Link className="cd-nav-item" to="/notices"><IconBell /><span>Notices</span></Link>
      </nav>

      <main className="hh-main">
        <h1 className="hh-page-title">
          {updateHouseholdId ? "Update Household Registration" : "Household Registration"}
        </h1>

        {/* Update mode info banner */}
        {updateHouseholdId && (
          <div className="hh-update-banner">
            <span className="hh-update-banner-icon">📋</span>
            <div>
              <strong>Updating Approved Registration</strong>
              <p>Your previous details have been pre-filled. Edit the fields you wish to change and resubmit. The Grama Niladhari officer will re-review your updated registration.</p>
            </div>
          </div>
        )}

        <form className="hh-form" onSubmit={onSubmit}>
          {/* SECTION 1 */}
          <section className="hh-box">
            <h2 className="hh-box-title">Household basic Information</h2>

            <div className="hh-field">
              <label className="hh-label">Householder's Full Name</label>
              <input
                className="hh-input hh-input-lg"
                value={house.holder_name}
                onChange={(e) => setHouse({ ...house, holder_name: e.target.value })}
              />
            </div>

            <div className="hh-grid-3">
              <div className="hh-field">
                <label className="hh-label">Phone Number</label>
                <input
                  className="hh-input"
                  value={house.phone}
                  placeholder="0771234567"
                  style={houseErrors.phone ? { borderColor: "#DC2626" } : {}}
                  onChange={(e) => {
                    const val = e.target.value;
                    setHouse({ ...house, phone: val });
                    setHouseErrors((prev) => ({ ...prev, phone: validatePhone(val) }));
                  }}
                  onBlur={() =>
                    setHouseErrors((prev) => ({ ...prev, phone: validatePhone(house.phone) }))
                  }
                />
                {houseErrors.phone && (
                  <span className="hh-err-msg">{houseErrors.phone}</span>
                )}
              </div>

              <div className="hh-field">
                <label className="hh-label">House No</label>
                <input
                  className="hh-input"
                  value={house.house_no}
                  onChange={(e) => setHouse({ ...house, house_no: e.target.value })}
                />
              </div>

              <div className="hh-field">
                <label className="hh-label">No of Family Members</label>
                <div className="hh-mini-btns">
                  <div className="hh-count-chip">
                    <span className="hh-count-lbl">Male</span>
                    <span className="hh-count-val">
                      {members.filter((m) => m.gender === "Male").length}
                    </span>
                  </div>
                  <div className="hh-count-chip">
                    <span className="hh-count-lbl">Female</span>
                    <span className="hh-count-val">
                      {members.filter((m) => m.gender === "Female").length}
                    </span>
                  </div>
                  <div className="hh-count-chip hh-count-total">
                    <span className="hh-count-lbl">Total</span>
                    <span className="hh-count-val">{members.length}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="hh-field">
              <label className="hh-label">Address</label>
              <input
                className="hh-input hh-input-lg"
                value={house.address}
                onChange={(e) => setHouse({ ...house, address: e.target.value })}
              />
            </div>

            <div className="hh-grid-2 hh-grid-tight">
              <div className="hh-field hh-dd">
                <label className="hh-label">Electricity Connection</label>
                <select
                  className="hh-select"
                  value={house.electricity}
                  onChange={(e) => setHouse({ ...house, electricity: e.target.value })}
                >
                  <option value=""></option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>

              <div className="hh-field hh-dd">
                <label className="hh-label">Water supply</label>
                <select
                  className="hh-select"
                  value={house.water}
                  onChange={(e) => setHouse({ ...house, water: e.target.value })}
                >
                  <option value=""></option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
            </div>
          </section>

          {/* SECTION 2 — Dynamic Members */}
          <section className="hh-box">
            <h2 className="hh-box-title">Family member details</h2>

            {members.map((m, idx) => (
              <div key={idx} className="hh-member-card">
                {/* Card header: label + remove button */}
                <div className="hh-member-header">
                  <span className="hh-member-label">
                    Member {String(idx + 1).padStart(2, "0")}
                    {idx === 0 && (
                      <span className="hh-member-primary-badge">Primary Householder</span>
                    )}
                  </span>
                  {idx > 0 && (
                    <button
                      type="button"
                      className="hh-remove-btn"
                      onClick={() => removeMember(idx)}
                    >
                      ✕ Remove Member
                    </button>
                  )}
                </div>

                {/* Full Name */}
                <div className="hh-field">
                  <label className="hh-label">
                    Full Name <span className="hh-required">*</span>
                  </label>
                  <input
                    className="hh-input hh-input-lg"
                    value={m.full_name}
                    placeholder="Enter full name"
                    onChange={(e) => updateMember(idx, "full_name", e.target.value)}
                  />
                </div>

                {/* Row 1: Relationship | Gender | Religion */}
                <div className="hh-grid-3">
                  <div className="hh-field">
                    <label className="hh-label">
                      Relationship To Head <span className="hh-required">*</span>
                    </label>
                    <select
                      className="hh-select"
                      value={m.relationship}
                      onChange={(e) => updateMember(idx, "relationship", e.target.value)}
                    >
                      <option value=""></option>
                      <option>Head</option>
                      <option>Spouse</option>
                      <option>Child</option>
                      <option>Parent</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="hh-field">
                    <label className="hh-label">Gender</label>
                    <select
                      className="hh-select"
                      value={m.gender}
                      onChange={(e) => updateMember(idx, "gender", e.target.value)}
                    >
                      <option value=""></option>
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  </div>

                  <div className="hh-field">
                    <label className="hh-label">Religion</label>
                    <select
                      className="hh-select"
                      value={m.religion}
                      onChange={(e) => updateMember(idx, "religion", e.target.value)}
                    >
                      <option value=""></option>
                      <option>Buddhist</option>
                      <option>Hindu</option>
                      <option>Islam</option>
                      <option>Christian</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                {/* Row 2: Civil Status | NIC | DOB */}
                <div className="hh-grid-3">
                  <div className="hh-field">
                    <label className="hh-label">Civil Status</label>
                    <select
                      className="hh-select"
                      value={m.civil_status}
                      onChange={(e) => updateMember(idx, "civil_status", e.target.value)}
                    >
                      <option value=""></option>
                      <option>Single</option>
                      <option>Married</option>
                      <option>Divorced</option>
                      <option>Widowed</option>
                    </select>
                  </div>

                  <div className="hh-field">
                    <label className="hh-label">
                      NIC Number <span className="hh-required">*</span>
                    </label>
                    <input
                      className="hh-input"
                      value={m.nic}
                      placeholder="000000000V or 199012345678"
                      style={nicErrors[idx] ? { borderColor: "#DC2626" } : {}}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateMember(idx, "nic", val);
                        setNicErrors((prev) =>
                          prev.map((err, i) => (i === idx ? validateNIC(val) : err))
                        );
                      }}
                      onBlur={() =>
                        setNicErrors((prev) =>
                          prev.map((err, i) => (i === idx ? validateNIC(m.nic) : err))
                        )
                      }
                    />
                    {nicErrors[idx] && (
                      <span className="hh-err-msg">{nicErrors[idx]}</span>
                    )}
                  </div>

                  <div className="hh-field">
                    <label className="hh-label">
                      Date of Birth <span className="hh-required">*</span>
                    </label>
                    <input
                      className="hh-input"
                      type="date"
                      value={m.dob}
                      onChange={(e) => updateMember(idx, "dob", e.target.value)}
                    />
                  </div>
                </div>

                {/* Row 3: Education | Employment | Special Needs */}
                <div className="hh-grid-3">
                  <div className="hh-field">
                    <label className="hh-label">Education Level</label>
                    <select
                      className="hh-select"
                      value={m.education}
                      onChange={(e) => updateMember(idx, "education", e.target.value)}
                    >
                      <option value=""></option>
                      <option>Primary</option>
                      <option>O/L</option>
                      <option>A/L</option>
                      <option>Diploma</option>
                      <option>Degree</option>
                    </select>
                  </div>

                  <div className="hh-field">
                    <label className="hh-label">Employment status</label>
                    <select
                      className="hh-select"
                      value={m.employment}
                      onChange={(e) => updateMember(idx, "employment", e.target.value)}
                    >
                      <option value=""></option>
                      <option>Employed</option>
                      <option>Unemployed</option>
                      <option>Student</option>
                      <option>Retired</option>
                    </select>
                  </div>

                  <div className="hh-field">
                    <label className="hh-label">Special Needs or Disability</label>
                    <select
                      className="hh-select"
                      value={m.special_needs}
                      onChange={(e) => updateMember(idx, "special_needs", e.target.value)}
                    >
                      <option value=""></option>
                      <option>None</option>
                      <option>Yes</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}

            {/* ── Add Member row – below all cards ── */}
            <div className="hh-add-member-row">
              <button
                type="button"
                className="hh-add-member-btn"
                disabled={
                  !isMemberComplete(members[members.length - 1]) ||
                  !!nicErrors[members.length - 1]
                }
                onClick={addMember}
              >
                + Add Member
              </button>
              {(!isMemberComplete(members[members.length - 1]) ||
                !!nicErrors[members.length - 1]) && (
                  <span className="hh-add-hint">
                    {nicErrors[members.length - 1]
                      ? "Fix the NIC error before adding another member"
                      : "Fill required fields (*) on the current member to add another"}
                  </span>
                )}
            </div>
          </section>

          {/* SECTION 3 */}
          <section className="hh-box">
            <h2 className="hh-box-title">Financial and Aid Eligibility Information</h2>

            <div className="hh-fin-grid">
              <div className="hh-field">
                <label className="hh-label">Primary Income Source</label>
                <select
                  className="hh-select"
                  value={fin.income_source}
                  onChange={(e) => setFin({ ...fin, income_source: e.target.value })}
                >
                  <option value=""></option>
                  <option>Agriculture</option>
                  <option>Business</option>
                  <option>Government</option>
                  <option>Private</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="hh-field">
                <label className="hh-label">Receiving Government Aid</label>
                <select
                  className="hh-select"
                  value={fin.govt_aid}
                  onChange={(e) => setFin({ ...fin, govt_aid: e.target.value })}
                >
                  <option value=""></option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>

              <div className="hh-field hh-notes">
                <label className="hh-label">Additional Notes</label>
                <textarea
                  className="hh-textarea"
                  value={fin.notes}
                  onChange={(e) => setFin({ ...fin, notes: e.target.value })}
                />
              </div>

              <div className="hh-field">
                <label className="hh-label">Monthly Income Range</label>
                <select
                  className="hh-select"
                  value={fin.income_range}
                  onChange={(e) => setFin({ ...fin, income_range: e.target.value })}
                >
                  <option value=""></option>
                  <option>&lt; 25,000</option>
                  <option>25,000 - 50,000</option>
                  <option>50,000 - 100,000</option>
                  <option>&gt; 100,000</option>
                </select>
              </div>
            </div>

            {/* ── Aid entries panel — only when Govt Aid = Yes ── */}
            {fin.govt_aid === "Yes" && (
              <div className="hh-aid-section">
                {aidEntries.map((entry, idx) => (
                  <div key={idx} className="hh-aid-entry">
                    <div className="hh-aid-entry-header">
                      <span className="hh-aid-entry-num">Aid #{idx + 1}</span>
                      {aidEntries.length > 1 && (
                        <button
                          type="button"
                          className="hh-aid-remove"
                          onClick={() => removeAidEntry(idx)}
                        >
                          ✕ Remove
                        </button>
                      )}
                    </div>

                    <div className="hh-field">
                      <label className="hh-label">Aid / Benefit Type</label>
                      <select
                        className="hh-select hh-aid-select"
                        value={entry.aid_type}
                        onChange={(e) => updateAidType(idx, e.target.value)}
                      >
                        <option value=""></option>
                        <option>Samurdhi</option>
                        <option>Comfort Allowance</option>
                        <option>Elder</option>
                        <option>Public Assistance</option>
                        <option>Disability</option>
                        <option>Sickness Assistance</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div className="hh-field">
                      <label className="hh-label">Receiver(s) / Beneficiary(ies)</label>
                      <div className="hh-receiver-grid">
                        {members.map((m, mi) => {
                          const name =
                            m.full_name.trim() ||
                            `Member ${String(mi + 1).padStart(2, "0")}`;
                          const checked = entry.receivers.includes(name);
                          return (
                            <label key={mi} className="hh-receiver-item">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleReceiver(idx, name)}
                              />
                              <span>{name}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="hh-aid-add"
                  onClick={addAidEntry}
                >
                  + Add Another Aid Type
                </button>
              </div>
            )}
          </section>

          {/* DECLARATION */}
          <div className="hh-declare">
            <p className="hh-declare-text">
              I hereby declare that the above information is true and accurate to the best of my knowledge.
            </p>

            <label className="hh-check">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              <span>I agree and confirm the provided details are accurate.</span>
            </label>
          </div>

          {/* Inline error message */}
          {submitError && (
            <div className="hh-submit-error">
              ⚠️ {submitError}
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="hh-actions">
            <button type="button" className="hh-btn hh-btn-reset" onClick={onReset} disabled={submitting}>
              Reset
            </button>
            <button
              type="submit"
              className="hh-btn hh-btn-submit"
              disabled={!agree || submitting}
            >
              {submitting ? (
                <span className="hh-spinner-wrap">
                  <span className="hh-spinner" />
                  {updateHouseholdId ? "Updating…" : "Submitting…"}
                </span>
              ) : (
                updateHouseholdId ? "Update Registration" : "Submit"
              )}
            </button>
          </div>
        </form>
      </main>

      {/* FOOTER */}
      <footer className="cd-footer">
        <div className="cd-footer-grid">
          <div>
            <div className="cd-footer-title">Contact Information</div>
            <div className="cd-footer-text">Grama Niladhari officer, Maspanna</div>
            <div className="cd-footer-text">Phone: 0768187908</div>
            <div className="cd-footer-text">Email: chasara88@gmail.com</div>
          </div>

          <div>
            <div className="cd-footer-title">Office Hours</div>
            <div className="cd-footer-text">Tuesday 08:15 to 16:30</div>
            <div className="cd-footer-text">Thursday 08:15 to 16:30</div>
            <div className="cd-footer-text">Saturday 08:15 to 12:30</div>
          </div>

          <div>
            <div className="cd-footer-title">Quick links</div>
            <div className="cd-footer-text">Citizen Login</div>
            <div className="cd-footer-text">New Registration</div>
            <div className="cd-footer-text">Complaints</div>
          </div>
        </div>

        <div className="cd-footer-bottom">
          © 2025 Grama Niladhari Division - Maspanna. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
