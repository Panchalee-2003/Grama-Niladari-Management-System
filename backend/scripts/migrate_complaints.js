const db = require("../config/db");

async function migrate() {
    try {
        console.log("🔄 Running complaint migration...\n");

        await db.query("BEGIN");

        // 1. Add citizen_id to complaint (nullable for backward compat)
        await db.query(`
      ALTER TABLE complaint
        ADD COLUMN IF NOT EXISTS citizen_id INTEGER REFERENCES citizen(citizen_id),
        ADD COLUMN IF NOT EXISTS description TEXT,
        ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW()
    `);
        console.log("✅ complaint table altered (citizen_id, description, created_at)");

        // 2. Create complaint_response table
        await db.query(`
      CREATE TABLE IF NOT EXISTS complaint_response (
        response_id  SERIAL PRIMARY KEY,
        complaint_id INTEGER NOT NULL REFERENCES complaint(complaint_id) ON DELETE CASCADE,
        gn_id        INTEGER REFERENCES grama_niladhari(gn_id),
        message      TEXT NOT NULL,
        created_at   TIMESTAMPTZ DEFAULT NOW()
      )
    `);
        console.log("✅ complaint_response table created");

        await db.query("COMMIT");
        console.log("\n🎉 Migration complete!");
        process.exit(0);
    } catch (err) {
        await db.query("ROLLBACK");
        console.error("❌ Migration failed:", err.message);
        process.exit(1);
    }
}

migrate();
