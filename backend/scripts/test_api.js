const jwt = require("jsonwebtoken");
require('dotenv').config({ path: '../.env' });
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function run() {
    try {
        const uRes = await pool.query("SELECT user_id FROM user_table WHERE role='GN' LIMIT 1");
        if(uRes.rows.length === 0) return console.log("No GN user found!");
        
        const gn_user_id = uRes.rows[0].user_id;
        
        const token = jwt.sign({ id: gn_user_id, role: 'GN' }, process.env.JWT_SECRET, { expiresIn: "1h" });
        
        const res = await fetch("http://localhost:5000/api/availability", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                date: "2026-03-23",
                status: "AVAILABLE",
                start_time: "",
                end_time: "",
                note: ""
            })
        });
        
        const data = await res.json();
        console.log("Status:", res.status);
        console.log("Response:", JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Error:", err);
    } finally {
        pool.end();
    }
}

run();
