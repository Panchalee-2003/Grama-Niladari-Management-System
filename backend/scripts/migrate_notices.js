const db = require("../config/db");

async function migrate() {
    try {
        console.log("🔄 Creating notice table...\n");
        await db.query("BEGIN");

        await db.query(`
      CREATE TABLE IF NOT EXISTS notice (
        notice_id   SERIAL PRIMARY KEY,
        gn_id       INTEGER REFERENCES grama_niladhari(gn_id),
        title       VARCHAR(255) NOT NULL,
        description TEXT,
        notice_date DATE,
        image_path  TEXT,
        created_at  TIMESTAMPTZ DEFAULT NOW()
      )
    `);
        console.log("✅ notice table created");

        await db.query("COMMIT");
        console.log("\n🎉 Done!");
        process.exit(0);
    } catch (err) {
        await db.query("ROLLBACK");
        console.error("❌", err.message);
        process.exit(1);
    }
}
migrate();
