const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { requireAuth, requireRole } = require("../middleware/auth.middleware");

// Create/Update citizen profile (citizens table)
router.post("/me/profile", requireAuth, requireRole("CITIZEN"), async (req, res) => {
  try {
    const userId = req.user.id;
    const { nic, phone } = req.body;

    if (!nic) return res.status(400).json({ ok: false, error: "NIC is required" });

    // check if citizen exists for this user
    const result = await pool.query("SELECT citizen_id FROM citizen WHERE user_id=$1 LIMIT 1", [userId]);

    if (result.rows.length === 0) {
      await pool.query(
        "INSERT INTO citizen (user_id, nic_number, phone_number) VALUES ($1, $2, $3)",
        [userId, nic, phone || null]
      );
      return res.status(201).json({ ok: true, message: "Citizen profile created" });
    } else {
      await pool.query(
        "UPDATE citizen SET nic_number=$1, phone_number=$2 WHERE user_id=$3",
        [nic, phone || null, userId]
      );
      return res.json({ ok: true, message: "Citizen profile updated" });
    }
  } catch (err) {
    if (err.code === "23505") { // Postgres unique violation code
      return res.status(409).json({ ok: false, error: "NIC already exists" });
    }
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Get citizen profile
router.get("/me/profile", requireAuth, requireRole("CITIZEN"), async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      `SELECT c.citizen_id, c.nic_number as nic, c.phone_number as phone, c.full_name, u.email
       FROM citizen c
       JOIN user_table u ON u.user_id = c.user_id
       WHERE c.user_id=$1 LIMIT 1`,
      [userId]
    );

    return res.json({ ok: true, profile: result.rows[0] || null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
