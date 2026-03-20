const fs = require('fs');
const path = require('path');

function searchInFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('users') || content.includes('USERS')) {
            console.log("FOUND IN:", filePath);
        }
    } catch(e) {}
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === '.git' || file === 'uploads') continue;
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            walkDir(fullPath);
        } else {
            searchInFile(fullPath);
        }
    }
}

walkDir('d:\\Grama-Niladari-Management-System\\backend');
console.log("DONE SEARCH");
