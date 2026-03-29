const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'routes', 'certificate.routes.js');
let code = fs.readFileSync(filePath, 'utf8');

const dsActionIdx = code.indexOf('router.patch("/:id/ds-action"');
const beforeDsAction = code.substring(0, dsActionIdx);
let afterDsAction = code.substring(dsActionIdx);

// Convert all newlines to standard \n for easy regex
afterDsAction = afterDsAction.replace(/\r\n/g, '\n');

afterDsAction = afterDsAction.replace(
    /SET status='APPROVED', gn_remarks=COALESCE\(\$1, gn_remarks\),/g,
    "SET status='APPROVED', admin_status='VERIFIED', gn_remarks=COALESCE($1, gn_remarks),"
);

afterDsAction = afterDsAction.replace(
    /SET status='REJECTED', rejection_reason=\$1, updated_at=NOW\(\)/g,
    "SET status='REJECTED', admin_status='REJECTED', rejection_reason=$1, updated_at=NOW()"
);

// If it worked, we put it back together
fs.writeFileSync(filePath, beforeDsAction + afterDsAction, 'utf8');
console.log("Regex patch applied successfully!");
