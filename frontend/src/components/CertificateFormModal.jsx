import { useState, useEffect } from "react";
import api from "../api/api";
import "../styles/certificateForm.css";

// ─── Field helpers ───────────────────────────────────────────────
function TextField({ label, name, value, onChange, placeholder, multiline, required }) {
  return (
    <div className="cf-field">
      <label className="cf-label">{label}{required && <span className="cf-req">*</span>}</label>
      {multiline ? (
        <textarea
          className="cf-input cf-textarea"
          name={name}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder || label}
          rows={3}
        />
      ) : (
        <input
          className="cf-input"
          type="text"
          name={name}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder || label}
        />
      )}
    </div>
  );
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <div className="cf-field">
      <label className="cf-label">{label}</label>
      <select className="cf-input cf-select" name={name} value={value || ""} onChange={onChange}>
        <option value="">— Select —</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function SectionTitle({ children }) {
  return <div className="cf-section-title">{children}</div>;
}

// ─── Forms per certificate type ──────────────────────────────────

function ResidenceCharacterForm({ data, onChange }) {
  return (
    <>
      <SectionTitle>1. Administrative Information</SectionTitle>
      <TextField label="District and Divisional Secretary's Division" name="district_division" value={data.district_division} onChange={onChange} />
      <TextField label="Grama Niladhari Division and Number" name="gn_division_number" value={data.gn_division_number} onChange={onChange} />
      <SelectField label="Applicant personally known to Grama Niladhari?" name="personally_known" value={data.personally_known} onChange={onChange} options={["Yes", "No"]} />
      <TextField label="If yes, since when" name="known_since" value={data.known_since} onChange={onChange} placeholder="e.g. 2015" />

      <SectionTitle>2. Information about Applicant</SectionTitle>
      <TextField label="Name and Address" name="name_address" value={data.name_address} onChange={onChange} required />
      <SelectField label="Sex" name="sex" value={data.sex} onChange={onChange} options={["Male", "Female", "Other"]} />
      <TextField label="Age" name="age" value={data.age} onChange={onChange} />
      <SelectField label="Whether Sri Lankan" name="sri_lankan" value={data.sri_lankan} onChange={onChange} options={["Yes", "No"]} />
      <TextField label="Religion" name="religion" value={data.religion} onChange={onChange} />
      <SelectField label="Civil Status" name="civil_status" value={data.civil_status} onChange={onChange} options={["Single", "Married", "Divorced", "Widowed"]} />
      <TextField label="Present Occupation" name="occupation" value={data.occupation} onChange={onChange} />
      <TextField label="Period of residence in the village" name="residence_period" value={data.residence_period} onChange={onChange} />
      <TextField label="National Identity Card No." name="nic" value={data.nic} onChange={onChange} />
      <TextField label="Number of the Electoral Register and Particulars of Registration" name="electoral_no" value={data.electoral_no} onChange={onChange} />
      <TextField label="Name and Address of the Father" name="father_name_address" value={data.father_name_address} onChange={onChange} />
      <TextField label="Purpose for which the certificate is required" name="purpose" value={data.purpose} onChange={onChange} />

      <SectionTitle>3. Other Information</SectionTitle>
      <TextField label="Period of residence in the Grama Niladhari Division" name="gn_residence_period" value={data.gn_residence_period} onChange={onChange} />
      <TextField label="Nature of other evidences in proof of the period of residence" name="evidence_nature" value={data.evidence_nature} onChange={onChange} />
      <SelectField label="Whether the Applicant has been convicted by a Court of Law?" name="convicted" value={data.convicted} onChange={onChange} options={["Yes", "No"]} />
      <SelectField label="Taken interest in public activities, social service work, community work, etc.?" name="public_activities" value={data.public_activities} onChange={onChange} options={["Yes", "No"]} />
      <TextField label="His/her character" name="character" value={data.character} onChange={onChange} placeholder="e.g. Good" />
      <TextField label="Remarks" name="remarks" value={data.remarks} onChange={onChange} multiline />

      <SectionTitle>Certification</SectionTitle>
      <TextField label="Certificate of Registration Number" name="reg_number" value={data.reg_number} onChange={onChange} />
      <TextField label="Issued by" name="issued_by" value={data.issued_by} onChange={onChange} />
      <TextField label="Grama Niladhari Name" name="gn_name" value={data.gn_name} onChange={onChange} />
      <TextField label="Divisional Secretary Name" name="div_secretary" value={data.div_secretary} onChange={onChange} />
    </>
  );
}

