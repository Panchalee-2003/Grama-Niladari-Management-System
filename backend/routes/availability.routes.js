const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { requireAuth, requireRole } = require("../middleware/auth.middleware");

// GET /api/availability/today -> public today's status for citizen dashboard
router.get("/today", requireAuth, async (req, res) => {
    try {
        // Use Asia/Colombo date to match the stored DATE values
        const todayStr = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Colombo" }); // "YYYY-MM-DD"
        const result = await pool.query(
            `SELECT * FROM gn_availability WHERE date = $1 ORDER BY availability_id ASC LIMIT 1`,
            [todayStr]
        );
        res.json({ ok: true, today: result.rows[0] || null, date: todayStr });
    } catch (err) {
        console.error("Get today availability error:", err);
        res.status(500).json({ ok: false, error: err.message });
    }
});

// GET /api/availability -> get availability for a date range
// GN role: only their own records; CITIZEN/others: all records
router.get("/", requireAuth, async (req, res) => {
    try {
        const { start_date, end_date } = req.query;
        
        // Build query - for GN role, filter by their user_id
        let query = "SELECT * FROM gn_availability";
        let params = [];
        let conditions = [];

        if (req.user.role === "GN") {
            conditions.push(`gn_user_id = $${params.length + 1}`);
            params.push(req.user.id);
        }

        if (start_date && end_date) {
            // Cast to DATE to avoid timezone issues with date-only comparisons
            conditions.push(`date >= $${params.length + 1}::DATE AND date <= $${params.length + 2}::DATE`);
            params.push(start_date, end_date);
        }

        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
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
             VALUES ($1, $2::DATE, $3, $4, $5, $6)
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

// DELETE /api/availability/:date -> GN only, remove availability for a date
router.delete("/:date", requireAuth, requireRole("GN"), async (req, res) => {
    try {
        const { date } = req.params;
        const gn_user_id = req.user.id;
        await pool.query(
            `DELETE FROM gn_availability WHERE gn_user_id = $1 AND date = $2::DATE`,
            [gn_user_id, date]
        );
        res.json({ ok: true });
    } catch (err) {
        console.error("Delete availability error:", err);
        res.status(500).json({ ok: false, error: err.message });
    }
});

module.exports = router;
