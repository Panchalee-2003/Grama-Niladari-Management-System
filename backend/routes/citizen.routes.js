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

router.get("/me/notifications", requireAuth, requireRole("CITIZEN"), async (req, res) => {
  try {
    const userId = req.user.id;
    const citizenRes = await pool.query("SELECT citizen_id FROM citizen WHERE user_id=$1 LIMIT 1", [userId]);
    if (citizenRes.rows.length === 0) return res.json({ ok: true, notifications: [] });
    
    const citizenId = citizenRes.rows[0].citizen_id;
    
    let notifications = [];

    // 1. Household status messages
    const hhRes = await pool.query(
      "SELECT household_id, status, rejection_reason, created_at FROM household WHERE citizen_id=$1 AND status != 'PENDING'",
      [citizenId]
    );
    hhRes.rows.forEach(hh => {
      notifications.push({
        id: `hh-${hh.household_id}`,
        title: `Household Registration ${hh.status}`,
        message: hh.status === 'VERIFIED' 
          ? "Your household registration has been verified and approved."
          : `Your application was rejected. ${hh.rejection_reason ? 'Reason: ' + hh.rejection_reason : ''}`,
        date: hh.created_at,
        isSuccess: hh.status === 'VERIFIED'
      });
    });

    // 2. Certificate status messages
    const certRes = await pool.query(
      "SELECT request_id, cert_type, status, gn_note, updated_at FROM certificate_request WHERE citizen_id=$1 AND status != 'PENDING'",
      [citizenId]
    );
    certRes.rows.forEach(c => {
      notifications.push({
        id: `cr-${c.request_id}`,
        title: `Certificate Request ${c.status}`,
        message: `Your request for ${c.cert_type} has been ${c.status.toLowerCase()}. ${c.gn_note ? 'GN Note: ' + c.gn_note : ''}`,
        date: c.updated_at,
        isSuccess: c.status === 'APPROVED'
      });
    });

    // Sort by date descending
    notifications.sort((a, b) => new Date(b.date) - new Date(a.date));

    return res.json({ ok: true, notifications });
  } catch (err) {
    console.error("Fetch notifications error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
