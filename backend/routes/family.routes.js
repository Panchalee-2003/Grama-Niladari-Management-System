const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { requireAuth, requireRole } = require("../middleware/auth.middleware");

// Add a family member to a household (Citizen only)
router.post("/", requireAuth, requireRole("CITIZEN"), async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      household_id,
      full_name,
      nic,
      dob,
      gender,
      relationship_to_head,
      civil_status,
      education_level,
      employment_status,
      religion,
      special_needs
    } = req.body;

    if (!household_id || !full_name) {
      return res.status(400).json({ ok: false, error: "household_id and full_name are required" });
    }

    // Ensure household belongs to this citizen
    const own = await pool.query(
      `SELECT h.household_id
       FROM household h
       JOIN citizen c ON c.citizen_id = h.citizen_id
       WHERE h.household_id=$1 AND c.user_id=$2 LIMIT 1`,
      [household_id, userId]
    );

    if (own.rows.length === 0) {
      return res.status(403).json({ ok: false, error: "You cannot add members to this household" });
    }

    const result = await pool.query(
      `INSERT INTO family_member
       (household_id, full_name, nic, dob, gender, relationship_to_head, civil_status,
        education_level, employment_status, religion, special_needs)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING member_id`,
      [
        household_id,
        full_name,
        nic || null,
        dob || null,
        gender || null,
        relationship_to_head || null,
        civil_status || null,
        education_level || null,
        employment_status || null,
        religion || null,
        special_needs || null
      ]
    );

    return res.status(201).json({ ok: true, member_id: result.rows[0].member_id });
  } catch (err) {
    if (err.code === "23505") { // Postgres unique violation
      return res.status(409).json({ ok: false, error: "NIC already exists" });
    }
    console.error(err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
