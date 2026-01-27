const db = require("../config/db");

async function checkAdminTable() {
    try {
        // Check if there's an admin-specific table
        const tables = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE '%admin%'
      ORDER BY table_name;
    `);

        console.log("📋 Admin-related tables:");
        if (tables.rows.length === 0) {
            console.log("  (none found)");
        } else {
            tables.rows.forEach(row => console.log(`  - ${row.table_name}`));
        }

        // Check all tables again
        console.log("\n📋 All tables in database:");
        const allTables = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
        allTables.rows.forEach(row => console.log(`  - ${row.table_name}`));

        process.exit(0);
    } catch (err) {
        console.error("❌ Error:", err.message);
        process.exit(1);
    }
}

checkAdminTable();
