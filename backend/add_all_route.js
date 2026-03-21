const fs = require('fs');
const file = 'routes/certificate.routes.js';
let content = fs.readFileSync(file, 'utf8');

const routesToAdd = `
// ─────────────────────────────────────────
// GN & ADMIN: Get all certificate requests
// ─────────────────────────────────────────
router.get("/all", requireAuth, requireRole("GN", "ADMIN"), async (req, res) => {
    try {
        const { status } = req.query;
        let query = \`SELECT cr.*, COALESCE(fm.full_name, c.full_name) AS applicant_name,
                            c.full_name AS citizen_name, c.nic_number AS citizen_nic
                     FROM certificate_request cr
                     JOIN citizen c ON c.citizen_id = cr.citizen_id
                     LEFT JOIN family_member fm ON fm.member_id = cr.family_member_id\`;
        let params = [];
        
        if (status && status !== "ALL") {
            query += \` WHERE cr.status = $1\`;
            params.push(status);
        }
        
        query += \` ORDER BY cr.created_at DESC\`;
        
        const result = await pool.query(query, params);
        return res.json({ ok: true, requests: result.rows });
    } catch (err) {
        console.error("Get All Requests Error:", err);
        return res.status(500).json({ ok: false, error: err.message });
    }
});

// ─────────────────────────────────────────
// GN & ADMIN: Get specific request details
// ─────────────────────────────────────────
router.get("/:id", requireAuth, requireRole("GN", "ADMIN"), async (req, res) => {
    try {
        const { id } = req.params;
        if (id === "my" || id === "all" || id === "admin" || id === "verify") return res.status(404).json({ ok: false });
        
        const result = await pool.query(
            \`SELECT cr.*, COALESCE(fm.full_name, c.full_name) AS applicant_name,
                    c.full_name AS citizen_name, c.nic_number AS citizen_nic,
                    u.phone_number
             FROM certificate_request cr
             JOIN citizen c ON c.citizen_id = cr.citizen_id
             JOIN user_table u ON u.user_id = c.user_id
             LEFT JOIN family_member fm ON fm.member_id = cr.family_member_id
             WHERE cr.request_id=$1\`,
            [id]
        );
        if (!result.rows.length) return res.status(404).json({ ok: false, error: "Request not found" });
        return res.json({ ok: true, request: result.rows[0] });
    } catch (err) {
        console.error("Get Request Error:", err);
        return res.status(500).json({ ok: false, error: err.message });
    }
});

`;

content = content.replace('async function generatePDFWithPuppeteer', routesToAdd + 'async function generatePDFWithPuppeteer');
fs.writeFileSync(file, content);
console.log('Restored the missing /all and /:id routes!');
