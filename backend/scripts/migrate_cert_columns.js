const pool = require('../config/db');

async function migrate() {
  try {
    await pool.query(`
      ALTER TABLE certificate_request ADD COLUMN IF NOT EXISTS certificate_data JSONB;
      ALTER TABLE certificate_request ADD COLUMN IF NOT EXISTS certificate_id UUID;
      ALTER TABLE certificate_request ADD COLUMN IF NOT EXISTS issued_at TIMESTAMPTZ;
    `);
    console.log('Migration successful: certificate_data, certificate_id, issued_at columns added.');
  } catch (err) {
    console.error('Migration failed:', err.message);
  } finally {
    process.exit(0);
  }
}

migrate();
