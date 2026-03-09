const db = require("../config/db");

async function migrate() {
    try {
        await db.query("BEGIN");

        // Rename contact_number → nic_number if it still exists as contact_number
        await db.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'certificate_request' AND column_name = 'contact_number'
        ) THEN
          ALTER TABLE certificate_request RENAME COLUMN contact_number TO nic_number;
        END IF;
      END
      $$;
    `);

        console.log("✅ Renamed contact_number → nic_number in certificate_request");
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
