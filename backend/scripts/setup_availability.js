const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function run() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS gn_availability (
                availability_id SERIAL PRIMARY KEY,
                gn_user_id INTEGER REFERENCES user_table(user_id) ON DELETE CASCADE,
                date DATE NOT NULL,
                status VARCHAR(50) NOT NULL CHECK (status IN ('AVAILABLE', 'FIELD_VISIT', 'UNAVAILABLE')),
                start_time TIME,
                end_time TIME,
                note TEXT,
                UNIQUE(gn_user_id, date)
            );
        `);
        console.log("gn_availability table created successfully!");
    } catch (err) {
        console.error("Error creating table:", err);
    } finally {
        pool.end();
    }
}

run();
