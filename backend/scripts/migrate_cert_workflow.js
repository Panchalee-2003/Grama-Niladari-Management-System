const pool = require('../config/db');

async function migrate() {
  try {
    await pool.query(`
      ALTER TABLE certificate_request ADD COLUMN IF NOT EXISTS gn_remarks TEXT;
      ALTER TABLE certificate_request ADD COLUMN IF NOT EXISTS appointment_date TIMESTAMPTZ;
      ALTER TABLE certificate_request ADD COLUMN IF NOT EXISTS required_documents_list TEXT;
      ALTER TABLE certificate_request ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
      ALTER TABLE certificate_request ADD COLUMN IF NOT EXISTS ds_signature_blob TEXT;
    `);
    console.log('✅ Migration successful: workflow columns added to certificate_request.');
    console.log('   Columns: gn_remarks, appointment_date, required_documents_list, rejection_reason, ds_signature_blob');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
  } finally {
    process.exit(0);
  }
}

migrate();
