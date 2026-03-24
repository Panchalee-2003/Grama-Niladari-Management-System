const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { requireAuth, requireRole } = require("../middleware/auth.middleware");
const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const crypto = require("crypto");
const { sendVisitNotification, sendRejectionNotification, sendApprovalNotification } = require("../services/email.service");
const ejs = require("ejs");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

// Certificate types that require DS (Divisional Secretary) approval
const DS_APPROVAL_TYPES = [
    "Application for obtaining housing loan funds",
    "Income Certificate",
    "Registration of delayed births",
    "Registration of voluntary organizations",
];

const CERT_TYPES = [
    "Residence and character Certificate",
    "Income Certificate",
    "Registration of delayed births",
    "Request for financial assistance from the President's fund for medical treatment",
    "Application for obtaining housing loan funds",
    "Notification of the death of a pensioner",
    "Registration of voluntary organizations",
];

// ─────────────────────────────────────────
// CITIZEN: Get my family members (for dropdown)
// ─────────────────────────────────────────

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
router.post("/", requireAuth, requireRole("CITIZEN"), async (req, res) => {
    try {
        const userId = req.user.id;
        const { cert_type, purpose, nic_number, request_data } = req.body;

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

        if (cert_type === "Residence and character Certificate" || cert_type === "Character") {
            const result = await pool.query(
                `INSERT INTO certificate_request (citizen_id, cert_type, purpose, family_member_id, nic_number, certificate_data, status, created_at, updated_at)
                 VALUES ($1,$2,$3,$4,$5,$6,'VISIT_REQUIRED',NOW(),NOW())
                 RETURNING request_id, cert_type, purpose, status, created_at`,
                [citizen_id, cert_type, purpose?.trim() || null, family_member_id, nic_number, JSON.stringify(request_data || {})]
            );
            return res.status(201).json({ ok: true, request: result.rows[0], message: "Request received. Please visit the GN office for verification." });
        }

        const result = await pool.query(
            `INSERT INTO certificate_request (citizen_id, cert_type, purpose, family_member_id, nic_number, certificate_data, status, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,'PENDING',NOW(),NOW())
       RETURNING request_id, cert_type, purpose, status, created_at`,
            [citizen_id, cert_type, purpose?.trim() || null, family_member_id, nic_number, JSON.stringify(request_data || {})]
        );

        return res.status(201).json({ ok: true, request: result.rows[0], message: "Certificate requested successfully!" });
    } catch (err) {
        console.error("Submit Cert Request Error:", err);
        return res.status(500).json({ ok: false, error: err.message });
    }
});