function IncomeForm({ data, onChange }) {
  return (
    <>
      <SectionTitle>Section 1: Applicant Details</SectionTitle>
      <TextField label="1. Name of the Applicant" name="name" value={data.name} onChange={onChange} required />
      <TextField label="2. National Identity Card (NIC) Number" name="nic" value={data.nic} onChange={onChange} />
      <TextField label="3. Residential Address" name="address" value={data.address} onChange={onChange} />
      <TextField label="4. House Number" name="house_number" value={data.house_number} onChange={onChange} />
      <TextField label="5. Village / Street" name="village_street" value={data.village_street} onChange={onChange} />
      <TextField label="6. Grama Niladhari Division" name="gn_division" value={data.gn_division} onChange={onChange} />
      <TextField label="7. Samurdhi or other relief/allowances received" name="samurdhi" value={data.samurdhi} onChange={onChange} />
      <TextField label="8. Purpose for which the Income Certificate is required" name="purpose" value={data.purpose} onChange={onChange} />

      <SectionTitle>Section 2: Income and Business Information</SectionTitle>
      <TextField label="9. Source of Income" name="income_source" value={data.income_source} onChange={onChange} />
      <TextField label="10. Registration of Income Source" name="income_reg" value={data.income_reg} onChange={onChange} />
      <TextField label="11. Address of income source location" name="income_address" value={data.income_address} onChange={onChange} />
      <TextField label="12. Period of engagement in income source/business" name="income_period" value={data.income_period} onChange={onChange} />
      <SelectField label="13. Will you continue to be engaged in this income source?" name="continue_income" value={data.continue_income} onChange={onChange} options={["Yes", "No"]} />
      <SelectField label="14. Any objection from the owner regarding income certificate based on monthly salary?" name="employer_objection" value={data.employer_objection} onChange={onChange} options={["No", "Yes"]} />
      <SelectField label="15. Is tax paid for the income mentioned?" name="tax_paid" value={data.tax_paid} onChange={onChange} options={["No", "Yes"]} />
      <SelectField label="16. Has the applicant obtained an income certificate within the last 06 months?" name="previous_cert" value={data.previous_cert} onChange={onChange} options={["No", "Yes"]} />
      <TextField label="17. If so, what was the amount of that income?" name="previous_income" value={data.previous_income} onChange={onChange} />
      <TextField label="18. Other facts" name="other_facts" value={data.other_facts} onChange={onChange} multiline />

      <SectionTitle>Section 3: Grama Niladhari Recommendation</SectionTitle>
      <TextField label="19. Recommended Monthly Income / Annual Income (Rs.)" name="recommended_income" value={data.recommended_income} onChange={onChange} required />
      <TextField label="Grama Niladhari Name & Division" name="gn_name" value={data.gn_name} onChange={onChange} />
      <TextField label="Subject Clerk" name="subject_clerk" value={data.subject_clerk} onChange={onChange} />
      <TextField label="Receipt Number" name="receipt_number" value={data.receipt_number} onChange={onChange} />
      <TextField label="Income Certificate Number" name="cert_number" value={data.cert_number} onChange={onChange} />
    </>
  );
}

