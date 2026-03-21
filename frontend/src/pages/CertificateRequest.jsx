import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/certificateRequest.css";
import emblem from "../assets/emblem.png";
import NotificationDropdown from "../components/NotificationDropdown";
import CitizenProfileDropdown from "../components/CitizenProfileDropdown";
import api from "../api/api";

const CERT_TYPES = [
  "Residence and character Certificate",
  "Income Certificate",
  "Registration of delayed births",
  "Request for financial assistance from the President's fund for medical treatment",
  "Application for obtaining housing loan funds",
  "Notification of the death of a pensioner",
  "Registration of voluntary organizations",
];

const CERT_PDF_MAP = {
  "Residence and character Certificate": "/certificates/residence_and_character.pdf",
  "Income Certificate": "/certificates/income_certificate.pdf",
  "Registration of delayed births": "/certificates/delayed_births.pdf",
  "Request for financial assistance from the President's fund for medical treatment": "/certificates/medical_assistance.pdf",
  "Application for obtaining housing loan funds": "/certificates/housing_loan.pdf",
  "Notification of the death of a pensioner": "/certificates/death_of_pensioner.pdf",
  "Registration of voluntary organizations": "/certificates/voluntary_organizations.pdf",
};

const STATUS_MAP = {
  PENDING: { label: "Pending Review", cls: "cr-badge cr-badge-pending" },
  SUBMITTED: { label: "Submitted", cls: "cr-badge cr-badge-pending" },
  UNDER_REVIEW_GN: { label: "Under Review", cls: "cr-badge cr-badge-review" },
  PENDING_DS_APPROVAL: { label: "Awaiting DS", cls: "cr-badge cr-badge-ds" },
  VISIT_REQUIRED: { label: "Visit Required", cls: "cr-badge cr-badge-visit" },
  APPROVED: { label: "Approved", cls: "cr-badge cr-badge-approved" },
  ISSUED: { label: "Issued", cls: "cr-badge cr-badge-approved" },
  REJECTED: { label: "Rejected", cls: "cr-badge cr-badge-rejected" },
};

function statusBadge(s) {
  return STATUS_MAP[s] || { label: s, cls: "cr-badge" };
}

function formatDate(ts) {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "2-digit" });
}

