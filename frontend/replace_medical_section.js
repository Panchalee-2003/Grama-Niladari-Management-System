const fs = require("fs");
const file = "./src/pages/CertificateRequest.jsx";
let code = fs.readFileSync(file, "utf8");

const START_MARKER = `      {certType === "Request for financial assistance from the President's fund for medical treatment" && (`;
const END_MARKER_AFTER = `        </>
      )}
    </div>
  );
}

export default function CertificateRequest`;

const startIdx = code.indexOf(START_MARKER);
const endIdx = code.indexOf(END_MARKER_AFTER);

if (startIdx === -1 || endIdx === -1) {
  console.error(
    "Could not find markers! startIdx:",
    startIdx,
    "endIdx:",
    endIdx,
  );
  process.exit(1);
}

// endIdx points to the start of `        </>`, we want to include `        </>` + `\n      )}`
// The END_MARKER_AFTER starts with `        </>` so endIdx is exactly where we want to stop
const beforeSection = code.substring(0, startIdx);
const afterSection = code.substring(endIdx);

const newSection = `      {certType === "Request for financial assistance from the President's fund for medical treatment" && (
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
`;

const newCode = beforeSection + newSection + afterSection;
fs.writeFileSync(file, newCode, "utf8");
console.log("Done! Section replaced successfully.");
