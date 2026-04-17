/**
 * One-time migration: add user_id FK to password_reset_otp table.
 * Run once: node scripts/migrate_otp_fk.js
 */
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user:     process.env.DB_USER,
    host:     process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port:     process.env.DB_PORT,
});

async function migrate() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Add user_id column (nullable first, so we can populate it)
        await client.query(`
            ALTER TABLE password_reset_otp
            ADD COLUMN IF NOT EXISTS user_id INTEGER;
        `);
        console.log('✔ user_id column added (or already exists).');

        // 2. Populate user_id from user_table for existing rows
        await client.query(`
            UPDATE password_reset_otp otp
            SET user_id = u.user_id
            FROM user_table u
            WHERE otp.email = u.email
              AND otp.user_id IS NULL;
        `);
        console.log('✔ Existing OTP rows populated with user_id.');

        // 3. Delete orphan OTPs (email not found in user_table)
        const deleted = await client.query(`
            DELETE FROM password_reset_otp
            WHERE user_id IS NULL;
        `);
        console.log(`✔ Removed ${deleted.rowCount} orphan OTP row(s) with no matching user.`);

        // 4. Set NOT NULL constraint
        await client.query(`
            ALTER TABLE password_reset_otp
            ALTER COLUMN user_id SET NOT NULL;
        `);
        console.log('✔ user_id set NOT NULL.');

        // 5. Add FK constraint (if it doesn't exist yet)
        await client.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_constraint
                    WHERE conname = 'password_reset_otp_user_id_fkey'
                ) THEN
                    ALTER TABLE password_reset_otp
                    ADD CONSTRAINT password_reset_otp_user_id_fkey
                    FOREIGN KEY (user_id)
                    REFERENCES user_table(user_id)
                    ON DELETE CASCADE;
                END IF;
            END$$;
        `);
        console.log('✔ Foreign key constraint added (user_id → user_table).');

        // 6. Add indexes
        await client.query(`CREATE INDEX IF NOT EXISTS idx_otp_user_id ON password_reset_otp(user_id);`);
        await client.query(`CREATE INDEX IF NOT EXISTS idx_otp_email   ON password_reset_otp(email);`);
        console.log('✔ Indexes created.');

        await client.query('COMMIT');
        console.log('\n✅ Migration complete. password_reset_otp now has a FK to user_table.');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('❌ Migration failed:', err.message);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

migrate();
