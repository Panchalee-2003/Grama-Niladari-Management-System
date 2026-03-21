const fs = require('fs');

const path = 'routes/certificate.routes.js';
let lines = fs.readFileSync(path, 'utf8').split('\n');

// Find the second instance of "const DS_APPROVAL_TYPES" and remove till the second "];"
let firstDS = -1;
let secondDS = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('const DS_APPROVAL_TYPES = [')) {
        if (firstDS === -1) firstDS = i;
        else secondDS = i;
    }
}

if (secondDS !== -1) {
    // We want to delete from the line before (which is the comment) down to the end of CERT_TYPES.
    // Let's just remove exactly lines 132 to 148 since that's where view_file showed them.
    // Or dynamically: remove from secondDS - 1 to next next ];
    let endRemoval = secondDS;
    let bracketsSeen = 0;
    while (bracketsSeen < 2 && endRemoval < lines.length) {
        if (lines[endRemoval].includes('];')) {
            bracketsSeen++;
        }
        endRemoval++;
    }
    
    // Check if line before is comment
    let startRemoval = secondDS;
    if (lines[secondDS - 1].includes('// Certificate types that require DS')) {
        startRemoval = secondDS - 1;
    }
    
    lines.splice(startRemoval, endRemoval - startRemoval);
}

fs.writeFileSync(path, lines.join('\n'));
console.log('Fixed duplications!');
