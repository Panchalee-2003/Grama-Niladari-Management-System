const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { requireAuth, requireRole } = require("../middleware/auth.middleware");

// GET /api/gn/profile — returns the logged-in GN officer's name
router.get("/profile", requireAuth, requireRole("GN"), async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT gn_id, name FROM grama_niladhari WHERE user_id=$1 LIMIT 1",
            [req.user.id]
        );
        return res.json({ ok: true, profile: result.rows[0] || null });
    } catch (err) {
        console.error("GN Profile Error:", err);
        return res.status(500).json({ ok: false, error: err.message });
    }
});

// GET /api/gn/stats — returns live dashboard counts
router.get("/stats", requireAuth, requireRole("GN"), async (req, res) => {
    try {
        const [totalHH, pendingHH, verifiedHH, rejectedHH, totalComplaints, openComplaints] =
            await Promise.all([
                pool.query("SELECT COUNT(*) FROM household"),
                pool.query("SELECT COUNT(*) FROM household WHERE status = 'PENDING'"),
                pool.query("SELECT COUNT(*) FROM household WHERE status = 'VERIFIED'"),
                pool.query("SELECT COUNT(*) FROM household WHERE status = 'REJECTED'"),
                pool.query("SELECT COUNT(*) FROM complaint"),
                pool.query("SELECT COUNT(*) FROM complaint WHERE status != 'RESOLVED'"),
            ]);

        return res.json({
            ok: true,
            stats: {
                total_households: parseInt(totalHH.rows[0].count),
                pending_households: parseInt(pendingHH.rows[0].count),
                verified_households: parseInt(verifiedHH.rows[0].count),
                rejected_households: parseInt(rejectedHH.rows[0].count),
                total_complaints: parseInt(totalComplaints.rows[0].count),
                open_complaints: parseInt(openComplaints.rows[0].count),
            },
        });
    } catch (err) {
        console.error("GN Stats Error:", err);
        return res.status(500).json({ ok: false, error: err.message });
    }
});

module.exports = router;
