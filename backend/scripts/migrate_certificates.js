const db = require("../config/db");

async function migrate() {
  try {
    await db.query("BEGIN");

    await db.query(`
      CREATE TABLE IF NOT EXISTS certificate_request (
        request_id      SERIAL PRIMARY KEY,
        citizen_id      INTEGER REFERENCES citizen(citizen_id),
        cert_type       VARCHAR(100) NOT NULL,
        purpose         TEXT,
        nic_number      VARCHAR(20),
        status          VARCHAR(20) NOT NULL DEFAULT 'PENDING',
        gn_note         TEXT,
        created_at      TIMESTAMPTZ DEFAULT NOW(),
        updated_at      TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    console.log("✅ certificate_request table created");

    await db.query("COMMIT");
    console.log("🎉 Done!");
    process.exit(0);
  } catch (err) {
    await db.query("ROLLBACK");
    console.error("❌", err.message);
    process.exit(1);
  }
}
migrate();
