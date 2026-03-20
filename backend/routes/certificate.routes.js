const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { requireAuth, requireRole } = require("../middleware/auth.middleware");
const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const crypto = require("crypto");
const { sendVisitNotification, sendRejectionNotification, sendApprovalNotification } = require("../services/email.service");

// Certificate types that require DS (Divisional Secretary) approval
const DS_APPROVAL_TYPES = [
    "Housing Loan Approval",
    "Application for obtaining housing loan funds",
    "Request for financial assistance from the President's fund for medical treatment",
];

const CERT_TYPES = [
    "Residence and character Certificate",
    "Income Certificate",
    "Registration of delayed births",
    "Request for financial assistance from the President's fund for medical treatment",
    "Housing Loan Approval",
    "Application for obtaining housing loan funds",
    "Notification of the death of a pensioner",
];

// ─────────────────────────────────────────
// CITIZEN: Get my family members (for dropdown)
// ─────────────────────────────────────────
router.get("/my-members", requireAuth, requireRole("CITIZEN"), async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await pool.query(
            `SELECT fm.member_id, fm.full_name, fm.nic_number, fm.relationship_to_head
       FROM family_member fm
       JOIN household h ON h.household_id = fm.household_id
       JOIN citizen c ON c.citizen_id = h.citizen_id
       WHERE c.user_id = $1
       ORDER BY fm.member_id ASC`,
            [userId]
        );
        return res.json({ ok: true, members: result.rows });
    } catch (err) {
        console.error("My Members Error:", err);
        return res.status(500).json({ ok: false, error: err.message });
    }
});

// ─────────────────────────────────────────
// CITIZEN: Submit a certificate request
// ─────────────────────────────────────────
router.post("/", requireAuth, requireRole("CITIZEN"), async (req, res) => {
    try {
        const userId = req.user.id;
        const { cert_type, purpose, nic_number } = req.body;

        if (!cert_type || !CERT_TYPES.includes(cert_type))
            return res.status(400).json({ ok: false, error: "Invalid certificate type" });

        if (!nic_number)
            return res.status(400).json({ ok: false, error: "Please enter your NIC number or your family member's NIC number" });

        const citizenRow = await pool.query(
            "SELECT citizen_id, nic_number FROM citizen WHERE user_id=$1 LIMIT 1",
            [userId]
        );
        if (!citizenRow.rows.length)
            return res.status(400).json({ ok: false, error: "Citizen profile not found" });

        const citizen = citizenRow.rows[0];
        const citizen_id = citizen.citizen_id;

        let family_member_id = null;

        if (citizen.nic_number !== nic_number) {
            const memberCheck = await pool.query(
                `SELECT fm.member_id FROM family_member fm
                 JOIN household h ON h.household_id = fm.household_id
                 WHERE fm.nic_number = $1 AND h.citizen_id = $2 LIMIT 1`,
                [nic_number, citizen_id]
            );
            if (!memberCheck.rows.length)
                return res.status(400).json({ ok: false, error: "No citizen or family member found with the provided NIC number in your household" });

            family_member_id = memberCheck.rows[0].member_id;
        }

        const result = await pool.query(
            `INSERT INTO certificate_request (citizen_id, cert_type, purpose, family_member_id, nic_number, status, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,'PENDING',NOW(),NOW())
       RETURNING request_id, cert_type, purpose, status, created_at`,
            [citizen_id, cert_type, purpose?.trim() || null, family_member_id, nic_number]
        );

        return res.status(201).json({ ok: true, request: result.rows[0] });
    } catch (err) {
        console.error("Submit Cert Request Error:", err);
        return res.status(500).json({ ok: false, error: err.message });
    }
});

// ─────────────────────────────────────────
// CITIZEN: List my own requests
// ─────────────────────────────────────────
router.get("/my", requireAuth, requireRole("CITIZEN"), async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await pool.query(
            `SELECT cr.request_id, cr.cert_type, cr.purpose, cr.nic_number,
              cr.status, cr.gn_note, cr.gn_remarks, cr.created_at, cr.updated_at,
              cr.certificate_id, cr.issued_at,
              cr.appointment_date, cr.required_documents_list, cr.rejection_reason,
              fm.full_name AS member_name, fm.nic_number AS member_nic,
              fm.relationship_to_head
       FROM certificate_request cr
       JOIN citizen c ON c.citizen_id = cr.citizen_id
       LEFT JOIN family_member fm ON fm.member_id = cr.family_member_id
       WHERE c.user_id = $1
       ORDER BY cr.created_at DESC`,
            [userId]
        );
        return res.json({ ok: true, requests: result.rows });
    } catch (err) {
        console.error("My Cert Requests Error:", err);
        return res.status(500).json({ ok: false, error: err.message });
    }
});

