const fs = require('fs');
const path = 'routes/certificate.routes.js';
let content = fs.readFileSync(path, 'utf8');

const postRegex1 = /\/\/ ─────────────────────────────────────────\r?\n\/\/ CITIZEN: Submit a certificate request\r?\n\/\/ ─────────────────────────────────────────\r?\nrouter\.post\("\/"[\s\S]*?\}\);\r?\n/;
// Replace first one with nothing (the corrupted one)
content = content.replace(postRegex1, '');

// Now the second one gets replaced with the correct block
const newPostBlock = `// ─────────────────────────────────────────
// CITIZEN: Submit a certificate request
// ─────────────────────────────────────────
router.post("/", requireAuth, requireRole("CITIZEN"), async (req, res) => {
    try {
        const userId = req.user.id;
        const { cert_type, purpose, nic_number, request_data } = req.body;

        if (!cert_type)
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
content = content.replace(postRegex1, newPostBlock);

const citizenPdfRegex = /\/\/ ─────────────────────────────────────────\r?\n\/\/ CITIZEN: Download their own approved certificate\r?\n\/\/ ─────────────────────────────────────────\r?\nrouter\.get\("\/:id\/citizen-pdf"[\s\S]*?\}\);\r?\n/;
const citizenPdfBlock = `// ─────────────────────────────────────────
// CITIZEN: Download their own approved certificate
// ─────────────────────────────────────────
router.get("/:id/citizen-pdf", requireAuth, requireRole("CITIZEN"), async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const result = await pool.query(
            \`SELECT cr.*, COALESCE(fm.full_name, c.full_name) AS applicant_name,
                    c.full_name AS citizen_name, c.nic_number AS citizen_nic
             FROM certificate_request cr
             JOIN citizen c ON c.citizen_id = cr.citizen_id
             LEFT JOIN family_member fm ON fm.member_id = cr.family_member_id
             WHERE cr.request_id=$1 AND c.user_id=$2\`,
            [id, userId]
        );
        if (!result.rows.length)
            return res.status(404).json({ ok: false, error: "Request not found or access denied" });

        const cert = result.rows[0];
        if (!["APPROVED", "ISSUED"].includes(cert.status))
            return res.status(403).json({ ok: false, error: "Certificate is not approved yet" });

        if (cert.cert_type === "Residence and character Certificate" || cert.cert_type === "Character") {
            return res.status(400).json({ ok: false, error: "This certificate requires an in-person visit and cannot be generated digitally."});
        }

        const data = cert.certificate_data || {};
        const certIdStr = cert.certificate_id;
        if (!certIdStr) return res.status(500).json({ ok: false, error: "Certificate ID not generated yet" });

        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        const verifyUrl = \`\${frontendUrl}/verify/\${certIdStr}\`;
        const qrBufferDataUri = await QRCode.toDataURL(verifyUrl, { width: 100, margin: 1 });

        const pdfBuffer = await generatePDFWithPuppeteer(cert, data, qrBufferDataUri);
        
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", \`attachment; filename="certificate_\${id}.pdf"\`);
        return res.send(pdfBuffer);
    } catch (err) {
        console.error("Citizen PDF Error:", err);
        if (!res.headersSent)
            return res.status(500).json({ ok: false, error: err.message });
    }
});
`;
content = content.replace(citizenPdfRegex, citizenPdfBlock);

const pdfRegex = /\/\/ ─────────────────────────────────────────\r?\n\/\/ GN & ADMIN: Generate & download certificate PDF\r?\n\/\/ ─────────────────────────────────────────\r?\nrouter\.get\("\/:id\/pdf"[\s\S]*?\}\);\r?\n/;
const pdfBlock = `// ─────────────────────────────────────────
// GN & ADMIN: Generate & download certificate PDF
// ─────────────────────────────────────────
router.get("/:id/pdf", requireAuth, requireRole("GN", "ADMIN"), async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            \`SELECT cr.*, COALESCE(fm.full_name, c.full_name) AS applicant_name,
                    c.full_name AS citizen_name, c.nic_number AS citizen_nic
             FROM certificate_request cr
             JOIN citizen c ON c.citizen_id = cr.citizen_id
             LEFT JOIN family_member fm ON fm.member_id = cr.family_member_id
             WHERE cr.request_id=$1\`,
            [id]
        );
        if (!result.rows.length) return res.status(404).json({ ok: false, error: "Request not found" });

        let cert = result.rows[0];
        
        if (cert.cert_type === "Residence and character Certificate" || cert.cert_type === "Character") {
            return res.status(400).json({ ok: false, error: "This certificate requires an in-person visit and cannot be generated digitally."});
        }

        if (!cert.certificate_id) {
            const newUuid = crypto.randomUUID();
            await pool.query("UPDATE certificate_request SET certificate_id=$1, issued_at=NOW() WHERE request_id=$2", [newUuid, id]);
            cert.certificate_id = newUuid;
            cert.issued_at = new Date();
        }

        const data = cert.certificate_data || {};
        const certIdStr = cert.certificate_id;
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        const verifyUrl = \`\${frontendUrl}/verify/\${certIdStr}\`;
        const qrBufferDataUri = await QRCode.toDataURL(verifyUrl, { width: 100, margin: 1 });

        const pdfBuffer = await generatePDFWithPuppeteer(cert, data, qrBufferDataUri);
        
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", \`attachment; filename="certificate_\${id}.pdf"\`);
        return res.send(pdfBuffer);
    } catch (err) {
        console.error("PDF Generate Error:", err);
        if (!res.headersSent) return res.status(500).json({ ok: false, error: err.message });
    }
});
`;
content = content.replace(pdfRegex, pdfBlock);

const renderCertRegex = /\/\/ ─────────────────────────────────────────\r?\n\/\/ PDF rendering per certificate type\r?\n\/\/ ─────────────────────────────────────────\r?\nfunction renderCertificate[\s\S]*?\}\r?\n/;
content = content.replace(renderCertRegex, '');

fs.writeFileSync(path, content);
console.log('Fixed entire logic explicitly');