// ─────────────────────────────────────────
router.get("/my", requireAuth, requireRole("CITIZEN"), async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await pool.query(
            `SELECT cr.request_id, cr.cert_type, cr.purpose, cr.nic_number, cr.certificate_data,
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
            if (certReq.cert_type === "Residence and character Certificate") {
                return res.status(400).json({ ok: false, error: "This certificate cannot be generated automatically. A physical visit is required to initiate the physical issuance process." });
            }

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
router.get("/:id/citizen-pdf", requireAuth, requireRole("CITIZEN"), async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

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

        if (cert.cert_type === "Residence and character Certificate" || cert.cert_type === "Character") {
            return res.status(400).json({ ok: false, error: "This certificate requires an in-person visit and cannot be generated digitally."});
        }

        const data = cert.certificate_data || {};
        const certIdStr = cert.certificate_id;
        if (!certIdStr) return res.status(500).json({ ok: false, error: "Certificate ID not generated yet" });

        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        const verifyUrl = `${frontendUrl}/verify/${certIdStr}`;
        const qrBufferDataUri = await QRCode.toDataURL(verifyUrl, { width: 100, margin: 1 });

        const pdfBuffer = await generatePDFWithPuppeteer(cert, data, qrBufferDataUri);
        
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="certificate_${id}.pdf"`);
        return res.send(Buffer.from(pdfBuffer));
    } catch (err) {
        console.error("Citizen PDF Error:", err);
        if (!res.headersSent)
            return res.status(500).json({ ok: false, error: err.message });
    }
});

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
router.get("/:id/pdf", requireAuth, requireRole("GN", "ADMIN"), async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `SELECT cr.*, COALESCE(fm.full_name, c.full_name) AS applicant_name,
                    c.full_name AS citizen_name, c.nic_number AS citizen_nic
             FROM certificate_request cr
             JOIN citizen c ON c.citizen_id = cr.citizen_id
             LEFT JOIN family_member fm ON fm.member_id = cr.family_member_id
             WHERE cr.request_id=$1`,
            [id]
        );
        if (!result.rows.length) return res.status(404).json({ ok: false, error: "Request not found" });

        let cert = result.rows[0];
        
        if (cert.cert_type === "Residence and character Certificate" || cert.cert_type === "Character") {
            return res.status(400).json({ ok: false, error: "This certificate requires an in-person visit and cannot be generated digitally."});
        }

        if (!cert.certificate_id) {
            const newUuid = crypto.randomUUID();
            await pool.query("UPDATE certificate_request SET certificate_id=$1, issued_at=NOW() WHERE request_id=$2", [newUuid, id]);
            cert.certificate_id = newUuid;
            cert.issued_at = new Date();
        }

        const data = cert.certificate_data || {};
        const certIdStr = cert.certificate_id;
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        const verifyUrl = `${frontendUrl}/verify/${certIdStr}`;
        const qrBufferDataUri = await QRCode.toDataURL(verifyUrl, { width: 100, margin: 1 });

        const pdfBuffer = await generatePDFWithPuppeteer(cert, data, qrBufferDataUri);
        
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="certificate_${id}.pdf"`);
        return res.send(Buffer.from(pdfBuffer));
    } catch (err) {
        console.error("PDF Generate Error:", err);
        if (!res.headersSent) return res.status(500).json({ ok: false, error: err.message });
    }
});

// ─────────────────────────────────────────

// ─────────────────────────────────────────
// GN & ADMIN: Get all certificate requests
// ─────────────────────────────────────────
router.get("/all", requireAuth, requireRole("GN", "ADMIN"), async (req, res) => {
    try {
        const { status } = req.query;
        let query = `SELECT cr.*, COALESCE(fm.full_name, c.full_name) AS applicant_name,
                            c.full_name AS citizen_name, c.nic_number AS citizen_nic
                     FROM certificate_request cr
                     JOIN citizen c ON c.citizen_id = cr.citizen_id
                     LEFT JOIN family_member fm ON fm.member_id = cr.family_member_id`;
        let params = [];
        
        if (status && status !== "ALL") {
            query += ` WHERE cr.status = $1`;
            params.push(status);
        }
        
        query += ` ORDER BY cr.created_at DESC`;
        
        const result = await pool.query(query, params);
        return res.json({ ok: true, requests: result.rows });
    } catch (err) {
        console.error("Get All Requests Error:", err);
        return res.status(500).json({ ok: false, error: err.message });
    }
});

// ─────────────────────────────────────────
// GN & ADMIN: Get specific request details
// ─────────────────────────────────────────
router.get("/:id", requireAuth, requireRole("GN", "ADMIN"), async (req, res) => {
    try {
        const { id } = req.params;
        if (id === "my" || id === "all" || id === "admin" || id === "verify") return res.status(404).json({ ok: false });
        
        const result = await pool.query(
            `SELECT cr.*, COALESCE(fm.full_name, c.full_name) AS applicant_name,
                    c.full_name AS citizen_name, c.nic_number AS citizen_nic,
                    u.phone_number
             FROM certificate_request cr
             JOIN citizen c ON c.citizen_id = cr.citizen_id
             JOIN user_table u ON u.user_id = c.user_id
             LEFT JOIN family_member fm ON fm.member_id = cr.family_member_id
             WHERE cr.request_id=$1`,
            [id]
        );
        if (!result.rows.length) return res.status(404).json({ ok: false, error: "Request not found" });
        return res.json({ ok: true, request: result.rows[0] });
    } catch (err) {
        console.error("Get Request Error:", err);
        return res.status(500).json({ ok: false, error: err.message });
    }
});

async function generatePDFWithPuppeteer(cert, data, qrCodeDataUri) {
    const templatePath = path.join(__dirname, "../../frontend/public/certificates/template.ejs");
    const templateHtml = fs.readFileSync(templatePath, 'utf8');
    
    // Build context
    const issuedDate = cert.issued_at
        ? new Date(cert.issued_at).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })
        : new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
        
    // Convert data to the format we need
    let dependents = [];
    if (typeof data.dependents === "string") {
        dependents = data.dependents.split('\n').filter(line => line.trim() !== '').map(line => {
            const parts = line.split('-').map(s => s.trim());
            return {
                name: parts[0] || "",
                relationship: parts[1] || "",
                age: parts[2] || ""
            };
        });
    } else if (Array.isArray(data.dependents)) {
        dependents = data.dependents;
    }
    const modifiedData = { ...data, dependents };

    const sigPath = path.join(__dirname, "../../frontend/public/signature.png");
    let gn_sig = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iNjAiPjx0ZXh0IHg9IjEwIiB5PSI0MCIgZm9udC1mYW1pbHk9ImN1cnNpdmUiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiMwMDAwODAiPkdyYW1hIE5pbGFkaGFyaTwvdGV4dD48L3N2Zz4=";
    try {
        if (fs.existsSync(sigPath)) {
            const sigBuffer = fs.readFileSync(sigPath);
            gn_sig = `data:image/png;base64,${sigBuffer.toString('base64')}`;
        }
    } catch (e) {
        console.error("Error loading signature:", e);
    }
    const ds_sig = cert.status === "APPROVED" && [
        "Application for obtaining housing loan funds",
        "Income Certificate",
        "Registration of delayed births",
        "Registration of voluntary organizations"
    ].includes(cert.cert_type) 
        ? "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iNjAiPjx0ZXh0IHg9IjEwIiB5PSI0MCIgZm9udC1mYW1pbHk9ImN1cnNpdmUiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiMwMDAwODAiPkRpdiBTZWNyZXRhcnk8L3RleHQ+PC9zdmc+" 
        : null;

    const context = {
        certificate_id: cert.certificate_id || "PENDING",
        issued_at: issuedDate,
        qr_code_data_uri: qrCodeDataUri,
        cert_type: cert.cert_type,
        applicant_name: cert.applicant_name,
        nic_number: cert.nic_number,
        purpose: cert.purpose,
        dynamic_data: modifiedData,
        gn_signature_img: gn_sig,
        ds_signature_img: ds_sig
    };
    
    const html = ejs.render(templateHtml, context);
    
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-gpu',
            '--disable-dev-shm-usage',
            '--disable-extensions',
        ]
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 30000 });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' } });
    await browser.close();
    
    return pdfBuffer;
}

// ─────────────────────────────────────────
module.exports = router;