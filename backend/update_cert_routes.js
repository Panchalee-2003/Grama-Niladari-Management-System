const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'routes', 'certificate.routes.js');
let code = fs.readFileSync(filePath, 'utf8');

// 1. Inject imports
if (!code.includes("const puppeteer")) {
    code = code.replace(
        'const { sendVisitNotification, sendRejectionNotification, sendApprovalNotification } = require("../services/email.service");',
        `const { sendVisitNotification, sendRejectionNotification, sendApprovalNotification } = require("../services/email.service");\nconst ejs = require("ejs");\nconst puppeteer = require("puppeteer");\nconst fs = require("fs");\nconst path = require("path");`
    );
}

// 2. The new generatePDFWithPuppeteer helper (append at end of file before module.exports)
const pdfHelper = `
async function generatePDFWithPuppeteer(cert, data, qrCodeDataUri) {
    const templatePath = path.join(__dirname, "../../frontend/public/certificates/template.ejs");
    const templateHtml = fs.readFileSync(templatePath, 'utf8');
    
    // Build context
    const issuedDate = cert.issued_at
        ? new Date(cert.issued_at).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })
        : new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
        
    // Convert data to the format we need
    let dependents = [];
    if (typeof data.dependents === "string") {
        dependents = data.dependents.split('\\n').filter(line => line.trim() !== '').map(line => {
            const parts = line.split('-').map(s => s.trim());
            return {
                name: parts[0] || "",
                relationship: parts[1] || "",
                age: parts[2] || ""
            };
        });
    } else if (Array.isArray(data.dependents)) {
        dependents = data.dependents;
    }
    const modifiedData = { ...data, dependents };

    const sigPath = path.join(__dirname, "../../frontend/public/signature.png");
    let gn_sig = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iNjAiPjx0ZXh0IHg9IjEwIiB5PSI0MCIgZm9udC1mYW1pbHk9ImN1cnNpdmUiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiMwMDAwODAiPkdyYW1hIE5pbGFkaGFyaTwvdGV4dD48L3N2Zz4=";
    try {
        if (fs.existsSync(sigPath)) {
            const sigBuffer = fs.readFileSync(sigPath);
            gn_sig = \`data:image/png;base64,\${sigBuffer.toString('base64')}\`;
        }
    } catch (e) {
        console.error("Error loading signature:", e);
    }
    const ds_sig = cert.status === "APPROVED" && [
        "Application for obtaining housing loan funds",
        "Income Certificate",
        "Registration of delayed births",
        "Registration of voluntary organizations"
    ].includes(cert.cert_type) 
        ? "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iNjAiPjx0ZXh0IHg9IjEwIiB5PSI0MCIgZm9udC1mYW1pbHk9ImN1cnNpdmUiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiMwMDAwODAiPkRpdiBTZWNyZXRhcnk8L3RleHQ+PC9zdmc+" 
        : null;

    const context = {
        certificate_id: cert.certificate_id || "PENDING",
        issued_at: issuedDate,
        qr_code_data_uri: qrCodeDataUri,
        cert_type: cert.cert_type,
        applicant_name: cert.applicant_name,
        nic_number: cert.nic_number,
        purpose: cert.purpose,
        dynamic_data: modifiedData,
        gn_signature_img: gn_sig,
        ds_signature_img: ds_sig
    };
    
    const html = ejs.render(templateHtml, context);
    
    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' } });
    await browser.close();
    
    return pdfBuffer;
}
`;

if (!code.includes("async function generatePDFWithPuppeteer")) {
    code = code.replace("module.exports = router;", pdfHelper + "\nmodule.exports = router;");
}


// Replace POST /api/certificate logic
const postLogicOldStart = `router.post("/", requireAuth, requireRole("CITIZEN"), async (req, res) => {`;
const postLogicOldEndRaw = `return res.status(201).json({ ok: true, request: result.rows[0] });
    } catch (err) {
        console.error("Submit Cert Request Error:", err);
        return res.status(500).json({ ok: false, error: err.message });
    }
});`;

