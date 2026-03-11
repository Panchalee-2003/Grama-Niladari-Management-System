const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

async function run() {
    try {
        const sql = fs.readFileSync(path.join(__dirname, 'add_household_aid.sql'), 'utf8');
        await pool.query(sql);
        console.log("Successfully created household_aid table.");
    } catch (err) {
        console.error("Error creating table:", err);
    } finally {
        process.exit();
    }
}
run();
