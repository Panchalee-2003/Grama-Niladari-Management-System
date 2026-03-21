import React from "react";
import "../styles/citizenDashboard.css";

const Footer = () => {
  return (
    <footer className="cd-footer">
      <div className="cd-footer-grid">
        <div>
          <h4>Contact Information</h4>
          <p>Grama Niladhari officer, Maspanna</p>
          <p>Phone: 0768187908</p>
          <p>Email: chasara88@gmail.com</p>
        </div>

        <div>
          <h4>Office Hours</h4>
          <p>Tuesday 08:15 to 16:30</p>
          <p>Thursday 08:15 to 16:30</p>
          <p>Saturday 08:15 to 12:30</p>
        </div>

        <div>
          <h4>Quick links</h4>
          <p className="cd-footer-link">Citizen Login</p>
          <p className="cd-footer-link">New Registration</p>
          <p className="cd-footer-link">Complaints</p>
        </div>
      </div>

      <div className="cd-footer-line" />

      <div className="cd-footer-copy">
        © 2025 Grama Niladhari Division - Maspanna. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