// ─────────────────────────────────────────
// PUBLIC: Verify certificate by UUID
// ─────────────────────────────────────────
router.get("/verify/:cert_uuid", async (req, res) => {
    try {
        const { cert_uuid } = req.params;
        const result = await pool.query(
            `SELECT cr.request_id, cr.cert_type, cr.certificate_id, cr.issued_at,
                    cr.nic_number, cr.status,
                    COALESCE(fm.full_name, c.full_name) AS issued_to,
                    c.full_name AS citizen_name
             FROM certificate_request cr
             JOIN citizen c ON c.citizen_id = cr.citizen_id
             LEFT JOIN family_member fm ON fm.member_id = cr.family_member_id
             WHERE cr.certificate_id = $1`,
            [cert_uuid]
        );
        if (!result.rows.length) {
            return res.status(404).json({ ok: false, valid: false, error: "Certificate not found" });
        }
        const cert = result.rows[0];
        return res.json({
            ok: true,
            valid: cert.status === "APPROVED",
            certificate: {
                request_id: cert.request_id,
                cert_type: cert.cert_type,
                certificate_id: cert.certificate_id,
                issued_to: cert.issued_to,
                citizen_name: cert.citizen_name,
                issued_at: cert.issued_at,
                status: cert.status,
            },
        });
    } catch (err) {
        console.error("Verify Cert Error:", err);
        return res.status(500).json({ ok: false, error: err.message });
    }
});

// ─────────────────────────────────────────
// GN & ADMIN: List all requests (filter by status)
// ─────────────────────────────────────────
router.get("/all", requireAuth, requireRole("GN", "ADMIN"), async (req, res) => {
    try {
        const { status } = req.query;
        let q = `
      SELECT cr.request_id, cr.cert_type, cr.purpose, cr.nic_number,
             cr.status, cr.admin_status, cr.gn_note, cr.gn_remarks,
             cr.appointment_date, cr.required_documents_list, cr.rejection_reason,
             cr.created_at, cr.updated_at,
             cr.certificate_id, cr.issued_at,
             c.full_name AS citizen_name, c.nic_number AS citizen_nic,
             fm.member_id, fm.full_name AS member_name,
             fm.nic_number AS member_nic, fm.relationship_to_head
      FROM certificate_request cr
      JOIN citizen c ON c.citizen_id = cr.citizen_id
      LEFT JOIN family_member fm ON fm.member_id = cr.family_member_id
    `;
        const params = [];
        if (status && status !== "ALL") {
            q += " WHERE cr.status = $1";
            params.push(status);
        }
        q += " ORDER BY cr.created_at DESC";

        const result = await pool.query(q, params);
        return res.json({ ok: true, requests: result.rows });
    } catch (err) {
        console.error("All Cert Requests Error:", err);
        return res.status(500).json({ ok: false, error: err.message });
    }
});

// ─────────────────────────────────────────
// GN: Legacy status update (kept for backward compat)
// ─────────────────────────────────────────
router.patch("/:id/status", requireAuth, requireRole("GN"), async (req, res) => {
    try {
        const { id } = req.params;
        const { status, gn_note } = req.body;
        const allowed = ["PENDING", "SUBMITTED", "UNDER_REVIEW_GN", "PENDING_DS_APPROVAL", "APPROVED", "ISSUED", "VISIT_REQUIRED", "REJECTED"];
        if (!allowed.includes(status))
            return res.status(400).json({ ok: false, error: "Invalid status" });

        const result = await pool.query(
            `UPDATE certificate_request
       SET status=$1, gn_note=$2, updated_at=NOW()
       WHERE request_id=$3
       RETURNING request_id, status, gn_note, updated_at`,
            [status, gn_note?.trim() || null, id]
        );
        if (!result.rows.length)
            return res.status(404).json({ ok: false, error: "Request not found" });

        return res.json({ ok: true, request: result.rows[0] });
    } catch (err) {
        console.error("Update Cert Status Error:", err);
        return res.status(500).json({ ok: false, error: err.message });
    }
});

