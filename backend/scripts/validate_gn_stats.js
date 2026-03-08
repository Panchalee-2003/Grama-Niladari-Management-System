const db = require("../config/db");

async function validate() {
    try {
        const [totalHH, pendingHH, verifiedHH, rejectedHH, totalC, openC, gnOfficers] = await Promise.all([
            db.query("SELECT COUNT(*) FROM household"),
            db.query("SELECT COUNT(*) FROM household WHERE status = 'PENDING'"),
            db.query("SELECT COUNT(*) FROM household WHERE status = 'VERIFIED'"),
            db.query("SELECT COUNT(*) FROM household WHERE status = 'REJECTED'"),
            db.query("SELECT COUNT(*) FROM complaint"),
            db.query("SELECT COUNT(*) FROM complaint WHERE status != 'RESOLVED'"),
            db.query("SELECT gn_id, name FROM grama_niladhari LIMIT 3"),
        ]);

        console.log("=== GN Dashboard Stats ===");
        console.log("Total Households:", totalHH.rows[0].count);
        console.log("Pending:", pendingHH.rows[0].count);
        console.log("Verified:", verifiedHH.rows[0].count);
        console.log("Rejected:", rejectedHH.rows[0].count);
        console.log("Total Complaints:", totalC.rows[0].count);
        console.log("Open Complaints:", openC.rows[0].count);
        console.log("GN Officers:", gnOfficers.rows);
        console.log("\n✅ All queries successful — GN stats route is ready!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Error:", err.message);
        process.exit(1);
    }
}

validate();
