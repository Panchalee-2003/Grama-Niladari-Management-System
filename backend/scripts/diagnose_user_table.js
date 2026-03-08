const db = require("../config/db");

async function diagnose() {
    try {
        console.log("=== Diagnosing user_table ===\n");

        // 1. Is it a TABLE or VIEW?
        const typeCheck = await db.query(`
      SELECT table_type FROM information_schema.tables
      WHERE table_name = 'user_table' AND table_schema = 'public'
    `);
        if (typeCheck.rows.length === 0) {
            console.log("❌ user_table NOT found in information_schema.tables");
        } else {
            console.log("➡ Table type:", typeCheck.rows[0].table_type);
        }

        // 2. If VIEW, get its definition
        const viewDef = await db.query(`
      SELECT view_definition FROM information_schema.views
      WHERE table_name = 'user_table' AND table_schema = 'public'
    `);
        if (viewDef.rows.length > 0) {
            console.log("\n📄 VIEW definition:\n", viewDef.rows[0].view_definition);
        } else {
            console.log("➡ Not a VIEW (or VIEW definition not found)");
        }

        // 3. Check for RULES
        const rules = await db.query(`
      SELECT rulename, definition FROM pg_rules WHERE tablename = 'user_table'
    `);
        console.log("\n📋 Rules on user_table:", rules.rows.length > 0 ? rules.rows : "None");

        // 4. Check for TRIGGERS
        const triggers = await db.query(`
      SELECT trigger_name, event_manipulation, action_statement
      FROM information_schema.triggers
      WHERE event_object_table = 'user_table'
    `);
        console.log("\n⚡ Triggers on user_table:", triggers.rows.length > 0 ? triggers.rows : "None");

        // 5. Actual columns via pg_attribute (most reliable)
        const cols = await db.query(`
      SELECT a.attname AS column_name,
             pg_catalog.format_type(a.atttypid, a.atttypmod) AS data_type
      FROM pg_catalog.pg_attribute a
      JOIN pg_catalog.pg_class c ON a.attrelid = c.oid
      JOIN pg_catalog.pg_namespace n ON c.relnamespace = n.oid
      WHERE c.relname = 'user_table'
        AND a.attnum > 0
        AND NOT a.attisdropped
        AND n.nspname = 'public'
    `);
        console.log("\n🗂 Columns (pg_attribute):", cols.rows);

        process.exit(0);
    } catch (err) {
        console.error("❌ Error:", err.message);
        process.exit(1);
    }
}

diagnose();