// ─────────────────────────────────────────
// GN: Unified action endpoint (approve / visit / reject)
// ─────────────────────────────────────────
router.patch("/:id/gn-action", requireAuth, requireRole("GN"), async (req, res) => {
    try {
        const { id } = req.params;
        const { action, gn_remarks, appointment_date, required_documents_list, rejection_reason } = req.body;

        if (!action || !["approve", "visit", "reject"].includes(action))
            return res.status(400).json({ ok: false, error: "Invalid action. Must be approve, visit, or reject." });

        // Fetch current request + citizen contact info
        const reqRow = await pool.query(
            `SELECT cr.request_id, cr.cert_type, cr.status, cr.certificate_id,
                    c.full_name AS citizen_name, u.email AS citizen_email,
                    COALESCE(fm.full_name, c.full_name) AS applicant_name
             FROM certificate_request cr
             JOIN citizen c ON c.citizen_id = cr.citizen_id
             JOIN user_table u ON u.user_id = c.user_id
             LEFT JOIN family_member fm ON fm.member_id = cr.family_member_id
             WHERE cr.request_id = $1`,
            [id]
        );
        if (!reqRow.rows.length)
            return res.status(404).json({ ok: false, error: "Request not found" });

        const certReq = reqRow.rows[0];
        let newStatus, updateFields, updateParams;

        if (action === "approve") {
            // Route to DS if high-authority cert, else directly APPROVED
            newStatus = DS_APPROVAL_TYPES.includes(certReq.cert_type)
                ? "PENDING_DS_APPROVAL"
                : "APPROVED";

            let certId = certReq.certificate_id;
            let issuedAt = null;
            if (newStatus === "APPROVED" && !certId) {
                certId = crypto.randomUUID();
                issuedAt = new Date();
            }

            const result = await pool.query(
                `UPDATE certificate_request
                 SET status=$1, gn_remarks=$2, certificate_id=COALESCE($3, certificate_id),
                     issued_at=COALESCE($4, issued_at), updated_at=NOW()
                 WHERE request_id=$5
                 RETURNING *`,
                [newStatus, gn_remarks?.trim() || null, certId, issuedAt, id]
            );

            // Notify citizen if approved
            if (newStatus === "APPROVED") {
                sendApprovalNotification(certReq.citizen_email, certReq.citizen_name, certReq.cert_type).catch(() => {});
            }

            return res.json({ ok: true, request: result.rows[0], newStatus });

        } else if (action === "visit") {
            if (!appointment_date)
                return res.status(400).json({ ok: false, error: "Appointment date is required for visit action." });

            const result = await pool.query(
                `UPDATE certificate_request
                 SET status='VISIT_REQUIRED', gn_remarks=$1, appointment_date=$2,
                     required_documents_list=$3, updated_at=NOW()
                 WHERE request_id=$4
                 RETURNING *`,
                [gn_remarks?.trim() || null, appointment_date, required_documents_list?.trim() || null, id]
            );

            // Notify citizen about visit
            sendVisitNotification(
                certReq.citizen_email,
                certReq.citizen_name,
                appointment_date,
                required_documents_list
            ).catch(() => {});

            return res.json({ ok: true, request: result.rows[0], newStatus: "VISIT_REQUIRED" });

        } else if (action === "reject") {
            if (!rejection_reason?.trim())
                return res.status(400).json({ ok: false, error: "Rejection reason is required." });

            const result = await pool.query(
                `UPDATE certificate_request
                 SET status='REJECTED', gn_remarks=$1, rejection_reason=$2, updated_at=NOW()
                 WHERE request_id=$3
                 RETURNING *`,
                [gn_remarks?.trim() || null, rejection_reason.trim(), id]
            );

            // Notify citizen about rejection
            sendRejectionNotification(
                certReq.citizen_email,
                certReq.citizen_name,
                certReq.cert_type,
                rejection_reason
            ).catch(() => {});

            return res.json({ ok: true, request: result.rows[0], newStatus: "REJECTED" });
        }
    } catch (err) {
        console.error("GN Action Error:", err);
        return res.status(500).json({ ok: false, error: err.message });
    }
});

// ─────────────────────────────────────────
// ADMIN (DS): Approve or reject a PENDING_DS_APPROVAL request
// ─────────────────────────────────────────
router.patch("/:id/ds-action", requireAuth, requireRole("ADMIN"), async (req, res) => {
    try {
        const { id } = req.params;
        const { action, ds_remarks, ds_signature_blob } = req.body;

        if (!action || !["approve", "reject"].includes(action))
            return res.status(400).json({ ok: false, error: "Invalid action. Must be approve or reject." });

        // Fetch citizen info for notifications
        const reqRow = await pool.query(
            `SELECT cr.cert_type, c.full_name AS citizen_name, u.email AS citizen_email
             FROM certificate_request cr
             JOIN citizen c ON c.citizen_id = cr.citizen_id
             JOIN user_table u ON u.user_id = c.user_id
             WHERE cr.request_id = $1`,
            [id]
        );
        if (!reqRow.rows.length)
            return res.status(404).json({ ok: false, error: "Request not found" });
        const certReq = reqRow.rows[0];

        let result;
        if (action === "approve") {
            const newCertId = crypto.randomUUID();
            result = await pool.query(
                `UPDATE certificate_request
                 SET status='APPROVED', gn_remarks=COALESCE($1, gn_remarks),
                     ds_signature_blob=$2, certificate_id=COALESCE(certificate_id, $3),
                     issued_at=COALESCE(issued_at, NOW()), updated_at=NOW()
                 WHERE request_id=$4
                 RETURNING *`,
                [ds_remarks?.trim() || null, ds_signature_blob?.trim() || null, newCertId, id]
            );
            sendApprovalNotification(certReq.citizen_email, certReq.citizen_name, certReq.cert_type).catch(() => {});
        } else {
            if (!ds_remarks?.trim())
                return res.status(400).json({ ok: false, error: "DS rejection reason is required." });
            result = await pool.query(
                `UPDATE certificate_request
                 SET status='REJECTED', rejection_reason=$1, updated_at=NOW()
                 WHERE request_id=$2
                 RETURNING *`,
                [ds_remarks.trim(), id]
            );
            sendRejectionNotification(certReq.citizen_email, certReq.citizen_name, certReq.cert_type, ds_remarks).catch(() => {});
        }

        if (!result.rows.length)
            return res.status(404).json({ ok: false, error: "Request not found" });

        return res.json({ ok: true, request: result.rows[0] });
    } catch (err) {
        console.error("DS Action Error:", err);
        return res.status(500).json({ ok: false, error: err.message });
    }
});