/* --- Icons --- */
function IconHome() { return <svg className="gn-nav-icon" viewBox="0 0 24 24" fill="none"><path d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5Z" stroke="#2b2b2b" strokeWidth="2" strokeLinejoin="round" /></svg>; }
function IconUser() { return <svg className="gn-nav-icon" viewBox="0 0 24 24" fill="none"><path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="#2b2b2b" strokeWidth="2" /><path d="M4 21a8 8 0 0 1 16 0" stroke="#2b2b2b" strokeWidth="2" strokeLinecap="round" /></svg>; }
function IconDoc() { return <svg className="gn-nav-icon" viewBox="0 0 24 24" fill="none"><path d="M7 3h7l3 3v15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" stroke="#2b2b2b" strokeWidth="2" strokeLinejoin="round" /><path d="M14 3v4h4" stroke="#2b2b2b" strokeWidth="2" /></svg>; }
function IconComplaint() { return <svg className="gn-nav-icon" viewBox="0 0 24 24" fill="none"><path d="M7 3h10a2 2 0 0 1 2 2v16l-4-3H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" stroke="#2b2b2b" strokeWidth="2" strokeLinejoin="round" /><path d="M8 8h8M8 12h6" stroke="#2b2b2b" strokeWidth="2" strokeLinecap="round" /></svg>; }
function IconBell() { return <svg className="gn-nav-icon" viewBox="0 0 24 24" fill="none"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z" stroke="#2b2b2b" strokeWidth="2" strokeLinejoin="round" /><path d="M10 19a2 2 0 0 0 4 0" stroke="#2b2b2b" strokeWidth="2" strokeLinecap="round" /></svg>; }

/* Dynamic Fields Component */
function DynamicFields({ certType, requestData, setRequestData }) {
  const handleInput = (field, value) => {
    setRequestData((prev) => ({ ...prev, [field]: value }));
  };

  if (!certType || certType === "Residence and character Certificate") return null;

  return (
    <div className="cr-dynamic-fields" style={{ marginTop: "15px", padding: "15px", backgroundColor: "#f9fbfd", border: "1px solid #e1e8f0", borderRadius: "8px" }}>
      <h3 style={{ fontSize: "1rem", marginBottom: "15px", color: "#2b2b2b" }}>Additional Details Required</h3>

      {certType === "Application for obtaining housing loan funds" && (
        <>
          <div className="gn-field">
            <label className="cr-label">Applicant Name (Full Name)</label>
            <input className="gn-input" type="text" value={requestData.applicant_name || ""} onChange={e => handleInput("applicant_name", e.target.value)} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Full Residential Address</label>
            <input className="gn-input" type="text" value={requestData.address || ""} onChange={e => handleInput("address", e.target.value)} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Monthly Family Income (Rs.)</label>
            <input className="gn-input" type="number" value={requestData.monthly_income || ""} onChange={e => handleInput("monthly_income", e.target.value)} />
          </div>
          <div className="gn-field gn-radio-group" style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "10px" }}>
            <label className="cr-label" style={{ marginBottom: 0 }}>Samurdhi Beneficiary:</label>
            <label><input type="radio" checked={requestData.samurdhi_beneficiary === "Yes"} onChange={() => handleInput("samurdhi_beneficiary", "Yes")} /> Yes</label>
            <label><input type="radio" checked={requestData.samurdhi_beneficiary === "No"} onChange={() => handleInput("samurdhi_beneficiary", "No")} /> No</label>
          </div>
          <div className="gn-field">
            <label className="cr-label">Property Details (Land Size, Deed Number, and Date)</label>
            <textarea className="gn-textarea" placeholder="E.g., 10 Perches, Deed 1234, 2020-01-01" value={requestData.property_details || ""} onChange={e => handleInput("property_details", e.target.value)} rows={2} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Requested Amount (Rs.)</label>
            <input className="gn-input" type="number" value={requestData.requested_amount || ""} onChange={e => handleInput("requested_amount", e.target.value)} />
          </div>
        </>
      )}

      {certType === "Notification of the death of a pensioner" && (
        <>
          <div className="gn-field">
            <label className="cr-label">Pensioner Name (Full Name)</label>
            <input className="gn-input" type="text" value={requestData.pensioner_name || ""} onChange={e => handleInput("pensioner_name", e.target.value)} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Address</label>
            <input className="gn-input" type="text" value={requestData.address || ""} onChange={e => handleInput("address", e.target.value)} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Date of Death</label>
            <input className="gn-input" type="date" value={requestData.date_of_death || ""} onChange={e => handleInput("date_of_death", e.target.value)} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Pension Number</label>
            <input className="gn-input" type="text" value={requestData.pension_number || ""} onChange={e => handleInput("pension_number", e.target.value)} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Dependents (Name, Relationship, Age)</label>
            <textarea className="gn-textarea" placeholder="E.g., Kamal Perera - Son - 25&#10; Kasuni Perera - Daughter - 22" value={requestData.dependents || ""} onChange={e => handleInput("dependents", e.target.value)} rows={3} />
          </div>
        </>
      )}

      {certType === "Income Certificate" && (
        <>
          <div className="gn-field">
            <label className="cr-label">Applicant Name & NIC</label>
            <input className="gn-input" type="text" value={requestData.applicant_name_nic || ""} onChange={e => handleInput("applicant_name_nic", e.target.value)} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Address & Household Number</label>
            <input className="gn-input" type="text" value={requestData.address || ""} onChange={e => handleInput("address", e.target.value)} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Source of Income (Business/Job Details)</label>
            <input className="gn-input" type="text" value={requestData.income_source || ""} onChange={e => handleInput("income_source", e.target.value)} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Duration of Business/Service</label>
            <input className="gn-input" type="text" value={requestData.duration_of_service || ""} onChange={e => handleInput("duration_of_service", e.target.value)} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Monthly/Annual Income Amount (Rs.)</label>
            <input className="gn-input" type="text" value={requestData.income_amount || ""} onChange={e => handleInput("income_amount", e.target.value)} />
          </div>
        </>
      )}

      {certType === "Registration of delayed births" && (
        <>
          <div className="gn-field">
            <label className="cr-label">Child's Full Name</label>
            <input className="gn-input" type="text" value={requestData.child_name || ""} onChange={e => handleInput("child_name", e.target.value)} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Date & Place of Birth</label>
            <input className="gn-input" type="text" value={requestData.dob_and_place || ""} onChange={e => handleInput("dob_and_place", e.target.value)} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Father’s Details (Name and Status)</label>
            <textarea className="gn-textarea" value={requestData.father_details || ""} onChange={e => handleInput("father_details", e.target.value)} rows={2} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Mother’s Details (Name and Status)</label>
            <textarea className="gn-textarea" value={requestData.mother_details || ""} onChange={e => handleInput("mother_details", e.target.value)} rows={2} />
          </div>
          <div className="gn-field" style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "10px" }}>
            <label className="cr-label" style={{ marginBottom: 0 }}>Proof of Identity:</label>
            <label><input type="checkbox" onChange={(e) => handleInput("proof_nic", e.target.checked)} /> NIC</label>
            <label><input type="checkbox" onChange={(e) => handleInput("proof_passport", e.target.checked)} /> Passport</label>
            <label><input type="checkbox" onChange={(e) => handleInput("proof_driving_license", e.target.checked)} /> Driving License</label>
          </div>
        </>
      )}

      {certType === "Registration of voluntary organizations" && (
        <>
          <div className="gn-field">
            <label className="cr-label">Organization Name & Address</label>
            <input className="gn-input" type="text" value={requestData.org_name_address || ""} onChange={e => handleInput("org_name_address", e.target.value)} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Subject/Objective of Organization</label>
            <textarea className="gn-textarea" value={requestData.org_objective || ""} onChange={e => handleInput("org_objective", e.target.value)} rows={2} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Date of Commencement</label>
            <input className="gn-input" type="date" value={requestData.commencement_date || ""} onChange={e => handleInput("commencement_date", e.target.value)} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Office Bearers (Name, Address, Phone)</label>
            <textarea className="gn-textarea" placeholder="E.g., President: ..., Secretary: ..., Treasurer: ..." value={requestData.office_bearers || ""} onChange={e => handleInput("office_bearers", e.target.value)} rows={3} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Bank Account Details (Account Number and Branch)</label>
            <input className="gn-input" type="text" value={requestData.bank_details || ""} onChange={e => handleInput("bank_details", e.target.value)} />
          </div>
        </>
      )}

      {certType === "Request for financial assistance from the President's fund for medical treatment" && (
        <>
          <div className="gn-field">
            <label className="cr-label">Patient Name & NIC</label>
            <input className="gn-input" type="text" value={requestData.patient_details || ""} onChange={e => handleInput("patient_details", e.target.value)} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Family Monthly Income Table (Name, Job, Income)</label>
            <textarea className="gn-textarea" placeholder="E.g., Kamal - Driver - Rs 30000" value={requestData.family_incomes || ""} onChange={e => handleInput("family_incomes", e.target.value)} rows={3} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Property/Asset Details (List of assets and value)</label>
            <textarea className="gn-textarea" placeholder="E.g., Vehicle: ABC-1234 - Rs 1M" value={requestData.property_details || ""} onChange={e => handleInput("property_details", e.target.value)} rows={2} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Bank Deposit Details (Bank Name, Branch, and Current Balance)</label>
            <textarea className="gn-textarea" placeholder="BOC Colombo - Rs 50000" value={requestData.bank_details || ""} onChange={e => handleInput("bank_details", e.target.value)} rows={2} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Cost Estimate (How the treatment cost was calculated)</label>
            <textarea className="gn-textarea" value={requestData.cost_estimate || ""} onChange={e => handleInput("cost_estimate", e.target.value)} rows={2} />
          </div>
        </>
      )}
    </div>
  );
}

