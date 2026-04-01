const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { requireAuth, requireRole } = require("../middleware/auth.middleware");
const PDFDocument = require("pdfkit-table");

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
        const [hhStats, compStats, totalNotices, certStats] = await Promise.all([
            pool.query(`
                SELECT 
                    COUNT(*) as total,
                    COALESCE(SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END), 0) as pending,
                    COALESCE(SUM(CASE WHEN status = 'VERIFIED' THEN 1 ELSE 0 END), 0) as verified,
                    COALESCE(SUM(CASE WHEN status = 'REJECTED' THEN 1 ELSE 0 END), 0) as rejected
                FROM household
            `),
            pool.query(`
                SELECT 
                    COUNT(*) as total,
                    COALESCE(SUM(CASE WHEN status IN ('PENDING', 'PROCESSING') THEN 1 ELSE 0 END), 0) as open_complaints
                FROM complaint
            `),
            pool.query("SELECT COUNT(*) FROM notice"),
            pool.query(`
                SELECT COUNT(*) as issued_this_month
                FROM certificate_request
                WHERE status = 'APPROVED'
                  AND COALESCE(issued_at, updated_at) >= NOW() - INTERVAL '30 days'
            `),
        ]);

        return res.json({
            ok: true,
            stats: {
                total_households: parseInt(hhStats.rows[0].total),
                pending_households: parseInt(hhStats.rows[0].pending),
                verified_households: parseInt(hhStats.rows[0].verified),
                rejected_households: parseInt(hhStats.rows[0].rejected),

                total_complaints: parseInt(compStats.rows[0].total),
                open_complaints: parseInt(compStats.rows[0].open_complaints),
                complaints_received: parseInt(compStats.rows[0].total),

                certificates_this_month: parseInt(certStats.rows[0].issued_this_month || 0),
                active_notices: parseInt(totalNotices.rows[0].count),
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

// GET /api/gn/allowances/download-pdf — Downloads PDF of filtered citizens
router.get("/allowances/download-pdf", requireAuth, requireRole("GN"), async (req, res) => {
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

        // Generate PDF
        const doc = new PDFDocument({ margin: 30, size: 'A4' });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="eligible_citizens.pdf"');

        doc.pipe(res);

        doc.fontSize(20).text("Eligible Citizens Report", { align: "center" });
        doc.moveDown(0.5);

        // Add filter criteria to the header
        doc.fontSize(12);
        const filtersUsed = [];
        if (age_group) filtersUsed.push(`Age Group: ${age_group}`);
        if (income_range) filtersUsed.push(`Income Range: ${income_range}`);
        if (employment_status) filtersUsed.push(`Employment Status: ${employment_status}`);
        if (household_size) filtersUsed.push(`Household Size: ${household_size}`);
        if (aid_type) filtersUsed.push(`Aid Type: ${aid_type}`);
        if (special_needs) filtersUsed.push(`Special Needs: ${special_needs}`);

        if (filtersUsed.length > 0) {
            doc.text("Filters Applied:", { underline: true });
            doc.moveDown(0.2);
            doc.fontSize(11);
            filtersUsed.forEach(f => doc.text(`• ${f}`));
        } else {
            doc.text("Filters Applied: None");
        }
        
        doc.moveDown();

        const table = {
            title: "Filtered Results",
            headers: ["Member ID", "Name", "NIC"],
            rows: filteredMembers.map(m => [
                m.member_id ? m.member_id.toString() : 'N/A',
                m.name ? m.name.toString() : 'N/A',
                m.nic ? m.nic.toString() : 'N/A'
            ])
        };

        if (filteredMembers.length === 0) {
            doc.fontSize(12).text("No citizens match the selected criteria.", { align: "center" });
        } else {
            await doc.table(table, {
                prepareHeader: () => doc.fontSize(10),
                prepareRow: (row, i) => doc.fontSize(10)
            });
        }

        doc.end();

    } catch (err) {
        console.error("GN Allowances PDF Generate Error:", err);
        return res.status(500).json({ ok: false, error: err.message });
    }
});

// Endpoint to get GN's basic profile info
router.get("/me/profile", requireAuth, requireRole("GN"), async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      `SELECT user_id, email, role, status FROM user_table WHERE user_id=$1 LIMIT 1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ ok: false, error: "GN Profile not found" });
    }

    return res.json({ ok: true, profile: result.rows[0] });
  } catch (err) {
    console.error("GN Profile fetch error:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
