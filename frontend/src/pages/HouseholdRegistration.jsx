import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/householdRegistration.css";

import emblem from "../assets/emblem.png";

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
      <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="#1f1f1f" strokeWidth="2"/>
      <path d="M4 20a8 8 0 0 1 16 0" stroke="#1f1f1f" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
function IconDoc() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
      <path d="M7 3h7l3 3v15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" stroke="#1f1f1f" strokeWidth="2"/>
      <path d="M14 3v4h4" stroke="#1f1f1f" strokeWidth="2"/>
    </svg>
  );
}
function IconComplaint() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
      <path d="M7 3h10a2 2 0 0 1 2 2v16l-4-2-4 2-4-2-4 2V5a2 2 0 0 1 2-2Z" stroke="#1f1f1f" strokeWidth="2"/>
      <path d="M8 7h8M8 11h8M8 15h6" stroke="#1f1f1f" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
function IconBell() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z" stroke="#1f1f1f" strokeWidth="2"/>
      <path d="M9.5 19a2.5 2.5 0 0 0 5 0" stroke="#1f1f1f" strokeWidth="2" strokeLinecap="round"/>
    </svg>
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

export default function HouseholdRegistration() {
  const [agree, setAgree] = useState(false);

  // household basic info (UI only)
  const [house, setHouse] = useState({
    holder_name: "",
    phone: "",
    house_no: "",
    address: "",
    electricity: "",
    water: "",
  });

  // ✅ dynamic members
  const [members, setMembers] = useState([emptyMember()]);

  // financial (UI only)
  const [fin, setFin] = useState({
    income_source: "",
    govt_aid: "",
    income_range: "",
    aid_type: "",
    notes: "",
  });

  function updateMember(index, key, value) {
    setMembers((prev) => prev.map((m, i) => (i === index ? { ...m, [key]: value } : m)));
  }

  function addMember() {
    setMembers((prev) => [...prev, emptyMember()]);
  }

  function onSubmit(e) {
    e.preventDefault();
    // UI only for now
  }

  function onReset() {
    window.location.reload();
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

        <div className="cd-top-right">
          <button className="cd-about-btn">About Us</button>
          <div className="cd-profile-circle" aria-label="profile">
            <IconUser />
          </div>
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
        <h1 className="hh-page-title">Household Registration</h1>

        <form className="hh-form" onSubmit={onSubmit}>
          {/* SECTION 1 */}
          <section className="hh-box">
            <h2 className="hh-box-title">Household basic Information</h2>

            <div className="hh-field">
              <label className="hh-label">Householder’s Full Name</label>
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
                  onChange={(e) => setHouse({ ...house, phone: e.target.value })}
                />
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
                  <button type="button" className="hh-mini">Male</button>
                  <button type="button" className="hh-mini">Female</button>
                  <button type="button" className="hh-mini">Total</button>
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

          {/* SECTION 2 - ✅ Dynamic Members */}
          <section className="hh-box">
            <h2 className="hh-box-title">Family member details</h2>

            {members.map((m, idx) => (
              <div key={idx} style={{ marginBottom: idx === members.length - 1 ? 0 : 18 }}>
                <div className="hh-member-row">
                  <div className="hh-member-label">Member {String(idx + 1).padStart(2, "0")}</div>
                </div>

                <div className="hh-field">
                  <label className="hh-label">Full Name</label>
                  <input
                    className="hh-input hh-input-lg"
                    value={m.full_name}
                    onChange={(e) => updateMember(idx, "full_name", e.target.value)}
                  />
                </div>

                <div className="hh-grid-3">
                  <div className="hh-field">
                    <label className="hh-label">Relationship To Head</label>
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
                    <label className="hh-label">NIC Number</label>
                    <input
                      className="hh-input"
                      value={m.nic}
                      onChange={(e) => updateMember(idx, "nic", e.target.value)}
                    />
                  </div>

                  <div className="hh-field">
                    <label className="hh-label">Date of Birth</label>
                    <input
                      className="hh-input"
                      value={m.dob}
                      onChange={(e) => updateMember(idx, "dob", e.target.value)}
                    />
                  </div>
                </div>

                <div className="hh-grid-3 hh-grid-last">
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

                  <div className="hh-field hh-add-wrap">
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

                    {/* ✅ only show the add button on the LAST member (same as figma position) */}
                    {idx === members.length - 1 && (
                      <button type="button" className="hh-add-btn" onClick={addMember}>
                        Add member
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
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

              <div className="hh-field">
                <label className="hh-label">If yes, Specify Type</label>
                <select
                  className="hh-select"
                  value={fin.aid_type}
                  onChange={(e) => setFin({ ...fin, aid_type: e.target.value })}
                >
                  <option value=""></option>
                  <option>Samurdhi</option>
                  <option>Elder</option>
                  <option>Disability</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
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

          {/* ACTION BUTTONS */}
          <div className="hh-actions">
            <button type="button" className="hh-btn hh-btn-reset" onClick={onReset}>
              Reset
            </button>
            <button type="submit" className="hh-btn hh-btn-submit" disabled={!agree}>
              Submit
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
