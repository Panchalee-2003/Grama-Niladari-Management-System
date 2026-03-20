const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' });

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function run() {
    try {
        const uRes = await pool.query("SELECT * FROM user_table WHERE role='GN'");
        console.log("Users in user_table with role GN:", uRes.rows);
        
        const gRes = await pool.query("SELECT * FROM grama_niladhari");
        console.log("GNs in grama_niladhari table:", gRes.rows);
    } catch (err) {
        console.error("DB Error:", err);
    } finally {
        pool.end();
    }
}
run();
