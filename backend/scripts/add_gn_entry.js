const db = require("../config/db");

async function addGNEntry() {
    const email = "admin@gmail.com";
    const gnName = "Admin Officer"; // You can change this name

    try {
        // Get user_id from user_table
        const userResult = await db.query(
            "SELECT user_id FROM user_table WHERE email = $1",
            [email]
        );

        if (userResult.rows.length === 0) {
            console.log("❌ User not found in user_table");
            process.exit(1);
        }

        const userId = userResult.rows[0].user_id;

        // Check if already exists in grama_niladhari
        const checkGN = await db.query(
            "SELECT gn_id FROM grama_niladhari WHERE user_id = $1",
            [userId]
        );

        if (checkGN.rows.length > 0) {
            console.log("✅ User already exists in grama_niladhari table!");
            process.exit(0);
        }

        // Insert into grama_niladhari
        const result = await db.query(
            "INSERT INTO grama_niladhari (user_id, name) VALUES ($1, $2) RETURNING gn_id",
            [userId, gnName]
        );

        console.log("✅ Successfully added GN Officer to grama_niladhari table!");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("GN ID:", result.rows[0].gn_id);
        console.log("User ID:", userId);
        console.log("Name:", gnName);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("\n🎉 The GN Officer can now login with:");
        console.log(`   Email: ${email}`);
        console.log(`   Password: Admin@123`);

        process.exit(0);
    } catch (err) {
        console.error("❌ Error:", err.message);
        console.error("Details:", err);
        process.exit(1);
    }
}

addGNEntry();
