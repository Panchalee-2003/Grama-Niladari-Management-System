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
        const result = await pool.query(
            `INSERT INTO gn_availability (gn_user_id, date, status, start_time, end_time, note)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (gn_user_id, date) 
             DO UPDATE SET 
                status = EXCLUDED.status,
                start_time = EXCLUDED.start_time,
                end_time = EXCLUDED.end_time,
                note = EXCLUDED.note
             RETURNING *`,
            [1, '2026-03-20', 'AVAILABLE', null, null, null]
        );
        console.log("Success:", result.rows[0]);
    } catch (err) {
        console.error("DB Error:", err);
    } finally {
        pool.end();
    }
}
run();