function HousingLoanForm({ data, onChange }) {
  return (
    <>
      <SectionTitle>Section 1: Applicant Information</SectionTitle>
      <TextField label="01. Name of Applicant" name="name" value={data.name} onChange={onChange} required />
      <TextField label="02. Address" name="address" value={data.address} onChange={onChange} />
      <TextField label="03. Monthly Family Income (Rs.)" name="monthly_income" value={data.monthly_income} onChange={onChange} />
      <SelectField label="04. Whether a Samurdhi Beneficiary" name="samurdhi_beneficiary" value={data.samurdhi_beneficiary} onChange={onChange} options={["No", "Yes"]} />

      <SectionTitle>Section 2: Property Details</SectionTitle>
      <TextField label="Description of Property (Land/Property)" name="property_description" value={data.property_description} onChange={onChange} />
      <TextField label="Owner's Name" name="owner_name" value={data.owner_name} onChange={onChange} />
      <TextField label="Extent of Land" name="extent_of_land" value={data.extent_of_land} onChange={onChange} />
      <TextField label="Deed Number and Date" name="deed_number_date" value={data.deed_number_date} onChange={onChange} />

      <SectionTitle>Section 3: Applicant's Declaration</SectionTitle>
      <TextField label="Loan/Grant Amount Requested (Rs.)" name="loan_amount" value={data.loan_amount} onChange={onChange} />

      <SectionTitle>Section 4: Grama Niladhari Recommendation</SectionTitle>
      <TextField label="Grama Niladhari Name & Division" name="gn_name" value={data.gn_name} onChange={onChange} />

      <SectionTitle>Section 5: Housing Officer Recommendation</SectionTitle>
      <TextField label="Housing Officer Name & Division" name="housing_officer" value={data.housing_officer} onChange={onChange} />

      <SectionTitle>Section 6: Approval of Divisional Secretary</SectionTitle>
      <TextField label="Divisional Secretary Name & Division" name="div_secretary" value={data.div_secretary} onChange={onChange} />
    </>
  );
}

function BirthCertForm({ data, onChange }) {
  return (
    <>
      <SectionTitle>1. Personal Details</SectionTitle>
      <TextField label="1. Full Name" name="full_name" value={data.full_name} onChange={onChange} required />
      <TextField label="2. Address" name="address" value={data.address} onChange={onChange} />
      <TextField label="3. Occupation" name="occupation" value={data.occupation} onChange={onChange} />
      <TextField label="4i. National Identity Card (NIC) No." name="nic" value={data.nic} onChange={onChange} />
      <TextField label="4ii. Passport No." name="passport_no" value={data.passport_no} onChange={onChange} />
      <TextField label="4iii. Driving License No." name="driving_license" value={data.driving_license} onChange={onChange} />
      <TextField label="5. Age" name="age" value={data.age} onChange={onChange} />

      <SectionTitle>2. Declaration of Identity and Birth</SectionTitle>
      <TextField label="6. Name of person who submitted declaration" name="known_person" value={data.known_person} onChange={onChange} />
      <TextField label="7. Name of person born" name="born_person" value={data.born_person} onChange={onChange} />
      <TextField label="   Born at (Hospital / Maternity Home / House named)" name="born_place" value={data.born_place} onChange={onChange} />
      <TextField label="8. Father's Name" name="father_name" value={data.father_name} onChange={onChange} />
      <TextField label="   Mother's Name" name="mother_name" value={data.mother_name} onChange={onChange} />
      <TextField label="9. This birth is reported under" name="reported_under" value={data.reported_under} onChange={onChange} />

      <SectionTitle>3. Certification</SectionTitle>
      <TextField label="Grama Niladhari Name & Division" name="gn_name" value={data.gn_name} onChange={onChange} />
      <TextField label="Divisional Secretary Name & Division" name="div_secretary" value={data.div_secretary} onChange={onChange} />
    </>
  );
}

