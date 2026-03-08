const db = require("../config/db");
async function run() {
    try {
        await db.query("ALTER TABLE complaint ADD COLUMN IF NOT EXISTS attachment_path TEXT");
        console.log("✅ attachment_path column added to complaint table");
        process.exit(0);
    } catch (err) {
        console.error("❌", err.message);
        process.exit(1);
    }
}
run();
