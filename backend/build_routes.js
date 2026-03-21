const fs = require('fs');
const lines = fs.readFileSync('routes/certificate.routes.js', 'utf8').split('\n');

const routeHeaders = [
    'router.get("/my-members"',
    'router.post("/"',
    'router.get("/my"',
    'router.get("/verify/:cert_uuid"',
    'router.get("/admin/stats"',
    'router.patch("/:id/update-status"',
    'router.patch("/:id/gn-action"',
    'router.patch("/:id/ds-action"',
    'router.get("/:id/citizen-pdf"',
    'router.patch("/:id/data"',
    'router.get("/:id/data"',
    'router.get("/:id/pdf"',
    'async function generatePDFWithPuppeteer',
    'module.exports = router;'
];

let valid = [];
// Get imports and arrays (until we hit the first router header)
for(let i=0; i < lines.length; i++) {
    if (lines[i].includes('router.get("/my-members"')) break;
    valid.push(lines[i]);
}

for (const header of routeHeaders) {
    valid.push("\n// ─────────────────────────────────────────");
    
    let startIdx = lines.findIndex(l => l.includes(header));
    if (startIdx === -1) continue;
    
    let endIdx = startIdx;
    let braceCount = 0;
    
    for (let j = startIdx; j < lines.length; j++) {
        if (!lines[j].trim().startsWith('//')) {
            braceCount += (lines[j].match(/\{/g) || []).length;
            braceCount -= (lines[j].match(/\}/g) || []).length;
        }
        
        if (braceCount === 0 && (lines[j].includes('});') || lines[j].includes('}') || lines[j].includes('module.exports'))) {
            endIdx = j;
            break;
        }
    }
    
    for (let j = startIdx; j <= endIdx; j++) {
        valid.push(lines[j]);
    }
}

fs.writeFileSync('routes/certificate.routes.js', valid.join('\n'));
console.log('Cleaned file seamlessly!');