function DeathPensionerForm({ data, onChange }) {
  const [dependents, setDependents] = useState(data.dependents || [{ name: "", relationship: "", age: "" }]);

  const updateDependent = (i, field, val) => {
    const updated = dependents.map((d, idx) => idx === i ? { ...d, [field]: val } : d);
    setDependents(updated);
    onChange({ target: { name: "dependents", value: updated } });
  };

  const addDependent = () => {
    const updated = [...dependents, { name: "", relationship: "", age: "" }];
    setDependents(updated);
    onChange({ target: { name: "dependents", value: updated } });
  };

  const removeDependent = (i) => {
    const updated = dependents.filter((_, idx) => idx !== i);
    setDependents(updated);
    onChange({ target: { name: "dependents", value: updated } });
  };

  return (
    <>
      <SectionTitle>1. Personal Details of the Pensioner</SectionTitle>
      <TextField label="1. Name of the Pensioner" name="pensioner_name" value={data.pensioner_name} onChange={onChange} required />
      <TextField label="2. Address" name="address" value={data.address} onChange={onChange} />
      <TextField label="3. Date of Retirement" name="retirement_date" value={data.retirement_date} onChange={onChange} placeholder="DD/MM/YYYY" />
      <TextField label="4. National Identity Card (NIC) Number" name="nic" value={data.nic} onChange={onChange} />
      <TextField label="5. Pension Number" name="pension_number" value={data.pension_number} onChange={onChange} />
      <TextField label="6. Date of Death" name="death_date" value={data.death_date} onChange={onChange} placeholder="DD/MM/YYYY" />

      <SectionTitle>2. Information Regarding Dependents</SectionTitle>
      <div className="cf-dependents-table">
        <div className="cf-dep-header">
          <span>No.</span><span>Name</span><span>Relationship to Pensioner</span><span>Age</span><span></span>
        </div>
        {dependents.map((dep, i) => (
          <div className="cf-dep-row" key={i}>
            <span className="cf-dep-num">{i + 1}</span>
            <input className="cf-input cf-dep-input" placeholder="Name" value={dep.name} onChange={e => updateDependent(i, "name", e.target.value)} />
            <input className="cf-input cf-dep-input" placeholder="Relationship" value={dep.relationship} onChange={e => updateDependent(i, "relationship", e.target.value)} />
            <input className="cf-input cf-dep-input cf-dep-age" placeholder="Age" value={dep.age} onChange={e => updateDependent(i, "age", e.target.value)} />
            {dependents.length > 1 && (
              <button type="button" className="cf-dep-remove" onClick={() => removeDependent(i)}>✕</button>
            )}
          </div>
        ))}
        <button type="button" className="cf-dep-add" onClick={addDependent}>+ Add Dependent</button>
      </div>

      <SectionTitle>3. Certification</SectionTitle>
      <TextField label="Grama Niladhari Name & Division" name="gn_name" value={data.gn_name} onChange={onChange} />
    </>
  );
}

// ─── Label map ───────────────────────────────────────────────────
const FORM_LABELS = {
  "Residence and character Certificate": "Certificate on Residence and Character",
  "Income Certificate": "Issuance of Income Certificate",
  "Registration of delayed births": "Registration of Delayed Births – GN Report",
  "Request for financial assistance from the President's fund for medical treatment": "Request for Medical Financial Assistance",
  "Housing Loan Approval": "Application for Obtaining Housing Loan/Funds",
  "Application for obtaining housing loan funds": "Application for Obtaining Housing Loan/Funds",
  "Notification of the death of a pensioner": "Notification of the Death of a Pensioner",
};