const postLogicNew = `router.post("/", requireAuth, requireRole("CITIZEN"), async (req, res) => {
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

        // Logical Routing
        if (cert_type === "Residence and character Certificate" || cert_type === "Character") {
            const result = await pool.query(
                \`INSERT INTO certificate_request (citizen_id, cert_type, purpose, family_member_id, nic_number, certificate_data, status, created_at, updated_at)
                 VALUES ($1,$2,$3,$4,$5,$6,'VISIT_REQUIRED',NOW(),NOW())
                 RETURNING request_id, cert_type, purpose, status, created_at\`,
                [citizen_id, cert_type, purpose?.trim() || null, family_member_id, nic_number, JSON.stringify(request_data || {})]
            );
            return res.status(201).json({ ok: true, request: result.rows[0], message: "Request received. Please visit the GN office for verification." });
        }

        const autoApprove = ["Notification of the death of a pensioner", "Request for financial assistance from the President's fund for medical treatment"];
        
        let initialStatus = "PENDING_DS_APPROVAL";
        if (autoApprove.includes(cert_type)) {
            initialStatus = "APPROVED";
        }

        let certId = null;
        let issuedAt = null;
        if (initialStatus === "APPROVED") {
            certId = crypto.randomUUID();
            issuedAt = new Date();
        }

        const result = await pool.query(
            \`INSERT INTO certificate_request (citizen_id, cert_type, purpose, family_member_id, nic_number, certificate_data, status, certificate_id, issued_at, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW(),NOW())
       RETURNING request_id, cert_type, purpose, status, created_at\`,
            [citizen_id, cert_type, purpose?.trim() || null, family_member_id, nic_number, JSON.stringify(request_data || {}), initialStatus, certId, issuedAt]
        );

        return res.status(201).json({ ok: true, request: result.rows[0], message: "Request submitted successfully." });
    } catch (err) {
        console.error("Submit Cert Request Error:", err);
        return res.status(500).json({ ok: false, error: err.message });
    }
});`;

const postChunkStart = code.indexOf(postLogicOldStart);
const postChunkEnd = code.indexOf(postLogicOldEndRaw) + postLogicOldEndRaw.length;
if (postChunkStart !== -1 && postChunkEnd !== -1) {
    code = code.substring(0, postChunkStart) + postLogicNew + code.substring(postChunkEnd);
}

// Replace PDF rendering logic entirely using regex blocks
const getCitizenPdfRegex = /(router\.get\("\/:id\/citizen-pdf"[\s\S]*?)(?= \/\/\s*?─────────────────────────────────────────\n\/\/ GN: Save certificate form data)/m;
const getPdfRegex = /(router\.get\("\/:id\/pdf"[\s\S]*?)(?= \/\/\s*?─────────────────────────────────────────\n\/\/ ADMIN: Fetch stats for admin dashboard)/m;

const newCitizenPdf = `router.get("/:id/citizen-pdf", requireAuth, requireRole("CITIZEN"), async (req, res) => {
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

        if (!certIdStr)
            return res.status(500).json({ ok: false, error: "Certificate ID not generated yet" });

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

const newPdf = `router.get("/:id/pdf", requireAuth, requireRole("GN", "ADMIN"), async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch request data
        const result = await pool.query(
            \`SELECT cr.*, COALESCE(fm.full_name, c.full_name) AS applicant_name,
                    c.full_name AS citizen_name, c.nic_number AS citizen_nic
             FROM certificate_request cr
             JOIN citizen c ON c.citizen_id = cr.citizen_id
             LEFT JOIN family_member fm ON fm.member_id = cr.family_member_id
             WHERE cr.request_id=$1\`,
            [id]
        );
        if (!result.rows.length)
            return res.status(404).json({ ok: false, error: "Request not found" });

        let cert = result.rows[0];
        
        if (cert.cert_type === "Residence and character Certificate" || cert.cert_type === "Character") {
            return res.status(400).json({ ok: false, error: "This certificate requires an in-person visit and cannot be generated digitally."});
        }

        // Generate UUID if first time issuing
        if (!cert.certificate_id) {
            const newUuid = crypto.randomUUID();
            await pool.query(
                "UPDATE certificate_request SET certificate_id=$1, issued_at=NOW() WHERE request_id=$2",
                [newUuid, id]
            );
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
        if (!res.headersSent)
            return res.status(500).json({ ok: false, error: err.message });
    }
});
`;

code = code.replace(getCitizenPdfRegex, newCitizenPdf);
code = code.replace(getPdfRegex, newPdf);

fs.writeFileSync(filePath, code);
console.log('Routes successfully updated!');
