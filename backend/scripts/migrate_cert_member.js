const db = require("../config/db");

async function migrate() {
    try {
        await db.query("BEGIN");

        await db.query(`
      DO $$
      BEGIN
        -- Drop nic_number column if it exists
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'certificate_request' AND column_name = 'nic_number'
        ) THEN
          ALTER TABLE certificate_request DROP COLUMN nic_number;
        END IF;

        -- Add family_member_id column if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'certificate_request' AND column_name = 'family_member_id'
        ) THEN
          ALTER TABLE certificate_request
            ADD COLUMN family_member_id INTEGER REFERENCES family_member(member_id) ON DELETE SET NULL;
        END IF;
      END
      $$;
    `);

        console.log("✅ Swapped nic_number → family_member_id in certificate_request");
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
