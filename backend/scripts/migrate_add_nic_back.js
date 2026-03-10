const db = require("../config/db");

async function migrate() {
    try {
        await db.query("BEGIN");

        await db.query(`
      DO $$
      BEGIN
        -- Add nic_number column back if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'certificate_request' AND column_name = 'nic_number'
        ) THEN
          ALTER TABLE certificate_request ADD COLUMN nic_number VARCHAR(20);
        END IF;
      END
      $$;
    `);

        console.log("✅ Added nic_number column to certificate_request");
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