// ─────────────────────────────────────────
// CITIZEN: Download their own approved certificate
// ─────────────────────────────────────────
router.get("/:id/citizen-pdf", requireAuth, requireRole("CITIZEN"), async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Fetch request and verify ownership + approval
        const result = await pool.query(
            `SELECT cr.*, COALESCE(fm.full_name, c.full_name) AS applicant_name,
                    c.full_name AS citizen_name, c.nic_number AS citizen_nic
             FROM certificate_request cr
             JOIN citizen c ON c.citizen_id = cr.citizen_id
             LEFT JOIN family_member fm ON fm.member_id = cr.family_member_id
             WHERE cr.request_id=$1 AND c.user_id=$2`,
            [id, userId]
        );
        if (!result.rows.length)
            return res.status(404).json({ ok: false, error: "Request not found or access denied" });

        const cert = result.rows[0];
        if (!["APPROVED", "ISSUED"].includes(cert.status))
            return res.status(403).json({ ok: false, error: "Certificate is not approved yet" });

        const data = cert.certificate_data || {};
        const certIdStr = cert.certificate_id;

        if (!certIdStr)
            return res.status(500).json({ ok: false, error: "Certificate ID not generated yet" });

        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        const verifyUrl = `${frontendUrl}/verify/${certIdStr}`;
        const qrBuffer = await QRCode.toBuffer(verifyUrl, { width: 100, margin: 1 });

        const doc = new PDFDocument({ margin: 50, size: "A4" });
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="certificate_${id}.pdf"`
        );
        doc.pipe(res);

        const drawLine = () => {
            doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke().moveDown(0.5);
        };
        const sectionHeader = (title) => {
            doc.fontSize(11).font("Helvetica-Bold").text(title).moveDown(0.3);
        };
        const field = (label, value, indent = 0) => {
            doc
                .fontSize(10)
                .font("Helvetica")
                .text(`${label}: ${value || "_________________"}`, { indent });
        };

        doc.image(qrBuffer, 445, 45, { width: 80 });
        doc
            .fontSize(7)
            .font("Helvetica")
            .text(`Certificate ID:`, 430, 130, { width: 120 })
            .text(certIdStr.substring(0, 18), 430, 140, { width: 120 })
            .text(certIdStr.substring(18), 430, 150, { width: 120 });

        renderCertificate(doc, cert.cert_type, cert, data, drawLine, sectionHeader, field);

        doc
            .moveDown(2)
            .fontSize(8)
            .font("Helvetica")
            .fillColor("#666666")
            .text(
                `Scan the QR code to verify this certificate online. Certificate ID: ${certIdStr}`,
                50, doc.page.height - 70, { width: 400, align: "center" }
            );

        doc.end();
    } catch (err) {
        console.error("Citizen PDF Error:", err);
        if (!res.headersSent)
            return res.status(500).json({ ok: false, error: err.message });
    }
});

// ─────────────────────────────────────────
// GN: Save certificate form data
// ─────────────────────────────────────────
router.patch("/:id/data", requireAuth, requireRole("GN"), async (req, res) => {
    try {
        const { id } = req.params;
        const { certificate_data } = req.body;
        if (!certificate_data || typeof certificate_data !== "object") {
            return res.status(400).json({ ok: false, error: "Invalid certificate data" });
        }
        const result = await pool.query(
            `UPDATE certificate_request SET certificate_data=$1, updated_at=NOW()
             WHERE request_id=$2
             RETURNING request_id, certificate_data, updated_at`,
            [JSON.stringify(certificate_data), id]
        );
        if (!result.rows.length)
            return res.status(404).json({ ok: false, error: "Request not found" });
        return res.json({ ok: true, request: result.rows[0] });
    } catch (err) {
        console.error("Save Cert Data Error:", err);
        return res.status(500).json({ ok: false, error: err.message });
    }
});

// ─────────────────────────────────────────
// GN & ADMIN: Get saved certificate form data
// ─────────────────────────────────────────
router.get("/:id/data", requireAuth, requireRole("GN", "ADMIN"), async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `SELECT cr.request_id, cr.cert_type, cr.certificate_data, cr.certificate_id, cr.issued_at,
                    cr.nic_number, cr.status, cr.purpose,
                    COALESCE(fm.full_name, c.full_name) AS applicant_name,
                    c.full_name AS citizen_name
             FROM certificate_request cr
             JOIN citizen c ON c.citizen_id = cr.citizen_id
             LEFT JOIN family_member fm ON fm.member_id = cr.family_member_id
             WHERE cr.request_id=$1`,
            [id]
        );
        if (!result.rows.length)
            return res.status(404).json({ ok: false, error: "Request not found" });
        return res.json({ ok: true, request: result.rows[0] });
    } catch (err) {
        console.error("Get Cert Data Error:", err);
        return res.status(500).json({ ok: false, error: err.message });
    }
});

// ─────────────────────────────────────────
// GN & ADMIN: Generate & download certificate PDF
// ─────────────────────────────────────────
router.get("/:id/pdf", requireAuth, requireRole("GN", "ADMIN"), async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch request data
        const result = await pool.query(
            `SELECT cr.*, COALESCE(fm.full_name, c.full_name) AS applicant_name,
                    c.full_name AS citizen_name, c.nic_number AS citizen_nic
             FROM certificate_request cr
             JOIN citizen c ON c.citizen_id = cr.citizen_id
             LEFT JOIN family_member fm ON fm.member_id = cr.family_member_id
             WHERE cr.request_id=$1`,
            [id]
        );
        if (!result.rows.length)
            return res.status(404).json({ ok: false, error: "Request not found" });

        let cert = result.rows[0];

        // Generate UUID if first time issuing
        if (!cert.certificate_id) {
            const newUuid = crypto.randomUUID();
            await pool.query(
                "UPDATE certificate_request SET certificate_id=$1, issued_at=NOW() WHERE request_id=$2",
                [newUuid, id]
            );
            cert.certificate_id = newUuid;
            cert.issued_at = new Date();
        }

        const data = cert.certificate_data || {};
        const certIdStr = cert.certificate_id;
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        const verifyUrl = `${frontendUrl}/verify/${certIdStr}`;

        // Generate QR code as PNG buffer
        const qrBuffer = await QRCode.toBuffer(verifyUrl, { width: 100, margin: 1 });

        // Build PDF
        const doc = new PDFDocument({ margin: 50, size: "A4" });
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="certificate_${id}.pdf"`
        );
        doc.pipe(res);

        // ── Helper drawing functions ──
        const drawLine = () => {
            doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke().moveDown(0.5);
        };
        const sectionHeader = (title) => {
            doc.fontSize(11).font("Helvetica-Bold").text(title).moveDown(0.3);
        };
        const field = (label, value, indent = 0) => {
            doc
                .fontSize(10)
                .font("Helvetica")
                .text(`${label}: ${value || "_________________"}`, { indent });
        };

        // ── Certificate ID + QR in top-right ──
        doc.image(qrBuffer, 445, 45, { width: 80 });
        doc
            .fontSize(7)
            .font("Helvetica")
            .text(`Certificate ID:`, 430, 130, { width: 120 })
            .text(certIdStr.substring(0, 18), 430, 140, { width: 120 })
            .text(certIdStr.substring(18), 430, 150, { width: 120 });

        // ── Generate cert body based on type ──
        renderCertificate(doc, cert.cert_type, cert, data, drawLine, sectionHeader, field);

        // ── Footer ──
        doc
            .moveDown(2)
            .fontSize(8)
            .font("Helvetica")
            .fillColor("#666666")
            .text(
                `Scan the QR code to verify this certificate online. Certificate ID: ${certIdStr}`,
                50, doc.page.height - 70, { width: 400, align: "center" }
            );

        doc.end();
    } catch (err) {
        console.error("Generate PDF Error:", err);
        if (!res.headersSent)
            return res.status(500).json({ ok: false, error: err.message });
    }
});

