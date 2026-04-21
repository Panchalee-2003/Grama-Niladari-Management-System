import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/api";

// ── Standalone verify page (no auth required) ──────────────────
export default function CertificateVerify() {
  const { certId } = useParams();
  const [state, setState] = useState("loading"); // loading | valid | invalid | error
  const [certificate, setCertificate] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!certId) {
      setState("invalid");
      return;
    }
    api
      .get(`/api/certificate/verify/${certId}`)
      .then((r) => {
        if (r.data.ok && r.data.valid) {
          setCertificate(r.data.certificate);
          setState("valid");
        } else {
          setState("invalid");
          setErrorMsg(
            r.data.error ||
              "Certificate is not valid or has not been approved.",
          );
        }
      })
      .catch((ex) => {
        if (ex.response?.status === 404) {
          setState("invalid");
          setErrorMsg(
            "Certificate not found. It may have been tampered with or does not exist.",
          );
        } else {
          setState("error");
          setErrorMsg("Unable to verify at this time. Please try again later.");
        }
      });
  }, [certId]);

  const fmtDate = (ts) => {
    if (!ts) return "—";
    return new Date(ts).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Logo / Header */}
        <div style={styles.logoRow}>
          <div style={styles.logoCircle}>GN</div>
          <div>
            <div style={styles.logoTitle}>Grama Niladhari</div>
            <div style={styles.logoSub}>Digital Certificate Verification</div>
          </div>
        </div>

        {state === "loading" && (
          <div style={styles.centerBlock}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Verifying certificate…</p>
          </div>
        )}

        {state === "valid" && certificate && (
          <>
            <div style={styles.validBanner}>
              <span style={styles.validIcon}>✅</span>
              <span style={styles.validText}>CERTIFICATE IS VALID</span>
            </div>
            <div style={styles.detailsGrid}>
              <Row label="Certificate Type" value={certificate.cert_type} />
              <Row label="Issued To" value={certificate.issued_to} />
              <Row label="Requested By" value={certificate.citizen_name} />
              <Row label="Date Issued" value={fmtDate(certificate.issued_at)} />
              <Row
                label="Status"
                value={<span style={styles.approvedPill}>APPROVED</span>}
              />
              <Row
                label="Certificate ID"
                value={
                  <code style={styles.code}>{certificate.certificate_id}</code>
                }
              />
            </div>
            <p style={styles.footerNote}>
              This certificate was issued by the Grama Niladhari Digital System.
              The information above confirms its authenticity.
            </p>
          </>
        )}

        {state === "invalid" && (
          <>
            <div
              style={{
                ...styles.validBanner,
                background: "#fff5f5",
                border: "1.5px solid #f5c6cb",
              }}
            >
              <span style={styles.validIcon}>❌</span>
              <span style={{ ...styles.validText, color: "#721c24" }}>
                INVALID CERTIFICATE
              </span>
            </div>
            <p style={styles.errorMsg}>
              {errorMsg || "This certificate could not be verified."}
            </p>
            <p style={styles.footerNote}>
              If you believe this is an error, please contact your local Grama
              Niladhari office with the original document.
            </p>
          </>
        )}

        {state === "error" && (
          <>
            <div
              style={{
                ...styles.validBanner,
                background: "#fff8e1",
                border: "1.5px solid #ffe082",
              }}
            >
              <span style={styles.validIcon}>⚠️</span>
              <span style={{ ...styles.validText, color: "#7a5c00" }}>
                VERIFICATION UNAVAILABLE
              </span>
            </div>
            <p style={styles.errorMsg}>{errorMsg}</p>
          </>
        )}

        <div style={styles.certIdBox}>
          <span style={styles.certIdLabel}>Certificate ID being verified:</span>
          <code
            style={{ ...styles.code, fontSize: "10px", wordBreak: "break-all" }}
          >
            {certId}
          </code>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={styles.row}>
      <span style={styles.rowLabel}>{label}</span>
      <span style={styles.rowValue}>{value}</span>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #0c7a3b 0%, #0a5a2c 50%, #073d1d 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  card: {
    background: "#fff",
    borderRadius: "20px",
    padding: "32px 28px",
    maxWidth: "480px",
    width: "100%",
    boxShadow: "0 24px 80px rgba(0,0,0,0.3)",
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "24px",
    paddingBottom: "20px",
    borderBottom: "2px solid #f0f4f1",
  },
  logoCircle: {
    width: "46px",
    height: "46px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #0c7a3b, #0a5a2c)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    fontSize: "16px",
    flexShrink: 0,
  },
  logoTitle: {
    fontWeight: "800",
    fontSize: "15px",
    color: "#111",
    lineHeight: "1.2",
  },
  logoSub: {
    fontSize: "11.5px",
    color: "#888",
    marginTop: "2px",
  },
  centerBlock: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "24px 0",
    gap: "14px",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #e0f0e8",
    borderTop: "4px solid #0c7a3b",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    color: "#666",
    fontSize: "14px",
    margin: 0,
  },
  validBanner: {
    background: "#e8f5ee",
    border: "1.5px solid #b3ddbf",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 18px",
    marginBottom: "20px",
  },
  validIcon: {
    fontSize: "22px",
    lineHeight: "1",
  },
  validText: {
    fontWeight: "900",
    fontSize: "14.5px",
    color: "#0c7a3b",
    letterSpacing: "0.5px",
  },
  detailsGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "0",
    background: "#fafbfa",
    borderRadius: "10px",
    overflow: "hidden",
    border: "1px solid #e6ece8",
    marginBottom: "16px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "10px 16px",
    borderBottom: "1px solid #eef1ee",
    gap: "12px",
  },
  rowLabel: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#666",
    flexShrink: 0,
    width: "130px",
  },
  rowValue: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#111",
    textAlign: "right",
    wordBreak: "break-word",
  },
  approvedPill: {
    background: "#d4edda",
    color: "#155724",
    borderRadius: "20px",
    padding: "2px 10px",
    fontSize: "11px",
    fontWeight: "800",
  },
  code: {
    background: "#f0f3f0",
    border: "1px solid #dde4dd",
    borderRadius: "4px",
    padding: "2px 5px",
    fontSize: "11px",
    fontFamily: "monospace",
  },
  errorMsg: {
    color: "#555",
    fontSize: "13.5px",
    lineHeight: "1.6",
    marginBottom: "16px",
    textAlign: "center",
  },
  footerNote: {
    color: "#888",
    fontSize: "11.5px",
    lineHeight: "1.6",
    textAlign: "center",
    marginBottom: "16px",
  },
  certIdBox: {
    borderTop: "1px solid #eee",
    paddingTop: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  certIdLabel: {
    fontSize: "10.5px",
    color: "#bbb",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
};
