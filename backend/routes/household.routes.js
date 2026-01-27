const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { requireAuth, requireRole } = require("../middleware/auth.middleware");
const { audit } = require("../middleware/audit.middleware");

// ✅ Create a household (Citizen only) + Audit log
router.post(
  "/",
  requireAuth,
  requireRole("CITIZEN"),
  audit("CREATE_HOUSEHOLD", "households"),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const {
        household_no,
        householder_name,
        address,
        water_supply,
        electricity_connection,
      } = req.body;

      if (!householder_name || !address) {
        return res
          .status(400)
          .json({ ok: false, error: "householder_name and address are required" });
      }

      // Find citizen_id for this user
      const citizenRows = await pool.query(
        "SELECT citizen_id FROM citizen WHERE user_id=$1 LIMIT 1",
        [userId]
      );

      if (citizenRows.rows.length === 0) {
        return res
          .status(400)
          .json({ ok: false, error: "Create citizen profile first" });
      }

      const citizenId = citizenRows.rows[0].citizen_id;

      const result = await pool.query(
        `INSERT INTO household
         (citizen_id, household_no, householder_name, address, water_supply, electricity_connection)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING household_id`,
        [
          citizenId,
          household_no || null,
          householder_name,
          address,
          water_supply || "NO",
          electricity_connection || "NO",
        ]
      );

      // ✅ This is what the audit middleware will store as entity_id
      res.locals.entity_id = result.rows[0].household_id;

      return res.status(201).json({ ok: true, household_id: result.rows[0].household_id });
    } catch (err) {
      if (err.code === "23505") {
        return res
          .status(409)
          .json({ ok: false, error: "Household number already exists for this citizen" });
      }
      console.error(err);
      return res.status(500).json({ ok: false, error: err.message });
    }
  }
);

// ✅ List my households (Citizen only)
router.get("/my", requireAuth, requireRole("CITIZEN"), async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT h.household_id, h.household_no, h.householder_name, h.address,
              h.water_supply, h.electricity_connection, h.created_at
       FROM household h
       JOIN citizen c ON c.citizen_id = h.citizen_id
       WHERE c.user_id=$1
       ORDER BY h.household_id DESC`,
      [userId]
    );

    return res.json({ ok: true, households: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
