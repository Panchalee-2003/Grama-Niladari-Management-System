const fs = require('fs');
const file = 'routes/certificate.routes.js';
const lines = fs.readFileSync(file, 'utf8').split('\n');

const newRoute = `
// ─────────────────────────────────────────
// CITIZEN: Submit a certificate request
// ─────────────────────────────────────────
router.post("/", requireAuth, requireRole("CITIZEN"), async (req, res) => {
    try {
        const userId = req.user.id;
        const { cert_type, purpose, nic_number, request_data } = req.body;

        if (!cert_type || !CERT_TYPES.includes(cert_type))
            return res.status(400).json({ ok: false, error: "Invalid certificate type" });

        if (!nic_number)
            return res.status(400).json({ ok: false, error: "Please enter your NIC number or your family member's NIC number" });

        const citizenRow = await pool.query(
            "SELECT citizen_id, nic_number FROM citizen WHERE user_id=$1 LIMIT 1",
            [userId]
        );
        if (!citizenRow.rows.length)
            return res.status(400).json({ ok: false, error: "Citizen profile not found" });

        const citizen = citizenRow.rows[0];
        const citizen_id = citizen.citizen_id;

        let family_member_id = null;

        if (citizen.nic_number !== nic_number) {
            const memberCheck = await pool.query(
                \`SELECT fm.member_id FROM family_member fm
                 JOIN household h ON h.household_id = fm.household_id
                 WHERE fm.nic_number = $1 AND h.citizen_id = $2 LIMIT 1\`,
                [nic_number, citizen_id]
            );
            if (!memberCheck.rows.length)
                return res.status(400).json({ ok: false, error: "No citizen or family member found with the provided NIC number in your household" });

            family_member_id = memberCheck.rows[0].member_id;
        }

        if (cert_type === "Residence and character Certificate" || cert_type === "Character") {
            const result = await pool.query(
                \`INSERT INTO certificate_request (citizen_id, cert_type, purpose, family_member_id, nic_number, certificate_data, status, created_at, updated_at)
                 VALUES ($1,$2,$3,$4,$5,$6,'VISIT_REQUIRED',NOW(),NOW())
                 RETURNING request_id, cert_type, purpose, status, created_at\`,
                [citizen_id, cert_type, purpose?.trim() || null, family_member_id, nic_number, JSON.stringify(request_data || {})]
            );
            return res.status(201).json({ ok: true, request: result.rows[0], message: "Request received. Please visit the GN office for verification." });
        }

        const result = await pool.query(
            \`INSERT INTO certificate_request (citizen_id, cert_type, purpose, family_member_id, nic_number, certificate_data, status, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,'PENDING',NOW(),NOW())
       RETURNING request_id, cert_type, purpose, status, created_at\`,
            [citizen_id, cert_type, purpose?.trim() || null, family_member_id, nic_number, JSON.stringify(request_data || {})]
        );

        return res.status(201).json({ ok: true, request: result.rows[0], message: "Certificate requested successfully!" });
    } catch (err) {
        console.error("Submit Cert Request Error:", err);
        return res.status(500).json({ ok: false, error: err.message });
    }
});
`;

lines.splice(52, 197, newRoute.trim(), "");
fs.writeFileSync(file, lines.join('\n'));
console.log('Fixed post route!');
