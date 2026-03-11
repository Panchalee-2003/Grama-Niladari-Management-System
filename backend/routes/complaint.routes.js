const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { requireAuth, requireRole } = require("../middleware/auth.middleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ── Multer config ──────────────────────────────────────────────────────────
const UPLOADS_DIR = path.join(__dirname, "..", "uploads", "complaints");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
    filename: (_req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
        cb(null, `${unique}${path.extname(file.originalname)}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
    fileFilter: (_req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        if (ext) cb(null, true);
        else cb(new Error("Only images, PDFs, and documents are allowed"));
    },
});

// ─────────────────────────────────────────
// CITIZEN: Submit a complaint
// ─────────────────────────────────────────
router.post(
    "/",
    requireAuth,
    requireRole("CITIZEN"),
    (req, res, next) => upload.single("attachment")(req, res, (err) => {
        if (err) return res.status(400).json({ ok: false, error: err.message });
        next();
    }),
    async (req, res) => {
        try {
            const userId = req.user.id;
            const { subject, description } = req.body;

            if (!subject?.trim()) {
                // Remove uploaded file if subject missing
                if (req.file) fs.unlink(req.file.path, () => { });
                return res.status(400).json({ ok: false, error: "Subject is required" });
            }

            // Get citizen_id and their household_id
            const citizenRow = await pool.query(
                `SELECT c.citizen_id, h.household_id 
                 FROM citizen c 
                 LEFT JOIN household h ON c.citizen_id = h.citizen_id 
                 WHERE c.user_id=$1 LIMIT 1`,
                [userId]
            );
            
            if (citizenRow.rows.length === 0) {
                if (req.file) fs.unlink(req.file.path, () => { });
                return res.status(400).json({ ok: false, error: "Citizen profile not found" });
            }
            
            const citizenId = citizenRow.rows[0].citizen_id;
            const householdId = citizenRow.rows[0].household_id;

            if (!householdId) {
                if (req.file) fs.unlink(req.file.path, () => { });
                return res.status(400).json({ ok: false, error: "You must register a household before submitting a complaint" });
            }

            // Store relative path  e.g.  complaints/1234567-9876543.pdf
            const attachmentPath = req.file
                ? `complaints/${req.file.filename}`
                : null;

            const result = await pool.query(
                `INSERT INTO complaint (citizen_id, household_id, subject, description, attachment_path, status, created_at)
       VALUES ($1, $2, $3, $4, $5, 'PENDING', NOW())
       RETURNING complaint_id, subject, status, created_at, attachment_path`,
                [citizenId, householdId, subject.trim(), description?.trim() || null, attachmentPath]
            );

            return res.status(201).json({ ok: true, complaint: result.rows[0] });
        } catch (err) {
            if (req.file) fs.unlink(req.file.path, () => { });
            console.error("Submit Complaint Error:", err);
            return res.status(500).json({ ok: false, error: err.message });
        }
    }
);

// ─────────────────────────────────────────
// CITIZEN: List my complaints
// ─────────────────────────────────────────
router.get("/my", requireAuth, requireRole("CITIZEN"), async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT c.complaint_id, c.subject, c.description, c.status, c.created_at,
              COUNT(r.response_id)::int AS response_count
       FROM complaint c
       JOIN citizen ci ON ci.citizen_id = c.citizen_id
       LEFT JOIN complaint_response r ON r.complaint_id = c.complaint_id
       WHERE ci.user_id = $1
       GROUP BY c.complaint_id
       ORDER BY c.created_at DESC`,
            [userId]
        );

        return res.json({ ok: true, complaints: result.rows });
    } catch (err) {
        console.error("My Complaints Error:", err);
        return res.status(500).json({ ok: false, error: err.message });
    }
});

