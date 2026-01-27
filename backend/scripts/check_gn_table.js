const db = require("../config/db");
const fs = require("fs");

async function checkGNStructure() {
    try {
        let output = "";

        // Check grama_niladhari table structure
        output += "✅ Grama_niladhari table structure:\n";
        const gnCols = await db.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'grama_niladhari'
      ORDER BY ordinal_position;
    `);
        gnCols.rows.forEach(row => {
            output += `  ${row.column_name} (${row.data_type}) - Nullable: ${row.is_nullable}\n`;
        });

        console.log(output);
        fs.writeFileSync("scripts/gn_structure.txt", output);
        console.log("\n✅ Output saved to scripts/gn_structure.txt");

        process.exit(0);
    } catch (err) {
        console.error("❌ Error:", err.message);
        process.exit(1);
    }
}

checkGNStructure();