// ─── Main Modal ──────────────────────────────────────────────────
export default function CertificateFormModal({ request, onClose }) {
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState("");
  const [certInfo, setCertInfo] = useState(null); // after PDF generated

  // Load existing saved data
  useEffect(() => {
    if (!request) return;
    api.get(`/api/certificate/${request.request_id}/data`)
      .then(r => {
        if (r.data.ok && r.data.request.certificate_data) {
          setFormData(r.data.request.certificate_data);
        } else {
          // Pre-populate from request info
          setFormData({
            nic: request.nic_number || "",
            name: request.member_name || request.citizen_name || "",
            full_name: request.member_name || request.citizen_name || "",
            pensioner_name: request.member_name || request.citizen_name || "",
            purpose: request.purpose || "",
          });
        }
      })
      .catch(() => {
        setFormData({
          nic: request.nic_number || "",
          name: request.member_name || request.citizen_name || "",
          full_name: request.member_name || request.citizen_name || "",
          pensioner_name: request.member_name || request.citizen_name || "",
          purpose: request.purpose || "",
        });
      });
  }, [request]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    setSaving(true); setError("");
    try {
      await api.patch(`/api/certificate/${request.request_id}/data`, { certificate_data: formData });
      setSaveSuccess(true);
    } catch (ex) {
      setError(ex.response?.data?.error || "Failed to save form data.");
    } finally {
      setSaving(false);
    }
  };

  const handleGeneratePDF = async () => {
    setGenerating(true); setError("");
    try {
      // Save first
      await api.patch(`/api/certificate/${request.request_id}/data`, { certificate_data: formData });

      // Stream PDF
      const response = await api.get(`/api/certificate/${request.request_id}/pdf`, {
        responseType: "blob",
      });

      // Get certificate ID from response header if present
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificate_${request.request_id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      // Refresh cert info
      const info = await api.get(`/api/certificate/${request.request_id}/data`);
      if (info.data.ok) {
        setCertInfo(info.data.request);
      }
    } catch (ex) {
      setError(ex.response?.data?.error || "Failed to generate PDF.");
    } finally {
      setGenerating(false);
    }
  };

  const renderForm = () => {
    const type = request?.cert_type;
    if (type === "Residence and character Certificate")
      return <ResidenceCharacterForm data={formData} onChange={handleChange} />;
    if (type === "Income Certificate")
      return <IncomeForm data={formData} onChange={handleChange} />;
    if (type === "Housing Loan Approval" || type === "Application for obtaining housing loan funds")
      return <HousingLoanForm data={formData} onChange={handleChange} />;
    if (type === "Registration of delayed births")
      return <BirthCertForm data={formData} onChange={handleChange} />;
    if (type === "Notification of the death of a pensioner")
      return <DeathPensionerForm data={formData} onChange={handleChange} />;
    // Other / generic
    return (
      <>
        <SectionTitle>Certificate Details</SectionTitle>
        <TextField label="Notes / Additional Information" name="notes" value={formData.notes} onChange={handleChange} multiline />
        <TextField label="Grama Niladhari Name" name="gn_name" value={formData.gn_name} onChange={handleChange} />
      </>
    );
  };

  if (!request) return null;

  const verifyUrl = certInfo?.certificate_id
    ? `${window.location.origin}/verify/${certInfo.certificate_id}`
    : null;

  return (
    <div className="cf-overlay" onClick={onClose}>
      <div className="cf-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="cf-modal-header">
          <div>
            <div className="cf-modal-badge">{request.cert_type}</div>
            <h2 className="cf-modal-title">{FORM_LABELS[request.cert_type] || request.cert_type}</h2>
            <div className="cf-modal-meta">
              Request #{request.request_id} &nbsp;·&nbsp; {request.citizen_name}
              {request.member_name && <> &nbsp;→&nbsp; {request.member_name}</>}
            </div>
          </div>
          <button className="cf-close" onClick={onClose}>✕</button>
        </div>

        {/* Form body */}
        <div className="cf-body">
          {renderForm()}
        </div>

        {/* Certificate ID & QR display after generation */}
        {certInfo?.certificate_id && (
          <div className="cf-cert-info">
            <div className="cf-cert-info-label">📄 Certificate Issued</div>
            <div className="cf-cert-id">ID: <code>{certInfo.certificate_id}</code></div>
            <div className="cf-cert-verify">
              Verify URL: <a href={verifyUrl} target="_blank" rel="noreferrer">{verifyUrl}</a>
            </div>
            <img
              className="cf-qr-preview"
              src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(verifyUrl)}`}
              alt="QR Code"
            />
          </div>
        )}

        {/* Messages */}
        {saveSuccess && <div className="cf-success">✓ Form data saved successfully.</div>}
        {error && <div className="cf-error">{error}</div>}

        {/* Actions */}
        <div className="cf-footer">
          <button className="cf-btn cf-btn-save" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "💾 Save Form"}
          </button>
          <button className="cf-btn cf-btn-generate" onClick={handleGeneratePDF} disabled={generating}>
            {generating ? "Generating…" : "📄 Generate & Download PDF"}
          </button>
          <button className="cf-btn cf-btn-cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