// ─────────────────────────────────────────
// CITIZEN / GN: Get single complaint with responses
// ─────────────────────────────────────────
router.get("/:id", requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const role = req.user.role;

        // Fetch complaint
        const cResult = await pool.query(
            `SELECT c.complaint_id, c.subject, c.description, c.status, c.created_at,
              c.attachment_path, ci.full_name AS citizen_name, ci.nic_number
       FROM complaint c
       JOIN citizen ci ON ci.citizen_id = c.citizen_id
       WHERE c.complaint_id = $1`,
            [id]
        );

        if (cResult.rows.length === 0) {
            return res.status(404).json({ ok: false, error: "Complaint not found" });
        }

        const complaint = cResult.rows[0];

        // Citizens can only see their own complaints
        if (role === "CITIZEN") {
            const ownerCheck = await pool.query(
                "SELECT 1 FROM citizen WHERE user_id=$1 AND citizen_id=(SELECT citizen_id FROM complaint WHERE complaint_id=$2)",
                [userId, id]
            );
            if (ownerCheck.rows.length === 0) {
                return res.status(403).json({ ok: false, error: "Forbidden" });
            }
        }

        // Fetch responses
        const rResult = await pool.query(
            `SELECT r.response_id, r.message, r.created_at, g.name AS gn_name
       FROM complaint_response r
       LEFT JOIN grama_niladhari g ON g.gn_id = r.gn_id
       WHERE r.complaint_id = $1
       ORDER BY r.created_at ASC`,
            [id]
        );

        return res.json({ ok: true, complaint, responses: rResult.rows });
    } catch (err) {
        console.error("Get Complaint Error:", err);
        return res.status(500).json({ ok: false, error: err.message });
    }
});

// ─────────────────────────────────────────
// GN: Get all complaints
// ─────────────────────────────────────────
router.get("/all/list", requireAuth, requireRole("GN"), async (req, res) => {
    try {
        const { status } = req.query; // optional filter

        let query = `
      SELECT c.complaint_id, c.subject, c.description, c.status, c.created_at,
             ci.full_name AS citizen_name,
             COUNT(r.response_id)::int AS response_count
      FROM complaint c
      JOIN citizen ci ON ci.citizen_id = c.citizen_id
      LEFT JOIN complaint_response r ON r.complaint_id = c.complaint_id
    `;
        const params = [];

        if (status && status !== "ALL") {
            query += " WHERE c.status = $1";
            params.push(status);
        }

        query += " GROUP BY c.complaint_id, ci.full_name ORDER BY c.created_at DESC";

        const result = await pool.query(query, params);
        return res.json({ ok: true, complaints: result.rows });
    } catch (err) {
        console.error("All Complaints Error:", err);
        return res.status(500).json({ ok: false, error: err.message });
    }
});

// ─────────────────────────────────────────
// GN: Update complaint status
// ─────────────────────────────────────────
router.patch("/:id/status", requireAuth, requireRole("GN"), async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowed = ["PENDING", "PROCESSING", "RESOLVED"];
        if (!allowed.includes(status)) {
            return res.status(400).json({ ok: false, error: "Invalid status" });
        }

        const result = await pool.query(
            "UPDATE complaint SET status=$1 WHERE complaint_id=$2 RETURNING complaint_id, status",
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ ok: false, error: "Complaint not found" });
        }

        return res.json({ ok: true, complaint: result.rows[0] });
    } catch (err) {
        console.error("Update Status Error:", err);
        return res.status(500).json({ ok: false, error: err.message });
    }
});

// ─────────────────────────────────────────
// GN: Add response to a complaint
// ─────────────────────────────────────────
router.post("/:id/response", requireAuth, requireRole("GN"), async (req, res) => {
    try {
        const { id } = req.params;
        const { message } = req.body;
        const gnUserId = req.user.id;

        if (!message?.trim()) {
            return res.status(400).json({ ok: false, error: "Response message is required" });
        }

        // Get gn_id
        const gnRow = await pool.query(
            "SELECT gn_id, name FROM grama_niladhari WHERE user_id=$1 LIMIT 1",
            [gnUserId]
        );
        if (gnRow.rows.length === 0) {
            return res.status(400).json({ ok: false, error: "GN profile not found" });
        }
        const { gn_id, name: gn_name } = gnRow.rows[0];

        const result = await pool.query(
            `INSERT INTO complaint_response (complaint_id, gn_id, message, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING response_id, message, created_at`,
            [id, gn_id, message.trim()]
        );

        const response = { ...result.rows[0], gn_name };

        // Auto-advance status to PROCESSING if still PENDING
        await pool.query(
            "UPDATE complaint SET status='PROCESSING' WHERE complaint_id=$1 AND status='PENDING'",
            [id]
        );

        return res.status(201).json({ ok: true, response });
    } catch (err) {
        console.error("Add Response Error:", err);
        return res.status(500).json({ ok: false, error: err.message });
    }
});

module.exports = router;
