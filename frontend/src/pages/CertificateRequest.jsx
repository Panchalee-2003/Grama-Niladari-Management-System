import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/certificateRequest.css";
import emblem from "../assets/emblem.png";
import NotificationDropdown from "../components/NotificationDropdown";
import CitizenProfileDropdown from "../components/CitizenProfileDropdown";
import LanguageSwitcher from "../components/LanguageSwitcher";
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

/* Dependents Table Component for Death of Pensioner */
function DependentsTable({ requestData, setRequestData }) {
  const dependents = Array.isArray(requestData.dependents) ? requestData.dependents : [];

  const handleRowChange = (index, field, value) => {
    const updated = dependents.map((dep, i) =>
      i === index ? { ...dep, [field]: value } : dep
    );
    setRequestData(prev => ({ ...prev, dependents: updated }));
  };

  const addRow = () => {
    setRequestData(prev => ({
      ...prev,
      dependents: [...(Array.isArray(prev.dependents) ? prev.dependents : []), { name: "", relationship: "", age: "" }]
    }));
  };

  const removeRow = (index) => {
    const updated = dependents.filter((_, i) => i !== index);
    setRequestData(prev => ({ ...prev, dependents: updated }));
  };

  return (
    <div style={{ width: "100%" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
        <thead>
          <tr style={{ backgroundColor: "#f1f5f9" }}>
            <th style={{ border: "1px solid #e2e8f0", padding: "8px", textAlign: "left", fontWeight: 600, color: "#374151" }}>Name</th>
            <th style={{ border: "1px solid #e2e8f0", padding: "8px", textAlign: "left", fontWeight: 600, color: "#374151" }}>Relationship</th>
            <th style={{ border: "1px solid #e2e8f0", padding: "8px", textAlign: "left", fontWeight: 600, color: "#374151", width: "80px" }}>Age</th>
            <th style={{ border: "1px solid #e2e8f0", padding: "8px", width: "40px" }}></th>
          </tr>
        </thead>
        <tbody>
          {dependents.length === 0 && (
            <tr>
              <td colSpan={4} style={{ border: "1px solid #e2e8f0", padding: "10px", textAlign: "center", color: "#9ca3af", fontStyle: "italic" }}>
                No dependents added yet.
              </td>
            </tr>
          )}
          {dependents.map((dep, i) => (
            <tr key={i}>
              <td style={{ border: "1px solid #e2e8f0", padding: "4px" }}>
                <input
                  className="gn-input"
                  style={{ margin: 0, width: "100%", boxSizing: "border-box" }}
                  type="text"
                  placeholder="Full name"
                  value={dep.name || ""}
                  onChange={e => handleRowChange(i, "name", e.target.value)}
                />
              </td>
              <td style={{ border: "1px solid #e2e8f0", padding: "4px" }}>
                <input
                  className="gn-input"
                  style={{ margin: 0, width: "100%", boxSizing: "border-box" }}
                  type="text"
                  placeholder="e.g. Son, Spouse"
                  value={dep.relationship || ""}
                  onChange={e => handleRowChange(i, "relationship", e.target.value)}
                />
              </td>
              <td style={{ border: "1px solid #e2e8f0", padding: "4px" }}>
                <input
                  className="gn-input"
                  style={{ margin: 0, width: "100%", boxSizing: "border-box" }}
                  type="number"
                  min="0"
                  placeholder="Age"
                  value={dep.age || ""}
                  onChange={e => handleRowChange(i, "age", e.target.value)}
                />
              </td>
              <td style={{ border: "1px solid #e2e8f0", padding: "4px", textAlign: "center" }}>
                <button
                  type="button"
                  onClick={() => removeRow(i)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: "1.1rem", lineHeight: 1, padding: "2px 6px" }}
                  title="Remove"
                >✕</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        type="button"
        onClick={addRow}
        style={{ marginTop: "8px", padding: "6px 14px", fontSize: "0.82rem", backgroundColor: "#e8f4e8", color: "#166534", border: "1px solid #bbf7d0", borderRadius: "6px", cursor: "pointer", fontWeight: 600 }}
      >
        + Add Dependent
      </button>
    </div>
  );
}

/* Family Income Table Component */
function FamilyIncomeTable({ requestData, setRequestData }) {
  const incomes = Array.isArray(requestData.family_incomes_list) ? requestData.family_incomes_list : [];
  const handleRowChange = (index, field, value) => {
    const updated = incomes.map((inc, i) => i === index ? { ...inc, [field]: value } : inc);
    setRequestData(prev => ({ ...prev, family_incomes_list: updated }));
  };
  const addRow = () => setRequestData(prev => ({ ...prev, family_incomes_list: [...incomes, { name: "", relationship: "", civil_status: "", occupation: "", income: "", tax_payer: "No" }] }));
  const removeRow = (index) => setRequestData(prev => ({ ...prev, family_incomes_list: incomes.filter((_, i) => i !== index) }));

  return (
    <div style={{ width: "100%", marginBottom: "15px" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
        <thead>
          <tr style={{ backgroundColor: "#f1f5f9" }}>
            <th style={{ border: "1px solid #e2e8f0", padding: "8px", textAlign: "left", fontWeight: 600, color: "#374151" }}>Name</th>
            <th style={{ border: "1px solid #e2e8f0", padding: "8px", textAlign: "left", fontWeight: 600, color: "#374151" }}>Relationship</th>
            <th style={{ border: "1px solid #e2e8f0", padding: "8px", textAlign: "left", fontWeight: 600, color: "#374151" }}>Civil Status</th>
            <th style={{ border: "1px solid #e2e8f0", padding: "8px", textAlign: "left", fontWeight: 600, color: "#374151" }}>Occupation</th>
            <th style={{ border: "1px solid #e2e8f0", padding: "8px", textAlign: "left", fontWeight: 600, color: "#374151" }}>Income (Rs.)</th>
            <th style={{ border: "1px solid #e2e8f0", padding: "8px", textAlign: "left", fontWeight: 600, color: "#374151" }}>Tax Payer?</th>
            <th style={{ border: "1px solid #e2e8f0", padding: "8px", width: "40px" }}></th>
          </tr>
        </thead>
        <tbody>
          {incomes.length === 0 && (
            <tr><td colSpan={7} style={{ border: "1px solid #e2e8f0", padding: "10px", textAlign: "center", color: "#9ca3af", fontStyle: "italic" }}>No family income added.</td></tr>
          )}
          {incomes.map((inc, i) => (
            <tr key={i}>
              <td style={{ border: "1px solid #e2e8f0", padding: "4px" }}><input className="gn-input" style={{ margin: 0, width: "100%", boxSizing: "border-box" }} type="text" value={inc.name || ""} onChange={e => handleRowChange(i, "name", e.target.value)} /></td>
              <td style={{ border: "1px solid #e2e8f0", padding: "4px" }}><input className="gn-input" style={{ margin: 0, width: "100%", boxSizing: "border-box" }} type="text" value={inc.relationship || ""} onChange={e => handleRowChange(i, "relationship", e.target.value)} /></td>
              <td style={{ border: "1px solid #e2e8f0", padding: "4px" }}>
                <select className="gn-input gn-select" style={{ margin: 0, width: "100%", boxSizing: "border-box" }} value={inc.civil_status || ""} onChange={e => handleRowChange(i, "civil_status", e.target.value)}>
                  <option value="">Select</option><option value="Married">Married</option><option value="Unmarried">Unmarried</option>
                </select>
              </td>
              <td style={{ border: "1px solid #e2e8f0", padding: "4px" }}><input className="gn-input" style={{ margin: 0, width: "100%", boxSizing: "border-box" }} type="text" value={inc.occupation || ""} onChange={e => handleRowChange(i, "occupation", e.target.value)} /></td>
              <td style={{ border: "1px solid #e2e8f0", padding: "4px" }}><input className="gn-input" style={{ margin: 0, width: "100%", boxSizing: "border-box" }} type="number" min="0" value={inc.income || ""} onChange={e => handleRowChange(i, "income", e.target.value)} /></td>
              <td style={{ border: "1px solid #e2e8f0", padding: "4px" }}>
                <select className="gn-input gn-select" style={{ margin: 0, width: "100%", boxSizing: "border-box" }} value={inc.tax_payer || "No"} onChange={e => handleRowChange(i, "tax_payer", e.target.value)}>
                  <option value="Yes">Yes</option><option value="No">No</option>
                </select>
              </td>
              <td style={{ border: "1px solid #e2e8f0", padding: "4px", textAlign: "center" }}><button type="button" onClick={() => removeRow(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: "1.1rem" }}>✕</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" onClick={addRow} style={{ marginTop: "8px", padding: "6px 14px", fontSize: "0.82rem", backgroundColor: "#e8f4e8", color: "#166534", border: "1px solid #bbf7d0", borderRadius: "6px", cursor: "pointer", fontWeight: 600 }}>+ Add Income</button>
    </div>
  );
}

/* Property Asset Table Component */
function PropertyAssetTable({ requestData, setRequestData }) {
  const assets = Array.isArray(requestData.assets_list) ? requestData.assets_list : [];
  const handleRowChange = (index, field, value) => {
    const updated = assets.map((a, i) => i === index ? { ...a, [field]: value } : a);
    setRequestData(prev => ({ ...prev, assets_list: updated }));
  };
  const addRow = () => setRequestData(prev => ({ ...prev, assets_list: [...assets, { owner_name: "", relationship: "", description: "", market_value: "" }] }));
  const removeRow = (index) => setRequestData(prev => ({ ...prev, assets_list: assets.filter((_, i) => i !== index) }));

  return (
    <div style={{ width: "100%", marginBottom: "15px" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
        <thead>
          <tr style={{ backgroundColor: "#f1f5f9" }}>
            <th style={{ border: "1px solid #e2e8f0", padding: "8px", textAlign: "left", fontWeight: 600, color: "#374151" }}>Name of Owner</th>
            <th style={{ border: "1px solid #e2e8f0", padding: "8px", textAlign: "left", fontWeight: 600, color: "#374151" }}>Relationship</th>
            <th style={{ border: "1px solid #e2e8f0", padding: "8px", textAlign: "left", fontWeight: 600, color: "#374151" }}>Description (e.g., Land)</th>
            <th style={{ border: "1px solid #e2e8f0", padding: "8px", textAlign: "left", fontWeight: 600, color: "#374151" }}>Estimated Value (Rs.)</th>
            <th style={{ border: "1px solid #e2e8f0", padding: "8px", width: "40px" }}></th>
          </tr>
        </thead>
        <tbody>
          {assets.length === 0 && (
            <tr><td colSpan={5} style={{ border: "1px solid #e2e8f0", padding: "10px", textAlign: "center", color: "#9ca3af", fontStyle: "italic" }}>No assets added.</td></tr>
          )}
          {assets.map((ast, i) => (
            <tr key={i}>
              <td style={{ border: "1px solid #e2e8f0", padding: "4px" }}><input className="gn-input" style={{ margin: 0, width: "100%", boxSizing: "border-box" }} type="text" value={ast.owner_name || ""} onChange={e => handleRowChange(i, "owner_name", e.target.value)} /></td>
              <td style={{ border: "1px solid #e2e8f0", padding: "4px" }}><input className="gn-input" style={{ margin: 0, width: "100%", boxSizing: "border-box" }} type="text" value={ast.relationship || ""} onChange={e => handleRowChange(i, "relationship", e.target.value)} /></td>
              <td style={{ border: "1px solid #e2e8f0", padding: "4px" }}><input className="gn-input" style={{ margin: 0, width: "100%", boxSizing: "border-box" }} type="text" value={ast.description || ""} onChange={e => handleRowChange(i, "description", e.target.value)} /></td>
              <td style={{ border: "1px solid #e2e8f0", padding: "4px" }}><input className="gn-input" style={{ margin: 0, width: "100%", boxSizing: "border-box" }} type="number" min="0" value={ast.market_value || ""} onChange={e => handleRowChange(i, "market_value", e.target.value)} /></td>
              <td style={{ border: "1px solid #e2e8f0", padding: "4px", textAlign: "center" }}><button type="button" onClick={() => removeRow(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: "1.1rem" }}>✕</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" onClick={addRow} style={{ marginTop: "8px", padding: "6px 14px", fontSize: "0.82rem", backgroundColor: "#e8f4e8", color: "#166534", border: "1px solid #bbf7d0", borderRadius: "6px", cursor: "pointer", fontWeight: 600 }}>+ Add Asset</button>
    </div>
  );
}

/* Bank Deposits Table Component */
function BankDepositsTable({ requestData, setRequestData }) {
  const banks = Array.isArray(requestData.bank_deposits_list) ? requestData.bank_deposits_list : [];
  const handleRowChange = (index, field, value) => {
    const updated = banks.map((b, i) => i === index ? { ...b, [field]: value } : b);
    setRequestData(prev => ({ ...prev, bank_deposits_list: updated }));
  };
  const addRow = () => setRequestData(prev => ({ ...prev, bank_deposits_list: [...banks, { owner_name: "", relationship: "", bank_name: "", branch: "", account_number: "", current_balance: "" }] }));
  const removeRow = (index) => setRequestData(prev => ({ ...prev, bank_deposits_list: banks.filter((_, i) => i !== index) }));

  return (
    <div style={{ width: "100%", marginBottom: "15px" }}>
      <p style={{ fontSize: "0.85rem", color: "#b45309", fontWeight: "600", marginBottom: "10px", backgroundColor: "#fef3c7", padding: "8px 12px", borderRadius: "6px", border: "1px solid #fde68a" }}>
        Note: Please state the balance available in the account as of the date of completing this application.
      </p>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
        <thead>
          <tr style={{ backgroundColor: "#f1f5f9" }}>
            <th style={{ border: "1px solid #e2e8f0", padding: "8px", textAlign: "left", fontWeight: 600, color: "#374151" }}>Owner's Name</th>
            <th style={{ border: "1px solid #e2e8f0", padding: "8px", textAlign: "left", fontWeight: 600, color: "#374151" }}>Relationship</th>
            <th style={{ border: "1px solid #e2e8f0", padding: "8px", textAlign: "left", fontWeight: 600, color: "#374151" }}>Bank Name</th>
            <th style={{ border: "1px solid #e2e8f0", padding: "8px", textAlign: "left", fontWeight: 600, color: "#374151" }}>Branch</th>
            <th style={{ border: "1px solid #e2e8f0", padding: "8px", textAlign: "left", fontWeight: 600, color: "#374151" }}>Account No</th>
            <th style={{ border: "1px solid #e2e8f0", padding: "8px", textAlign: "left", fontWeight: 600, color: "#374151" }}>Balance (Rs.)</th>
            <th style={{ border: "1px solid #e2e8f0", padding: "8px", width: "40px" }}></th>
          </tr>
        </thead>
        <tbody>
          {banks.length === 0 && (
            <tr><td colSpan={7} style={{ border: "1px solid #e2e8f0", padding: "10px", textAlign: "center", color: "#9ca3af", fontStyle: "italic" }}>No bank accounts added.</td></tr>
          )}
          {banks.map((b, i) => (
            <tr key={i}>
              <td style={{ border: "1px solid #e2e8f0", padding: "4px" }}><input className="gn-input" style={{ margin: 0, width: "100%", boxSizing: "border-box" }} type="text" value={b.owner_name || ""} onChange={e => handleRowChange(i, "owner_name", e.target.value)} /></td>
              <td style={{ border: "1px solid #e2e8f0", padding: "4px" }}><input className="gn-input" style={{ margin: 0, width: "100%", boxSizing: "border-box" }} type="text" value={b.relationship || ""} onChange={e => handleRowChange(i, "relationship", e.target.value)} /></td>
              <td style={{ border: "1px solid #e2e8f0", padding: "4px" }}><input className="gn-input" style={{ margin: 0, width: "100%", boxSizing: "border-box" }} type="text" value={b.bank_name || ""} onChange={e => handleRowChange(i, "bank_name", e.target.value)} /></td>
              <td style={{ border: "1px solid #e2e8f0", padding: "4px" }}><input className="gn-input" style={{ margin: 0, width: "100%", boxSizing: "border-box" }} type="text" value={b.branch || ""} onChange={e => handleRowChange(i, "branch", e.target.value)} /></td>
              <td style={{ border: "1px solid #e2e8f0", padding: "4px" }}><input className="gn-input" style={{ margin: 0, width: "100%", boxSizing: "border-box" }} type="text" value={b.account_number || ""} onChange={e => handleRowChange(i, "account_number", e.target.value)} /></td>
              <td style={{ border: "1px solid #e2e8f0", padding: "4px" }}><input className="gn-input" style={{ margin: 0, width: "100%", boxSizing: "border-box" }} type="number" min="0" value={b.current_balance || ""} onChange={e => handleRowChange(i, "current_balance", e.target.value)} /></td>
              <td style={{ border: "1px solid #e2e8f0", padding: "4px", textAlign: "center" }}><button type="button" onClick={() => removeRow(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: "1.1rem" }}>✕</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" onClick={addRow} style={{ marginTop: "8px", padding: "6px 14px", fontSize: "0.82rem", backgroundColor: "#e8f4e8", color: "#166534", border: "1px solid #bbf7d0", borderRadius: "6px", cursor: "pointer", fontWeight: 600 }}>+ Add Bank Account</button>
    </div>
  );
}

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
            <label className="cr-label">Address</label>
            <input className="gn-input" type="text" value={requestData.address || ""} onChange={e => handleInput("address", e.target.value)} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Monthly Family Income (Rs.)</label>
            <input className="gn-input" type="number" value={requestData.monthly_income || ""} onChange={e => handleInput("monthly_income", e.target.value)} />
          </div>
          <div className="gn-field" style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <label className="cr-label" style={{ marginBottom: 0 }}>Samurdhi Beneficiary:</label>
            <label><input type="radio" checked={requestData.samurdhi_beneficiary === "Yes"} onChange={() => handleInput("samurdhi_beneficiary", "Yes")} /> Yes</label>
            <label><input type="radio" checked={requestData.samurdhi_beneficiary === "No"} onChange={() => handleInput("samurdhi_beneficiary", "No")} /> No</label>
          </div>
          <h5 style={{ margin: "15px 0 8px", fontSize: "0.88rem", color: "#334155" }}>Property Details (Land/Property for Assistance)</h5>
          <div className="gn-field">
            <label className="cr-label">Owner's Name</label>
            <input className="gn-input" type="text" value={requestData.owner_name || ""} onChange={e => handleInput("owner_name", e.target.value)} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Land Extent</label>
            <input className="gn-input" type="text" placeholder="e.g., 10 Perches" value={requestData.land_extent || ""} onChange={e => handleInput("land_extent", e.target.value)} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Deed Number and Date</label>
            <input className="gn-input" type="text" placeholder="e.g., Deed No. 1234, 2020-01-15" value={requestData.deed_number_date || ""} onChange={e => handleInput("deed_number_date", e.target.value)} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Requested Loan / Grant Amount (Rs.)</label>
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
            <label className="cr-label">Date of Retirement</label>
            <input className="gn-input" type="date" value={requestData.date_of_retirement || ""} onChange={e => handleInput("date_of_retirement", e.target.value)} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Pensioner's NIC Number</label>
            <input className="gn-input" type="text" placeholder="e.g. 200012345678 or 991234567V" value={requestData.pensioner_nic || ""} onChange={e => handleInput("pensioner_nic", e.target.value)} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Pension Number</label>
            <input className="gn-input" type="text" value={requestData.pension_number || ""} onChange={e => handleInput("pension_number", e.target.value)} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Date of Death</label>
            <input className="gn-input" type="date" value={requestData.date_of_death || ""} onChange={e => handleInput("date_of_death", e.target.value)} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Dependents</label>
            <DependentsTable requestData={requestData} setRequestData={setRequestData} />
          </div>
        </>
      )}

      {certType === "Income Certificate" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div className="gn-field" style={{ margin: 0 }}>
              <label className="cr-label">House Number</label>
              <input className="gn-input" type="text" value={requestData.house_number || ""} onChange={e => handleInput("house_number", e.target.value)} />
            </div>
            <div className="gn-field" style={{ margin: 0 }}>
              <label className="cr-label">Village / Street</label>
              <input className="gn-input" type="text" value={requestData.village_street || ""} onChange={e => handleInput("village_street", e.target.value)} />
            </div>
          </div>
          <div className="gn-field">
            <label className="cr-label">Residential Address</label>
            <input className="gn-input" type="text" value={requestData.residential_address || ""} onChange={e => handleInput("residential_address", e.target.value)} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Grama Niladhari Division</label>
            <input className="gn-input" type="text" value={requestData.gn_division || ""} onChange={e => handleInput("gn_division", e.target.value)} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Samurdhi or Other Relief Received</label>
            <input className="gn-input" type="text" value={requestData.samurdhi_relief || ""} onChange={e => handleInput("samurdhi_relief", e.target.value)} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Purpose of Income Certificate</label>
            <input className="gn-input" type="text" value={requestData.income_cert_purpose || ""} onChange={e => handleInput("income_cert_purpose", e.target.value)} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Source of Income</label>
            <input className="gn-input" type="text" value={requestData.income_source || ""} onChange={e => handleInput("income_source", e.target.value)} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Registration of Income Source</label>
            <input className="gn-input" type="text" value={requestData.income_source_registration || ""} onChange={e => handleInput("income_source_registration", e.target.value)} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Address of Income Source / Business</label>
            <input className="gn-input" type="text" value={requestData.income_source_address || ""} onChange={e => handleInput("income_source_address", e.target.value)} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Period Engaged in Business / Income Source</label>
            <input className="gn-input" type="text" value={requestData.business_period || ""} onChange={e => handleInput("business_period", e.target.value)} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Will the business/income source continue in the future?</label>
            <input className="gn-input" type="text" placeholder="Yes / No / Details" value={requestData.will_continue || ""} onChange={e => handleInput("will_continue", e.target.value)} />
          </div>
          <div className="gn-field" style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <label className="cr-label" style={{ marginBottom: 0 }}>Objection from owner to issue certificate?</label>
            <label><input type="radio" checked={requestData.owner_objection === "Yes"} onChange={() => handleInput("owner_objection", "Yes")} /> Yes</label>
            <label><input type="radio" checked={requestData.owner_objection === "No"} onChange={() => handleInput("owner_objection", "No")} /> No</label>
          </div>
          <div className="gn-field" style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <label className="cr-label" style={{ marginBottom: 0 }}>Does the applicant pay tax for the stated income?</label>
            <label><input type="radio" checked={requestData.pays_tax === "Yes"} onChange={() => handleInput("pays_tax", "Yes")} /> Yes</label>
            <label><input type="radio" checked={requestData.pays_tax === "No"} onChange={() => handleInput("pays_tax", "No")} /> No</label>
          </div>
          <div className="gn-field" style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <label className="cr-label" style={{ marginBottom: 0 }}>Income certificate obtained in last 6 months?</label>
            <label><input type="radio" checked={requestData.prev_income_cert === "Yes"} onChange={() => handleInput("prev_income_cert", "Yes")} /> Yes</label>
            <label><input type="radio" checked={requestData.prev_income_cert === "No"} onChange={() => handleInput("prev_income_cert", "No")} /> No</label>
          </div>
          {requestData.prev_income_cert === "Yes" && (
            <div className="gn-field">
              <label className="cr-label">If yes, what was the stated income?</label>
              <input className="gn-input" type="text" value={requestData.prev_stated_income || ""} onChange={e => handleInput("prev_stated_income", e.target.value)} />
            </div>
          )}
          <div className="gn-field">
            <label className="cr-label">Other Remarks</label>
            <textarea className="gn-textarea" value={requestData.other_remarks || ""} onChange={e => handleInput("other_remarks", e.target.value)} rows={2} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Recommended Monthly / Annual Income (Rs.)</label>
            <input className="gn-input" type="text" value={requestData.recommended_income || ""} onChange={e => handleInput("recommended_income", e.target.value)} />
          </div>
        </>
      )}

      {certType === "Registration of delayed births" && (
        <>
          <div className="gn-field">
            <label className="cr-label">Address</label>
            <input className="gn-input" type="text" value={requestData.address || ""} onChange={e => handleInput("address", e.target.value)} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Occupation</label>
            <input className="gn-input" type="text" value={requestData.occupation || ""} onChange={e => handleInput("occupation", e.target.value)} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Passport Number</label>
            <input className="gn-input" type="text" value={requestData.passport_number || ""} onChange={e => handleInput("passport_number", e.target.value)} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Driving License Number</label>
            <input className="gn-input" type="text" value={requestData.driving_license_number || ""} onChange={e => handleInput("driving_license_number", e.target.value)} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Age</label>
            <input className="gn-input" type="text" value={requestData.age || ""} onChange={e => handleInput("age", e.target.value)} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Child's Name</label>
            <input className="gn-input" type="text" value={requestData.person_name || ""} onChange={e => handleInput("person_name", e.target.value)} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Place of Birth (Hospital/Maternity Home)</label>
            <input className="gn-input" type="text" value={requestData.birth_place || ""} onChange={e => handleInput("birth_place", e.target.value)} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Father’s Name</label>
            <input className="gn-input" type="text" value={requestData.father_name || ""} onChange={e => handleInput("father_name", e.target.value)} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Mother’s Name</label>
            <input className="gn-input" type="text" value={requestData.mother_name || ""} onChange={e => handleInput("mother_name", e.target.value)} />
          </div>
        </>
      )}

      {certType === "Registration of voluntary organizations" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "15px" }}>
            <div className="gn-field" style={{ margin: 0 }}>
              <label className="cr-label">Province</label>
              <input className="gn-input" type="text" value={requestData.province || ""} onChange={e => handleInput("province", e.target.value)} />
            </div>
            <div className="gn-field" style={{ margin: 0 }}>
              <label className="cr-label">District</label>
              <input className="gn-input" type="text" value={requestData.district || ""} onChange={e => handleInput("district", e.target.value)} />
            </div>
            <div className="gn-field" style={{ margin: 0 }}>
              <label className="cr-label">D.S. Division</label>
              <input className="gn-input" type="text" value={requestData.ds_division || ""} onChange={e => handleInput("ds_division", e.target.value)} />
            </div>
          </div>

          <div className="gn-field">
            <label className="cr-label">Name of the Organization</label>
            <input className="gn-input" type="text" value={requestData.org_name || ""} onChange={e => handleInput("org_name", e.target.value)} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Address</label>
            <textarea className="gn-textarea" value={requestData.org_address || ""} onChange={e => handleInput("org_address", e.target.value)} rows={2} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Subject/Nature of Organization</label>
            <input className="gn-input" type="text" value={requestData.org_nature || ""} onChange={e => handleInput("org_nature", e.target.value)} />
          </div>
          <div className="gn-field">
            <label className="cr-label">Date of Commencement</label>
            <input className="gn-input" type="date" value={requestData.commencement_date || ""} onChange={e => handleInput("commencement_date", e.target.value)} />
          </div>

          <h5 style={{ margin: "20px 0 10px", fontSize: "0.9rem" }}>Key Officials</h5>
          <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 1fr 150px", gap: "10px", marginBottom: "5px", fontWeight: "bold", fontSize: "0.8rem", color: "#64748b" }}>
             <div>Role</div><div>Name</div><div>Address</div><div>Phone</div>
          </div>
          {["President", "Secretary", "Treasurer"].map(role => {
             const keyPrefix = role.toLowerCase();
             return (
               <div key={role} style={{ display: "grid", gridTemplateColumns: "80px 1fr 1fr 150px", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                 <div style={{ fontSize: "0.85rem", fontWeight: "bold" }}>{role}</div>
                 <input className="gn-input" style={{ margin: 0 }} type="text" placeholder="Name" value={requestData[`${keyPrefix}_name`] || ""} onChange={e => handleInput(`${keyPrefix}_name`, e.target.value)} />
                 <input className="gn-input" style={{ margin: 0 }} type="text" placeholder="Address" value={requestData[`${keyPrefix}_address`] || ""} onChange={e => handleInput(`${keyPrefix}_address`, e.target.value)} />
                 <input className="gn-input" style={{ margin: 0 }} type="text" placeholder="Phone" value={requestData[`${keyPrefix}_phone`] || ""} onChange={e => handleInput(`${keyPrefix}_phone`, e.target.value)} />
               </div>
             )
          })}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "15px" }}>
            <div className="gn-field" style={{ margin: 0 }}>
              <label className="cr-label">Bank Account Number</label>
              <input className="gn-input" type="text" value={requestData.bank_account_number || ""} onChange={e => handleInput("bank_account_number", e.target.value)} />
            </div>
            <div className="gn-field" style={{ margin: 0 }}>
              <label className="cr-label">Branch</label>
              <input className="gn-input" type="text" value={requestData.bank_branch || ""} onChange={e => handleInput("bank_branch", e.target.value)} />
            </div>
          </div>
          <div className="gn-field" style={{ marginTop: "15px" }}>
            <label className="cr-label">Programs Conducted During the Last Six Months</label>
            <textarea className="gn-textarea" value={requestData.programs_conducted || ""} onChange={e => handleInput("programs_conducted", e.target.value)} rows={3} />
          </div>
        </>
      )}

      {certType === "Request for financial assistance from the President's fund for medical treatment" && (
        <>
          {/* ── Section 01: Patient Information ── */}
          <h4 style={{ margin: "20px 0 12px", color: "#334155", borderBottom: "2px solid #cbd5e1", paddingBottom: "6px", fontSize: "0.95rem", fontWeight: 700 }}>01. Patient's Information</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div className="gn-field" style={{ margin: 0 }}>
              <label className="cr-label" style={{ fontSize: "0.84rem" }}>01.1 Full Name</label>
              <input className="gn-input" style={{ margin: 0 }} type="text" value={requestData.patient_name || ""} onChange={e => handleInput("patient_name", e.target.value)} />
            </div>
            <div className="gn-field" style={{ margin: 0 }}>
              <label className="cr-label" style={{ fontSize: "0.84rem" }}>01.2 NIC Number</label>
              <input className="gn-input" style={{ margin: 0 }} type="text" value={requestData.patient_nic || ""} onChange={e => handleInput("patient_nic", e.target.value)} />
            </div>
            <div className="gn-field" style={{ margin: 0, gridColumn: "1 / -1" }}>
              <label className="cr-label" style={{ fontSize: "0.84rem" }}>01.3 Residential Address</label>
              <textarea className="gn-textarea" style={{ margin: 0 }} value={requestData.patient_address || ""} onChange={e => handleInput("patient_address", e.target.value)} rows={2} />
            </div>
            <div className="gn-field" style={{ margin: 0 }}>
              <label className="cr-label" style={{ fontSize: "0.84rem" }}>01.4 House Number</label>
              <input className="gn-input" style={{ margin: 0 }} type="text" value={requestData.patient_house_no || ""} onChange={e => handleInput("patient_house_no", e.target.value)} />
            </div>
            <div className="gn-field" style={{ margin: 0 }}>
              <label className="cr-label" style={{ fontSize: "0.84rem" }}>01.5 Village / Street</label>
              <input className="gn-input" style={{ margin: 0 }} type="text" value={requestData.patient_village || ""} onChange={e => handleInput("patient_village", e.target.value)} />
            </div>
            <div className="gn-field" style={{ margin: 0 }}>
              <label className="cr-label" style={{ fontSize: "0.84rem" }}>01.6 Grama Niladhari Division</label>
              <input className="gn-input" style={{ margin: 0 }} type="text" value={requestData.patient_gn_division || ""} onChange={e => handleInput("patient_gn_division", e.target.value)} />
            </div>
            <div className="gn-field" style={{ margin: 0 }}>
              <label className="cr-label" style={{ fontSize: "0.84rem" }}>01.7 Marital Status</label>
              <select className="gn-input gn-select" style={{ margin: 0 }} value={requestData.patient_marital_status || ""} onChange={e => handleInput("patient_marital_status", e.target.value)}>
                <option value="">Select</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Widowed">Widowed</option>
                <option value="Divorced">Divorced</option>
              </select>
            </div>
          </div>

          {/* ── Section 02: Family Income ── */}
          <h4 style={{ margin: "30px 0 10px", color: "#334155", borderBottom: "2px solid #cbd5e1", paddingBottom: "6px", fontSize: "0.95rem", fontWeight: 700 }}>02. Monthly Income Details of the Patient's Family Members</h4>
          <FamilyIncomeTable requestData={requestData} setRequestData={setRequestData} />

          {/* ── Section 03: Assets ── */}
          <h4 style={{ margin: "30px 0 10px", color: "#334155", borderBottom: "2px solid #cbd5e1", paddingBottom: "6px", fontSize: "0.95rem", fontWeight: 700 }}>03. Movable / Immovable Assets and Market Value</h4>
          <PropertyAssetTable requestData={requestData} setRequestData={setRequestData} />

          {/* ── Section 04: Bank Deposits ── */}
          <h4 style={{ margin: "30px 0 10px", color: "#334155", borderBottom: "2px solid #cbd5e1", paddingBottom: "6px", fontSize: "0.95rem", fontWeight: 700 }}>04. Fixed / Current Bank Account Deposits</h4>
          <BankDepositsTable requestData={requestData} setRequestData={setRequestData} />

          {/* ── Section 05: Cost Sources ── */}
          <h4 style={{ margin: "30px 0 10px", color: "#334155", borderBottom: "2px solid #cbd5e1", paddingBottom: "6px", fontSize: "0.95rem", fontWeight: 700 }}>05. Sources of Funds Raised for Treatment Expenses</h4>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem", marginBottom: "10px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f1f5f9" }}>
                <th style={{ border: "1px solid #e2e8f0", padding: "8px", textAlign: "center", width: "40px", fontWeight: 600, color: "#374151" }}>No.</th>
                <th style={{ border: "1px solid #e2e8f0", padding: "8px", textAlign: "left", fontWeight: 600, color: "#374151" }}>Source of Funds / Assistance</th>
                <th style={{ border: "1px solid #e2e8f0", padding: "8px", textAlign: "left", fontWeight: 600, color: "#374151", width: "170px" }}>Amount (Rs.)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { key: "cost_personal", label: "Personal Resources / Assets" },
                { key: "cost_etf", label: "Employees' Trust Fund (ETF)" },
                { key: "cost_nitf", label: "National Insurance Trust Fund (NITF)" },
                { key: "cost_workplace", label: "Workplace Medical Assistance Scheme" },
                { key: "cost_insurance", label: "Insurance or Welfare Schemes" },
                { key: "cost_ngos", label: "Non-Governmental Organizations (NGOs)" },
                { key: "cost_donations", label: "Other Donations" },
                { key: "cost_loans", label: "Loans" },
                { key: "cost_others", label: "Others (Please specify the source clearly)" },
              ].map((row, idx) => (
                <tr key={row.key}>
                  <td style={{ border: "1px solid #e2e8f0", padding: "6px", textAlign: "center", color: "#64748b" }}>{idx + 1}</td>
                  <td style={{ border: "1px solid #e2e8f0", padding: "6px" }}>{row.label}</td>
                  <td style={{ border: "1px solid #e2e8f0", padding: "4px" }}>
                    <input className="gn-input" style={{ margin: 0, width: "100%", boxSizing: "border-box" }} type="number" min="0" placeholder="0.00" value={requestData[row.key] || ""} onChange={e => handleInput(row.key, e.target.value)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="gn-field">
            <label className="cr-label" style={{ fontSize: "0.84rem", marginBottom: "4px" }}>Others — Please specify source and amount clearly</label>
            <textarea className="gn-textarea" style={{ fontSize: "0.85rem" }} value={requestData.cost_other_details || ""} onChange={e => handleInput("cost_other_details", e.target.value)} rows={2} />
          </div>

          {/* ── Section 06: Previous Assistance ── */}
          <h4 style={{ margin: "30px 0 10px", color: "#334155", borderBottom: "2px solid #cbd5e1", paddingBottom: "6px", fontSize: "0.95rem", fontWeight: 700 }}>06. Previous Assistance from the President's Fund</h4>
          <div style={{ display: "flex", gap: "15px", alignItems: "center", marginBottom: "12px" }}>
            <label className="cr-label" style={{ marginBottom: 0, whiteSpace: "nowrap" }}>Have you received assistance before?</label>
            <label style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>
              <input type="radio" checked={requestData.prev_assistance === "Yes"} onChange={() => handleInput("prev_assistance", "Yes")} /> Yes
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>
              <input type="radio" checked={!requestData.prev_assistance || requestData.prev_assistance === "No"} onChange={() => handleInput("prev_assistance", "No")} /> No
            </label>
          </div>
          {requestData.prev_assistance === "Yes" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", padding: "12px 14px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "6px", marginBottom: "12px" }}>
              <div className="gn-field" style={{ margin: 0 }}>
                <label className="cr-label" style={{ fontSize: "0.84rem" }}>Amount Received (Rs.)</label>
                <input className="gn-input" style={{ margin: 0 }} type="number" min="0" value={requestData.prev_amount || ""} onChange={e => handleInput("prev_amount", e.target.value)} />
              </div>
              <div className="gn-field" style={{ margin: 0 }}>
                <label className="cr-label" style={{ fontSize: "0.84rem" }}>Date</label>
                <input className="gn-input" style={{ margin: 0 }} type="date" value={requestData.prev_date || ""} onChange={e => handleInput("prev_date", e.target.value)} />
              </div>
              <div className="gn-field" style={{ margin: 0 }}>
                <label className="cr-label" style={{ fontSize: "0.84rem" }}>Illness / Treatment</label>
                <input className="gn-input" style={{ margin: 0 }} type="text" value={requestData.prev_illness || ""} onChange={e => handleInput("prev_illness", e.target.value)} />
              </div>
              <div className="gn-field" style={{ margin: 0 }}>
                <label className="cr-label" style={{ fontSize: "0.84rem" }}>File Number</label>
                <input className="gn-input" style={{ margin: 0 }} type="text" value={requestData.prev_file_number || ""} onChange={e => handleInput("prev_file_number", e.target.value)} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function CertificateRequest() {
  const { t } = useTranslation();
  /* Form state */
  const [certType, setCertType] = useState("");
  const [purpose, setPurpose] = useState("");
  const [nicNumber, setNicNumber] = useState("");
  const [requestData, setRequestData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  /* Auto-fill state */
  const [autoFilled, setAutoFilled] = useState(false);
  const [autoFillLoading, setAutoFillLoading] = useState(false);

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
  const [downloadError, setDownloadError] = useState("");

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

  const handleCertTypeChange = async (e) => {
    const newType = e.target.value;
    setCertType(newType);
    setRequestData({});
    setAutoFilled(false);

    if (!newType) return;

    // Attempt to auto-fill from the user's most recent submission of this type
    setAutoFillLoading(true);
    try {
      const res = await api.get("/api/certificate/my/latest", {
        params: { cert_type: newType },
      });
      if (res.data.ok && res.data.found) {
        if (res.data.purpose) setPurpose(res.data.purpose);
        if (res.data.nic_number) setNicNumber(res.data.nic_number);
        if (res.data.request_data && Object.keys(res.data.request_data).length > 0) {
          setRequestData(res.data.request_data);
        }
        setAutoFilled(true);
      }
    } catch {
      // Silently ignore — auto-fill is best-effort
    } finally {
      setAutoFillLoading(false);
    }
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
      setAutoFilled(false);
      loadRequests();
    } catch (ex) {
      setSubmitError(ex.response?.data?.error || "Failed to submit request.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownload = async (requestId) => {
    setDownloading(requestId);
    setDownloadError("");
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
    } catch (ex) {
      // When responseType is "blob", error bodies come as Blobs — read them as text
      let errorMsg = "Failed to generate the certificate PDF. Please try again.";
      try {
        const errBlob = ex.response?.data;
        if (errBlob instanceof Blob) {
          const text = await errBlob.text();
          const json = JSON.parse(text);
          if (json?.error) errorMsg = json.error;
        } else if (ex.response?.data?.error) {
          errorMsg = ex.response.data.error;
        } else if (ex.message) {
          errorMsg = ex.message;
        }
      } catch (_) { /* ignore secondary parse errors */ }
      setDownloadError(`Download failed for request #${requestId}: ${errorMsg}`);
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
            <div className="gn-title">{t('dashboard.title')}</div>
            <div className="gn-subtitle">{t('dashboard.subtitle')}</div>
          </div>
        </div>
        <div className="gn-header-right" style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <LanguageSwitcher />
          <Link to="/about" className="gn-about-btn">{t('nav.aboutUs')}</Link>
          <NotificationDropdown />
          <CitizenProfileDropdown />
        </div>
      </header>

      {/* Nav */}
      <nav className="gn-nav">
        <Link to="/citizen" className="gn-nav-item"><IconHome /><span>{t('nav.home')}</span></Link>
        <Link to="/household" className="gn-nav-item"><IconUser /><span>{t('nav.household')}</span></Link>
        <Link to="/certificates" className="gn-nav-item gn-nav-active"><IconDoc /><span>{t('nav.certificates')}</span></Link>
        <Link to="/complaints" className="gn-nav-item"><IconComplaint /><span>{t('nav.complaints')}</span></Link>
        <Link to="/notices" className="gn-nav-item"><IconBell /><span>{t('nav.notices')}</span></Link>
      </nav>

      {/* Content */}
      <main className="gn-content">
        <div className="gn-form-wrap">
          <h2 className="gn-form-title">Certificate Request Form</h2>
          <p className="gn-form-sub">Submit a request for official certificates issued by the Grama Niladhari office.</p>

          {submitSuccess && <div className="cr-alert cr-alert-ok">{submitSuccess}</div>}
          {submitError && <div className="cr-alert cr-alert-err">{submitError}</div>}
          {downloadError && (
            <div className="cr-alert cr-alert-err" style={{ marginTop: "10px" }}>
              ⚠️ {downloadError}
              <button
                onClick={() => setDownloadError("")}
                style={{ marginLeft: "12px", background: "none", border: "none", cursor: "pointer", color: "#991b1b", fontWeight: 700, fontSize: "1rem" }}
              >✕</button>
            </div>
          )}

          <form className="gn-form-grid" onSubmit={handleSubmit}>
            {/* Left column */}
            <div className="gn-left-col">

              {/* Auto-fill notice banner */}
              {autoFillLoading && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", marginBottom: "14px", fontSize: "0.85rem", color: "#166534" }}>
                  <svg style={{ flexShrink: 0, animation: "spin 1s linear infinite" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round"/></svg>
                  Checking for previous data…
                </div>
              )}

              {autoFilled && !autoFillLoading && (
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px", padding: "12px 14px", background: "#f0fdf4", border: "1.5px solid #16a34a", borderLeft: "5px solid #16a34a", borderRadius: "8px", marginBottom: "14px", fontSize: "0.85rem", color: "#166534" }}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                    <span style={{ fontSize: "1.1rem", lineHeight: 1, marginTop: "1px" }}>📋</span>
                    <div>
                      <strong style={{ display: "block", marginBottom: "3px", fontSize: "0.88rem" }}>Auto-filled from your previous request</strong>
                      <span style={{ color: "#15803d" }}>All fields have been pre-populated with your last submitted data for this certificate type. You can edit any field before submitting.</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    title="Clear auto-fill"
                    onClick={() => {
                      setRequestData({});
                      setPurpose("");
                      setNicNumber(myNic);
                      setAutoFilled(false);
                    }}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#15803d", fontSize: "1.2rem", lineHeight: 1, padding: "0 2px", flexShrink: 0 }}
                  >✕</button>
                </div>
              )}

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

              {certType !== "Registration of delayed births" && certType !== "Registration of voluntary organizations" && (
                <div className="gn-field">
                  <label className="cr-label">Purpose / Additional Information</label>
                  <textarea className="gn-textarea" placeholder="Describe the purpose of the certificate request…" value={purpose} onChange={e => setPurpose(e.target.value)} rows={3} />
                </div>
              )}

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