// ─────────────────────────────────────────
// PDF rendering per certificate type
// ─────────────────────────────────────────
function renderCertificate(doc, certType, cert, data, drawLine, sectionHeader, field) {
    const issuedDate = cert.issued_at
        ? new Date(cert.issued_at).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })
        : new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });

    doc.fillColor("#000000");

    if (certType === "Residence and character Certificate") {
        // ── Certificate on Residence and Character ──
        doc.fontSize(14).font("Helvetica-Bold")
            .text("Certificate on Residence and Character", { align: "center" })
            .text("Issued by the Grama Niladhari", { align: "center" });
        doc.fontSize(9).font("Helvetica-Oblique")
            .moveDown(0.5)
            .text("Validity Note: This certificate is valid only for 06 months from the date countersigned by the Divisional Secretary.", { align: "left" });
        doc.moveDown(0.3);
        drawLine();

        sectionHeader("1. Administrative Information");
        field("District and Divisional Secretary's Division", data.district_division);
        field("Grama Niladhari Division and Number", data.gn_division_number);
        field("Whether applicant is personally known to the Grama Niladhari?", data.personally_known);
        field("If so, since when", data.known_since);
        drawLine();

        sectionHeader("2. Information about Applicant");
        field("Name and Address", data.name_address || cert.applicant_name);
        field("Sex", data.sex);
        field("Age", data.age);
        field("Whether Sri Lankan", data.sri_lankan);
        field("Religion", data.religion);
        field("Civil Status", data.civil_status);
        field("Present Occupation", data.occupation);
        field("Period of residence in the village", data.residence_period);
        field("National Identity Card No.", data.nic || cert.nic_number);
        field("Number of the Electoral Register and Particulars of Registration", data.electoral_no);
        field("Name and Address of the Father", data.father_name_address);
        field("Purpose for which the certificate is required", data.purpose || cert.purpose);
        field("Usual Signature / Thumb Impression", data.signature_note);
        drawLine();

        sectionHeader("3. Other Information");
        field("Period of residence in the Grama Niladhari Division", data.gn_residence_period);
        field("Nature of other evidences in proof of the period of residence", data.evidence_nature);
        field("Whether the Applicant has been convicted by a Court of Law?", data.convicted);
        field("Whether he/she has taken an interest in public activities, social service work, community work, etc.?", data.public_activities);
        field("His/her character", data.character);
        field("Remarks", data.remarks);
        drawLine();

        doc.moveDown(0.5);
        sectionHeader("Certification");
        doc.fontSize(10).font("Helvetica")
            .text(`It is hereby certified that the above particulars are correct to the best of my knowledge, he/she is a citizen of Sri Lanka by descent/registration, his/her Certificate of Registration Number is ${data.reg_number || "______________"} and that it has been issued by ${data.issued_by || "______________"}.`);
        doc.moveDown(0.5);
        field("Date", issuedDate);
        field("Signature of Grama Niladhari and Official Stamp", data.gn_name || "______________");
        doc.moveDown(1);
        sectionHeader("Counter Signature");
        field("Divisional Secretary", data.div_secretary || "______________");
        field("Date", issuedDate);

    } else if (certType === "Income Certificate") {
        // ── Issuance of Income Certificate ──
        doc.fontSize(14).font("Helvetica-Bold")
            .text("Issuance of Income Certificate", { align: "center" });
        doc.moveDown(0.3);
        drawLine();

        sectionHeader("Section 1: Applicant Details");
        field("1. Name of the Applicant", data.name || cert.applicant_name);
        field("2. National Identity Card (NIC) Number", data.nic || cert.nic_number);
        field("3. Residential Address", data.address);
        field("4. House Number", data.house_number);
        field("5. Village / Street", data.village_street);
        field("6. Grama Niladhari Division", data.gn_division);
        field("7. Samurdhi or other relief/allowances received by the applicant", data.samurdhi);
        field("8. Purpose for which the Income Certificate is required", data.purpose || cert.purpose);
        drawLine();

        sectionHeader("Section 2: Income and Business Information");
        field("9. Source of Income", data.income_source);
        field("10. Registration of Income Source", data.income_reg);
        field("11. Address of the place where the income source is located", data.income_address);
        field("12. Period of engagement in the income source/business", data.income_period);
        field("13. Will you continue to be engaged in this income source?", data.continue_income);
        field("14. If an employee of a business premises, is there any objection from the owner regarding obtaining an income certificate based on the monthly salary?", data.employer_objection);
        field("15. Is tax paid for the income mentioned by the applicant?", data.tax_paid);
        field("16. Has the applicant obtained an income certificate within the last 06 months?", data.previous_cert);
        field("17. If so, what was the amount of that income?", data.previous_income);
        field("18. Other facts", data.other_facts);
        drawLine();

        sectionHeader("Section 3: Grama Niladhari Recommendation");
        field("19. Recommended Monthly Income / Annual Income (Rs.)", data.recommended_income);
        doc.fontSize(10).font("Helvetica-Bold")
            .text("20. I recommend / do not recommend the issuance of an income certificate.");
        doc.fontSize(10).font("Helvetica").moveDown(0.3)
            .text("I certify that the above information is correct. I am forwarding herewith the documents submitted to me by the applicant.");
        doc.moveDown(0.5);
        field("Grama Niladhari – Division Name", data.gn_name);
        doc.moveDown(0.5);
        drawLine();

        sectionHeader("Section 4: For Office Use Only");
        doc.fontSize(10).font("Helvetica")
            .text("Divisional Secretary / Assistant Divisional Secretary / Administrative Officer,")
            .text("Submitted for approval to issue the income certificate.");
        doc.moveDown(0.3);
        field("Subject Clerk", data.subject_clerk);
        field("Date", issuedDate);
        doc.fontSize(10).font("Helvetica").text("I approve the issuance of the income certificate.");
        field("Divisional Secretary – Division Date", issuedDate);
        field("Receipt Number", data.receipt_number);
        field("Income Certificate Number", data.cert_number);

    } else if (certType === "Housing Loan Approval" || certType === "Application for obtaining housing loan funds") {
        // ── Application for Obtaining Housing Loan/Funds ──
        doc.fontSize(14).font("Helvetica-Bold")
            .text("Application for Obtaining Housing Loan/Funds", { align: "center" });
        doc.moveDown(0.3);
        drawLine();

        sectionHeader("Section 1: Applicant Information");
        doc.fontSize(9).font("Helvetica").text("Form Type: Application   |   For Office Use Only").moveDown(0.3);
        field("01. Name of Applicant", data.name || cert.applicant_name);
        field("02. Address", data.address);
        field("03. Monthly Family Income (Rs.)", data.monthly_income);
        field("04. Whether a Samurdhi Beneficiary", data.samurdhi_beneficiary);
        drawLine();

        sectionHeader("Section 2: Property Details Related to Housing Assistance");
        field("Description of Property (Land/Property)", data.property_description);
        field("Owner's Name", data.owner_name);
        field("Extent of Land", data.extent_of_land);
        field("Deed Number and Date", data.deed_number_date);
        drawLine();

        sectionHeader("Section 3: Applicant's Declaration");
        doc.fontSize(10).font("Helvetica")
            .text(`I hereby declare that the information provided above is correct and request a loan/grant amount of Rs. ${data.loan_amount || "______________"} for the aforementioned property.`);
        doc.moveDown(0.5);
        field("Signature of Applicant", "______________");
        field("Date", issuedDate);
        drawLine();

        sectionHeader("Section 4: Grama Niladhari Recommendation");
        doc.fontSize(10).font("Helvetica")
            .text(`I certify that the information provided above by the applicant ${cert.applicant_name || "______________"} is correct and recommend/do not recommend that the housing loan/assistance is suitable/unsuitable.`);
        doc.moveDown(0.5);
        field("Grama Niladhari – Division Name", data.gn_name);
        field("Date", issuedDate);
        drawLine();

        sectionHeader("Section 5: Housing Officer Recommendation");
        doc.fontSize(10).font("Helvetica")
            .text(`I have conducted a field inspection regarding the housing loan/assistance submitted by the applicant ${cert.applicant_name || "______________"} and recommend that providing the housing loan/assistance is suitable.`);
        doc.moveDown(0.5);
        field("Housing Officer – Divisional Secretariat Division", data.housing_officer);
        field("Date", issuedDate);
        drawLine();

        sectionHeader("Section 6: Approval of Divisional Secretary");
        doc.fontSize(10).font("Helvetica")
            .text("I hereby approve the issuance of the housing loan/assistance amount requested by the above applicant.");
        doc.moveDown(0.5);
        field("Divisional Secretary – Divisional Secretariat Division", data.div_secretary);
        field("Date", issuedDate);

    } else if (certType === "Registration of delayed births") {
        // ── Registration of Delayed Births – Grama Niladhari Report ──
        doc.fontSize(14).font("Helvetica-Bold")
            .text("Registration of Delayed Births – Grama Niladhari Report", { align: "center" });
        doc.moveDown(0.3);
        drawLine();

        sectionHeader("1. Personal Details");
        field("1. Full Name", data.full_name || cert.applicant_name);
        field("2. Address", data.address);
        field("3. Occupation", data.occupation);
        doc.fontSize(10).font("Helvetica-Bold").text("4. Identification:").moveDown(0.2);
        field("   i. National Identity Card (NIC) No.", data.nic || cert.nic_number, 20);
        field("   ii. Passport No.", data.passport_no, 20);
        field("   iii. Driving License No.", data.driving_license, 20);
        field("5. Age", data.age);
        drawLine();

        sectionHeader("2. Declaration of Identity and Birth");
        doc.fontSize(10).font("Helvetica")
            .text(`6. I know the person named ${data.known_person || "______________"} who has submitted this declaration.`)
            .moveDown(0.3)
            .text(`7. It has been reported to me that the person named ${data.born_person || "______________"} was born at the Hospital / Maternity Home / House named ${data.born_place || "______________"}.`)
            .moveDown(0.3)
            .text(`8. I further declare that the father is ${data.father_name || "______________"} and the mother is ${data.mother_name || "______________"}.`)
            .moveDown(0.3)
            .text(`9. This birth is reported under ${data.reported_under || "______________"}.`)
            .moveDown(0.3)
            .text("10. I also declare that they live in my division as husband and wife / the father / the mother / both are deceased.");
        drawLine();

        sectionHeader("3. Certification and Approval");
        doc.fontSize(10).font("Helvetica").text("I certify that the above details are true and correct.");
        doc.moveDown(0.5);
        field("Grama Niladhari – Division Name", data.gn_name);
        field("Date", issuedDate);
        doc.moveDown(1);
        drawLine();
        sectionHeader("Countersigned by:");
        field("Divisional Secretary – Divisional Secretariat Division", data.div_secretary);
        field("Date", issuedDate);

    } else if (certType === "Notification of the death of a pensioner") {
        // ── Notification of the Death of a Pensioner ──
        doc.fontSize(14).font("Helvetica-Bold")
            .text("Notification of the Death of a Pensioner", { align: "center" });
        doc.moveDown(0.3);
        drawLine();

        sectionHeader("1. Personal Details of the Pensioner");
        field("1. Name of the Pensioner", data.pensioner_name || cert.applicant_name);
        field("2. Address", data.address);
        field("3. Date of Retirement", data.retirement_date);
        field("4. National Identity Card (NIC) Number", data.nic || cert.nic_number);
        field("5. Pension Number", data.pension_number);
        field("6. Date of Death", data.death_date);
        drawLine();

        sectionHeader("2. Information Regarding Dependents");
        // Draw header row
        const tableTop = doc.y + 5;
        doc.font("Helvetica-Bold").fontSize(9);
        doc.text("No.", 55, tableTop, { width: 30 });
        doc.text("Name", 90, tableTop, { width: 150 });
        doc.text("Relationship to the Pensioner", 245, tableTop, { width: 180 });
        doc.text("Age", 430, tableTop, { width: 50 });
        doc.moveTo(50, tableTop + 15).lineTo(490, tableTop + 15).stroke();
        doc.font("Helvetica").fontSize(9);
        doc.moveDown(2);

        const dependents = data.dependents || [];
        if (dependents.length === 0) {
            // Draw empty rows
            for (let i = 0; i < 3; i++) {
                const rowY = doc.y;
                doc.text("", 55, rowY, { width: 30 });
                doc.text("______________", 90, rowY, { width: 150 });
                doc.text("______________", 245, rowY, { width: 180 });
                doc.text("____", 430, rowY, { width: 50 });
                doc.moveDown(1.2);
            }
        } else {
            dependents.forEach((dep, i) => {
                const rowY = doc.y;
                doc.text(`${i + 1}`, 55, rowY, { width: 30 });
                doc.text(dep.name || "______________", 90, rowY, { width: 150 });
                doc.text(dep.relationship || "______________", 245, rowY, { width: 180 });
                doc.text(dep.age || "____", 430, rowY, { width: 50 });
                doc.moveDown(1.2);
            });
        }
        drawLine();

        sectionHeader("3. Certification");
        doc.fontSize(10).font("Helvetica")
            .text("I certify that the information provided above is correct.");
        doc.moveDown(0.5);
        field("Grama Niladhari – Division Name", data.gn_name);
        field("Date", issuedDate);

    } else {
        // ── Generic / Other ──
        doc.fontSize(14).font("Helvetica-Bold")
            .text(`Certificate – ${certType}`, { align: "center" });
        doc.moveDown(0.3);
        drawLine();
        field("Applicant Name", cert.applicant_name);
        field("NIC Number", cert.nic_number);
        field("Purpose", cert.purpose);
        field("Date", issuedDate);
        field("Notes", data.notes);
        doc.moveDown(1);
        drawLine();
        field("Grama Niladhari", data.gn_name);
    }
}

