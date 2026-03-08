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
        phone_number,
        income_source,
        govt_aid,
        income_range,
        notes,
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

      // ✅ Duplicate Prevention: one household per citizen
      const dupCheck = await pool.query(
        "SELECT household_id, status FROM household WHERE citizen_id=$1 LIMIT 1",
        [citizenId]
      );
      if (dupCheck.rows.length > 0) {
        return res.status(409).json({
          ok: false,
          duplicate: true,
          error: "You have already submitted a household registration.",
          existing: dupCheck.rows[0],
        });
      }

      const result = await pool.query(
        `INSERT INTO household
         (citizen_id, household_no, householder_name, address, water_supply,
          electricity_connection, phone_number, income_source, govt_aid,
          income_range, notes, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'PENDING')
         RETURNING household_id`,
        [
          citizenId,
          household_no || null,
          householder_name,
          address,
          water_supply || "NO",
          electricity_connection || "NO",
          phone_number || null,
          income_source || null,
          govt_aid || null,
          income_range || null,
          notes || null,
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
              h.water_supply, h.electricity_connection, h.status,
              h.rejection_reason, h.created_at
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

// ✅ Get all households – GN only (for the verification list page)
router.get("/all", requireAuth, requireRole("GN"), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT h.household_id, h.household_no, h.householder_name, h.address,
              h.water_supply, h.electricity_connection, h.phone_number,
              h.income_source, h.govt_aid, h.income_range, h.notes,
              h.status, h.created_at,
              COUNT(f.member_id)::int AS member_count
       FROM household h
       LEFT JOIN family_member f ON f.household_id = h.household_id
       GROUP BY h.household_id
       ORDER BY h.created_at DESC`
    );

    return res.json({ ok: true, households: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// ✅ Get single household + family members – GN only (for detail page)
router.get("/:id/detail", requireAuth, requireRole("GN"), async (req, res) => {
  try {
    const { id } = req.params;

    const hhResult = await pool.query(
      `SELECT h.household_id, h.household_no, h.householder_name, h.address,
              h.water_supply, h.electricity_connection, h.phone_number,
              h.income_source, h.govt_aid, h.income_range, h.notes,
              h.status, h.rejection_reason, h.created_at
       FROM household h
       WHERE h.household_id = $1 LIMIT 1`,
      [id]
    );

    if (hhResult.rows.length === 0) {
      return res.status(404).json({ ok: false, error: "Household not found" });
    }

    const membersResult = await pool.query(
      `SELECT member_id, full_name, nic_number, dob, gender,
              relationship_to_head, civil_status,
              education_level, employment_status, religion, special_needs
       FROM family_member
       WHERE household_id = $1
       ORDER BY member_id ASC`,
      [id]
    );

    return res.json({
      ok: true,
      household: hhResult.rows[0],
      members: membersResult.rows,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// ✅ Update household status – GN only (verify / reject with reason)
router.patch("/:id/status", requireAuth, requireRole("GN"), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejection_reason } = req.body;

    const allowed = ["VERIFIED", "REJECTED", "PENDING"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ ok: false, error: "Invalid status value" });
    }

    if (status === "REJECTED" && !rejection_reason?.trim()) {
      return res.status(400).json({ ok: false, error: "A rejection reason is required" });
    }

    // Compute rejection_reason in JS to avoid PostgreSQL type-inference
    // issues that arise from reusing $1 inside a CASE expression.
    const reasonValue = status === "REJECTED" ? (rejection_reason?.trim() || null) : null;

    const result = await pool.query(
      `UPDATE household
       SET status=$1,
           rejection_reason=$2
       WHERE household_id=$3
       RETURNING household_id, status, rejection_reason`,
      [status, reasonValue, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ ok: false, error: "Household not found" });
    }

    return res.json({ ok: true, household: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// ✅ Citizen re-submits a REJECTED household (resets to PENDING with new data)
router.patch("/:id/resubmit", requireAuth, requireRole("CITIZEN"), async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const {
      householder_name,
      household_no,
      address,
      water_supply,
      electricity_connection,
      phone_number,
      income_source,
      govt_aid,
      income_range,
      notes,
    } = req.body;

    if (!householder_name || !address) {
      return res.status(400).json({ ok: false, error: "householder_name and address are required" });
    }

    // Verify the household belongs to this citizen and is REJECTED
    const check = await pool.query(
      `SELECT h.household_id FROM household h
       JOIN citizen c ON c.citizen_id = h.citizen_id
       WHERE h.household_id=$1 AND c.user_id=$2 AND h.status='REJECTED' LIMIT 1`,
      [id, userId]
    );

    if (check.rows.length === 0) {
      return res.status(403).json({ ok: false, error: "Cannot resubmit this application" });
    }

    const result = await pool.query(
      `UPDATE household SET
         householder_name=$1, household_no=$2, address=$3,
         water_supply=$4, electricity_connection=$5, phone_number=$6,
         income_source=$7, govt_aid=$8, income_range=$9, notes=$10,
         status='PENDING', rejection_reason=NULL
       WHERE household_id=$11
       RETURNING household_id`,
      [
        householder_name, household_no || null, address,
        water_supply || "NO", electricity_connection || "NO", phone_number || null,
        income_source || null, govt_aid || null, income_range || null, notes || null,
        id,
      ]
    );

    return res.json({ ok: true, household_id: result.rows[0].household_id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
