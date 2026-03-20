const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { requireAuth, requireRole } = require("../middleware/auth.middleware");

// GET /api/availability -> get availability
router.get("/", requireAuth, async (req, res) => {
    try {
        const { start_date, end_date } = req.query;
        let query = "SELECT * FROM gn_availability";
        let params = [];
        if (start_date && end_date) {
            query += " WHERE date >= $1 AND date <= $2";
            params.push(start_date, end_date);
        }
        query += " ORDER BY date ASC";
        
        const result = await pool.query(query, params);
        res.json({ ok: true, availabilities: result.rows });
    } catch (err) {
        console.error("Get availability error:", err);
        res.status(500).json({ ok: false, error: err.message });
    }
});

// POST /api/availability -> GN only, to upsert availability
router.post("/", requireAuth, requireRole("GN"), async (req, res) => {
    try {
        const { date, status, start_time, end_time, note } = req.body;
        const gn_user_id = req.user.id;
        
        if (!date || !status) {
            return res.status(400).json({ ok: false, error: "Date and status are required." });
        }

        const validStatuses = ["AVAILABLE", "FIELD_VISIT", "UNAVAILABLE"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ ok: false, error: "Invalid status." });
        }

        const result = await pool.query(
            `INSERT INTO gn_availability (gn_user_id, date, status, start_time, end_time, note)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (gn_user_id, date) 
             DO UPDATE SET 
                status = EXCLUDED.status,
                start_time = EXCLUDED.start_time,
                end_time = EXCLUDED.end_time,
                note = EXCLUDED.note
             RETURNING *`,
            [gn_user_id, date, status, start_time || null, end_time || null, note || null]
        );
        
        res.json({ ok: true, availability: result.rows[0] });
    } catch (err) {
        console.error("Upsert availability error:", err);
        res.status(500).json({ ok: false, error: err.message });
    }
});

module.exports = router;
