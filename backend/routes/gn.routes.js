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
        const [totalHH, totalComplaints] = await Promise.all([
            pool.query("SELECT COUNT(*) FROM household"),
            pool.query("SELECT COUNT(*) FROM complaint"),
        ]);

        return res.json({
            ok: true,
            stats: {
                total_households: parseInt(totalHH.rows[0].count),
                certificates_this_month: 0,   // certificate table not yet created
                complaints_received: parseInt(totalComplaints.rows[0].count),
                active_notices: 0,   // notice table not yet created
            },
        });
    } catch (err) {
        console.error("GN Stats Error:", err);
        return res.status(500).json({ ok: false, error: err.message });
    }
});

// GET /api/gn/allowances/filter — Filter citizens for allowances and aids
router.get("/allowances/filter", requireAuth, requireRole("GN"), async (req, res) => {
    try {
        const {
            age_group,
            income_range,
            employment_status,
            household_size,
            aid_type,
            special_needs
        } = req.query;

        // Base query joining family_member to household
        let queryStr = `
            SELECT DISTINCT m.member_id, m.full_name as name, m.nic_number as nic,
                   m.dob, m.employment_status, m.special_needs,
                   h.income_range,
                   (SELECT COUNT(*) FROM family_member fm WHERE fm.household_id = h.household_id) as hh_size
            FROM family_member m
            JOIN household h ON m.household_id = h.household_id
            WHERE h.status = 'VERIFIED'
        `;
        const queryParams = [];
        let paramIndex = 1;

        // Add filter conditions
        if (income_range) {
            queryStr += ` AND h.income_range = $${paramIndex}`;
            queryParams.push(income_range);
            paramIndex++;
        }

        if (employment_status) {
            queryStr += ` AND m.employment_status = $${paramIndex}`;
            queryParams.push(employment_status);
            paramIndex++;
        }

        if (special_needs) {
            queryStr += ` AND m.special_needs = $${paramIndex}`;
            queryParams.push(special_needs);
            paramIndex++;
        }

        if (aid_type) {
            // Need to join household_aid
            queryStr += ` AND EXISTS (
                SELECT 1 FROM household_aid ha
                WHERE ha.household_id = h.household_id
                AND ha.receiver_name = m.full_name
                AND ha.aid_type = $${paramIndex}
            )`;
            queryParams.push(aid_type);
            paramIndex++;
        }

        const result = await pool.query(queryStr, queryParams);
        let filteredMembers = result.rows;

        // Process derived attributes dynamically (age and household size)
        
        // 1. Filter by household_size
        if (household_size) {
            filteredMembers = filteredMembers.filter(m => {
                const size = parseInt(m.hh_size, 10);
                if (household_size === '1 - 2') return size >= 1 && size <= 2;
                if (household_size === '3 - 4') return size >= 3 && size <= 4;
                if (household_size === '5+') return size >= 5;
                return true;
            });
        }

        // 2. Filter by age_group
        // Calculate age
        const calculateAge = (dobString) => {
            if (!dobString) return 0;
            const dob = new Date(dobString);
            const diff_ms = Date.now() - dob.getTime();
            const age_dt = new Date(diff_ms); 
            return Math.abs(age_dt.getUTCFullYear() - 1970);
        };

        if (age_group) {
            filteredMembers = filteredMembers.filter(m => {
                const age = calculateAge(m.dob);
                if (age_group === '18 - 25') return age >= 18 && age <= 25;
                if (age_group === '26 - 40') return age >= 26 && age <= 40;
                if (age_group === '41 - 60') return age >= 41 && age <= 60;
                if (age_group === '60+') return age >= 60;
                return true;
            });
        }

        return res.json({
            ok: true,
            results: filteredMembers.map(m => ({
                id: m.member_id,
                name: m.name,
                nic: m.nic || 'N/A'
            }))
        });

    } catch (err) {
        console.error("GN Allowances Filter Error:", err);
        return res.status(500).json({ ok: false, error: err.message });
    }
});

module.exports = router;
