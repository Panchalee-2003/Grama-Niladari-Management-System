const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { requireAuth, requireRole } = require("../middleware/auth.middleware");

const CERT_TYPES = [
    "Residence Certificate",
    "Income Certificate",
    "Character Certificate",
    "Birth Certificate",
    "Death Certificate",
    "Housing Loan Approval",
    "Other",
];

// ─────────────────────────────────────────
// CITIZEN: Submit a certificate request
// ─────────────────────────────────────────
router.post("/", requireAuth, requireRole("CITIZEN"), async (req, res) => {
    try {
        const userId = req.user.id;
        const { cert_type, purpose, contact_number } = req.body;

        if (!cert_type || !CERT_TYPES.includes(cert_type))
            return res.status(400).json({ ok: false, error: "Invalid certificate type" });

        const citizenRow = await pool.query(
            "SELECT citizen_id, full_name, nic_number, phone_number FROM citizen WHERE user_id=$1 LIMIT 1",
            [userId]
        );
        if (!citizenRow.rows.length)
            return res.status(400).json({ ok: false, error: "Citizen profile not found" });

        const { citizen_id } = citizenRow.rows[0];

        const result = await pool.query(
            `INSERT INTO certificate_request (citizen_id, cert_type, purpose, contact_number, status, created_at, updated_at)
       VALUES ($1,$2,$3,$4,'PENDING',NOW(),NOW())
       RETURNING request_id, cert_type, purpose, status, created_at`,
            [citizen_id, cert_type, purpose?.trim() || null, contact_number?.trim() || null]
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
            `SELECT cr.request_id, cr.cert_type, cr.purpose, cr.contact_number,
              cr.status, cr.gn_note, cr.created_at, cr.updated_at
       FROM certificate_request cr
       JOIN citizen c ON c.citizen_id = cr.citizen_id
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
// GN: List all requests (filter by status)
// ─────────────────────────────────────────
router.get("/all", requireAuth, requireRole("GN"), async (req, res) => {
    try {
        const { status } = req.query;
        let q = `
      SELECT cr.request_id, cr.cert_type, cr.purpose, cr.contact_number,
             cr.status, cr.gn_note, cr.created_at, cr.updated_at,
             c.full_name AS citizen_name, c.nic_number, c.phone_number
      FROM certificate_request cr
      JOIN citizen c ON c.citizen_id = cr.citizen_id
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
// GN: Approve / Reject a request
// ─────────────────────────────────────────
router.patch("/:id/status", requireAuth, requireRole("GN"), async (req, res) => {
    try {
        const { id } = req.params;
        const { status, gn_note } = req.body;
        const allowed = ["PENDING", "APPROVED", "REJECTED"];
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

module.exports = router;