// ─────────────────────────────────────────
// ADMIN: Fetch stats for admin dashboard
// ─────────────────────────────────────────
router.get("/admin/stats", requireAuth, requireRole("ADMIN"), async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                COUNT(*) as total_requests,
                SUM(CASE WHEN admin_status = 'PENDING' THEN 1 ELSE 0 END) as pending_verifications,
                SUM(CASE WHEN admin_status = 'VERIFIED' AND date_trunc('month', updated_at) = date_trunc('month', CURRENT_DATE) THEN 1 ELSE 0 END) as approved_this_month,
                SUM(CASE WHEN admin_status = 'REJECTED' AND date_trunc('month', updated_at) = date_trunc('month', CURRENT_DATE) THEN 1 ELSE 0 END) as rejected_this_month,
                EXTRACT(WEEK FROM created_at) as week_no,
                COUNT(*) as weekly_count
            FROM certificate_request
            GROUP BY week_no
            ORDER BY week_no DESC
            LIMIT 4;
        `);
        // Calculate global aggregates (ignoring week_no grouping) using a separate query
        const aggResult = await pool.query(`
            SELECT 
                SUM(CASE WHEN admin_status = 'PENDING' THEN 1 ELSE 0 END) as pending_verifications,
                SUM(CASE WHEN admin_status = 'VERIFIED' AND date_trunc('month', updated_at) = date_trunc('month', CURRENT_DATE) THEN 1 ELSE 0 END) as approved_this_month,
                SUM(CASE WHEN admin_status = 'REJECTED' AND date_trunc('month', updated_at) = date_trunc('month', CURRENT_DATE) THEN 1 ELSE 0 END) as rejected_this_month,
                COUNT(*) as total_requests
            FROM certificate_request;
        `);
        
        const overall = aggResult.rows[0];
        
        return res.json({
            ok: true,
            stats: {
                pending_verifications: parseInt(overall.pending_verifications || 0),
                approved_this_month: parseInt(overall.approved_this_month || 0),
                rejected_this_month: parseInt(overall.rejected_this_month || 0),
                total_requests: parseInt(overall.total_requests || 0),
                weekly: result.rows.map(r => ({ week: r.week_no, count: parseInt(r.weekly_count) }))
            }
        });
    } catch (err) {
        console.error("Admin Stats Error:", err);
        return res.status(500).json({ ok: false, error: err.message });
    }
});

// ─────────────────────────────────────────
// ADMIN: Update admin_status
// ─────────────────────────────────────────
router.patch("/:id/admin-status", requireAuth, requireRole("ADMIN"), async (req, res) => {
    try {
        const { id } = req.params;
        const { admin_status } = req.body;
        const allowed = ["PENDING", "VERIFIED", "REJECTED"];
        if (!allowed.includes(admin_status))
            return res.status(400).json({ ok: false, error: "Invalid admin status" });

        const result = await pool.query(
            `UPDATE certificate_request
             SET admin_status=$1, updated_at=NOW()
             WHERE request_id=$2
             RETURNING request_id, admin_status, updated_at`,
            [admin_status, id]
        );
        if (!result.rows.length)
            return res.status(404).json({ ok: false, error: "Request not found" });

        return res.json({ ok: true, request: result.rows[0] });
    } catch (err) {
        console.error("Update Admin Status Error:", err);
        return res.status(500).json({ ok: false, error: err.message });
    }
});

module.exports = router;