export default function CertificateRequest() {
  /* Form state */
  const [certType, setCertType] = useState("");
  const [purpose, setPurpose] = useState("");
  const [nicNumber, setNicNumber] = useState("");
  const [requestData, setRequestData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  /* Citizen profile + family members */
  const [myNic, setMyNic] = useState("");
  const [myName, setMyName] = useState("");
  const [members, setMembers] = useState([]);
  const [selectedFor, setSelectedFor] = useState("self");

  /* Request history */
  const [requests, setRequests] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [downloading, setDownloading] = useState(null);

  const loadRequests = async () => {
    setListLoading(true);
    try {
      const r = await api.get("/api/certificate/my");
      if (r.data.ok) setRequests(r.data.requests);
    } catch {
      setListError("Failed to load your requests.");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
    api.get("/api/citizen/me/profile").then(r => {
      if (r.data.ok && r.data.profile) {
        const nic = r.data.profile.nic || "";
        const name = r.data.profile.full_name || "Myself";
        setMyNic(nic); setMyName(name); setNicNumber(nic);
      }
    }).catch(() => { });
    api.get("/api/certificate/my-members").then(r => {
      if (r.data.ok) setMembers(r.data.members);
    }).catch(() => { });
  }, []);

  const handleSelectFor = (e) => {
    const val = e.target.value;
    setSelectedFor(val);
    if (val === "self") {
      setNicNumber(myNic);
    } else {
      const member = members.find(m => String(m.member_id) === val);
      if (member) setNicNumber(member.nic_number || "");
    }
  };

  const handleCertTypeChange = (e) => {
    setCertType(e.target.value);
    setRequestData({}); // Reset dynamic fields when cert type changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(""); setSubmitSuccess("");
    if (!certType) { setSubmitError("Please select a certificate type."); return; }
    if (!nicNumber.trim()) { setSubmitError("Please enter your NIC number."); return; }
    setSubmitting(true);
    try {
      await api.post("/api/certificate", {
        cert_type: certType,
        purpose,
        nic_number: nicNumber,
        request_data: requestData
      });
      setSubmitSuccess("✅ Your request has been submitted successfully!");
      setCertType(""); setPurpose(""); setRequestData({}); setSelectedFor("self"); setNicNumber(myNic);
      loadRequests();
    } catch (ex) {
      setSubmitError(ex.response?.data?.error || "Failed to submit request.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownload = async (requestId) => {
    setDownloading(requestId);
    try {
      const response = await api.get(`/api/certificate/${requestId}/citizen-pdf`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `certificate_${requestId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Failed to download certificate. Please try again.");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="gn-page">
      {/* Header */}
      <header className="gn-header">
        <div className="gn-header-left">
          <img className="gn-emblem" src={emblem} alt="Emblem" />
          <div className="gn-title-wrap">
            <div className="gn-title">Grama Niladhari Division - Maspanna</div>
            <div className="gn-subtitle">Ministry of Home Affairs</div>
          </div>
        </div>
        <div className="gn-header-right" style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <Link to="/about" className="gn-about-btn">About Us</Link>
          <NotificationDropdown />
          <CitizenProfileDropdown />
        </div>
      </header>

      {/* Nav */}
      <nav className="gn-nav">
        <Link to="/citizen" className="gn-nav-item"><IconHome /><span>Home</span></Link>
        <Link to="/household" className="gn-nav-item"><IconUser /><span>Household</span></Link>
        <Link to="/certificates" className="gn-nav-item gn-nav-active"><IconDoc /><span>Certificates</span></Link>
        <Link to="/complaints" className="gn-nav-item"><IconComplaint /><span>Complaints</span></Link>
        <Link to="/notices" className="gn-nav-item"><IconBell /><span>Notices</span></Link>
      </nav>

      {/* Content */}
      <main className="gn-content">
        <div className="gn-form-wrap">
          <h2 className="gn-form-title">Certificate Request Form</h2>
          <p className="gn-form-sub">Submit a request for official certificates issued by the Grama Niladhari office.</p>

          {submitSuccess && <div className="cr-alert cr-alert-ok">{submitSuccess}</div>}
          {submitError && <div className="cr-alert cr-alert-err">{submitError}</div>}

          <form className="gn-form-grid" onSubmit={handleSubmit}>
            {/* Left column */}
            <div className="gn-left-col">
              <div className="gn-field">
                <label className="cr-label">Certificate Type <span className="cr-req">*</span></label>
                <select className="gn-input gn-select" value={certType} onChange={handleCertTypeChange}>
                  <option value="">Select Certificate Type</option>
                  {CERT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="gn-field">
                <label className="cr-label">Requesting For <span className="cr-req">*</span></label>
                <select className="gn-input gn-select" value={selectedFor} onChange={handleSelectFor}>
                  <option value="self">{myName || "Myself"}</option>
                  {members.map(m => (
                    <option key={m.member_id} value={String(m.member_id)}>
                      {m.full_name} ({m.relationship_to_head})
                    </option>
                  ))}
                </select>
              </div>

              <div className="gn-field">
                <label className="cr-label">NIC Number <span className="cr-req">*</span></label>
                <input
                  className="gn-input"
                  type="text"
                  placeholder="e.g. 200012345678 or 991234567V"
                  value={nicNumber}
                  onChange={e => setNicNumber(e.target.value)}
                  maxLength={12}
                />
                <span style={{ fontSize: "0.78rem", color: "#888", marginTop: "4px", display: "block" }}>
                  Auto-filled from household registration. Edit if needed.
                </span>
              </div>

              <div className="gn-field">
                <label className="cr-label">Purpose / Additional Information</label>
                <textarea className="gn-textarea" placeholder="Describe the purpose of the certificate request…" value={purpose} onChange={e => setPurpose(e.target.value)} rows={3} />
              </div>

              <DynamicFields certType={certType} requestData={requestData} setRequestData={setRequestData} />

              <div className="gn-submit-row" style={{ marginTop: "20px" }}>
                <button className="gn-submit-btn" type="submit" disabled={submitting}>
                  {submitting ? "Submitting…" : "Submit Request"}
                </button>
              </div>
            </div>

            {/* Right column */}
            <div className="gn-right-col">
              <div className="cr-info-box">
                <h3>📄 Supported Certificate Types</h3>
                <ul style={{ paddingLeft: "1.2rem", marginTop: "10px" }}>
                  {CERT_TYPES.map(t => (
                    <li key={t} style={{ marginBottom: "10px", lineHeight: "1.4" }}>
                      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" }}>
                        <span>{t}</span>
                        {CERT_PDF_MAP[t] && (
                          <a href={CERT_PDF_MAP[t]} download target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "0.75rem", padding: "3px 8px", backgroundColor: "rgba(39, 174, 96, 0.1)", color: "#1e8449", border: "1px solid rgba(39, 174, 96, 0.2)", borderRadius: "6px", textDecoration: "none", fontWeight: "600", whiteSpace: "nowrap", transition: "all 0.2s" }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                            Blank Form (Download here)
                          </a>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="cr-info-note" style={{ marginTop: "14px" }}>Your personal details (name, NIC, address) will be automatically filled from your registered profile.</p>
              </div>
            </div>
          </form>
        </div>

        {/* Request History */}
        <div className="cr-history">
          <h2 className="cr-history-title">My Certificate Requests</h2>
          {listLoading && <div className="cr-state">Loading…</div>}
          {listError && <div className="cr-state cr-state-err">{listError}</div>}
          {!listLoading && requests.length === 0 && <div className="cr-state">You have not submitted any requests yet.</div>}

          {!listLoading && requests.length > 0 && (
            <div className="cr-table-wrap">
              <table className="cr-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>GN Note</th>
                    <th>Date</th>
                    <th>Actions &amp; Details</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((r) => {
                    const badge = statusBadge(r.status);
                    const isApproved = r.status === "APPROVED" || r.status === "ISSUED";
                    const isVisit = r.status === "VISIT_REQUIRED";
                    const isRejected = r.status === "REJECTED";
                    return (
                      <tr key={r.request_id}>
                        <td className="cr-td-id">#{r.request_id}</td>
                        <td>{r.cert_type}</td>
                        <td><span className={badge.cls}>{badge.label}</span></td>
                        <td className="cr-td-muted">{r.gn_remarks || r.gn_note || "—"}</td>
                        <td className="cr-td-date">{formatDate(r.created_at)}</td>
                        <td className="cr-td-actions">
                          {/* Download button for approved certs */}
                          {isApproved && (
                            <button
                              className="cr-download-btn"
                              onClick={() => handleDownload(r.request_id)}
                              disabled={downloading === r.request_id}
                            >
                              {downloading === r.request_id ? "⏳ Downloading…" : "⬇ Download Certificate"}
                            </button>
                          )}
                          {/* Visit info panel */}
                          {isVisit && (
                            <div className="cr-visit-panel">
                              <div className="cr-visit-title">📅 Physical Visit Scheduled</div>
                              {r.appointment_date && (
                                <div className="cr-visit-row">
                                  <span>Date:</span>
                                  <strong>{formatDate(r.appointment_date)}</strong>
                                </div>
                              )}
                              {r.required_documents_list && (
                                <div className="cr-visit-row cr-visit-docs">
                                  <span>Bring:</span>
                                  <span>{r.required_documents_list}</span>
                                </div>
                              )}
                            </div>
                          )}
                          {/* Rejection reason */}
                          {isRejected && r.rejection_reason && (
                            <div className="cr-rejection-panel">
                              <strong>Reason:</strong> {r.rejection_reason}
                            </div>
                          )}
                          {/* No special action needed for other statuses */}
                          {!isApproved && !isVisit && !isRejected && (
                            <span className="cr-td-muted">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="gn-footer">
        <div className="gn-footer-inner">
          <div className="gn-footer-cols">
            <div className="gn-footer-col">
              <div className="gn-footer-title">Contact Information</div>
              <div className="gn-footer-text">Grama Niladhari officer, Maspanna</div>
              <div className="gn-footer-text">Phone: 0768187908</div>
              <div className="gn-footer-text">Email: chasara88@gmail.com</div>
            </div>
            <div className="gn-footer-col">
              <div className="gn-footer-title">Office Hours</div>
              <div className="gn-footer-text">Tuesday 08:15 to 16:30</div>
              <div className="gn-footer-text">Thursday 08:15 to 16:30</div>
              <div className="gn-footer-text">Saturday 08:15 to 12:30</div>
            </div>
            <div className="gn-footer-col">
              <div className="gn-footer-title">Quick links</div>
              <div className="gn-footer-text">Citizen Login</div>
              <div className="gn-footer-text">New Registration</div>
              <div className="gn-footer-text">Complaints</div>
            </div>
          </div>
          <div className="gn-footer-line" />
          <div className="gn-copyright">© 2025 Grama Niladhari Division - Maspanna. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
