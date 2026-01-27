const db = require("../config/db");

async function checkGNOfficer() {
    const email = "admin@gmail.com";

    try {
        // Check user_table
        const userResult = await db.query(
            "SELECT user_id, email, role, status FROM user_table WHERE email = $1",
            [email]
        );

        if (userResult.rows.length === 0) {
            console.log("❌ User not found in user_table");
            process.exit(1);
        }

        const user = userResult.rows[0];
        console.log("✅ User found in user_table:");
        console.log(`   User ID: ${user.user_id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Status: ${user.status}`);

        // Check grama_niladhari table
        const gnResult = await db.query(
            "SELECT gn_id, user_id, name FROM grama_niladhari WHERE user_id = $1",
            [user.user_id]
        );

        if (gnResult.rows.length === 0) {
            console.log("\n⚠️  WARNING: User exists in user_table but NOT in grama_niladhari table!");
            console.log("   This user will NOT be able to login properly as a GN Officer.");
            console.log("\n💡 To fix this, you need to add an entry to grama_niladhari table.");
            console.log(`   Run this SQL: INSERT INTO grama_niladhari (user_id, name) VALUES (${user.user_id}, 'Admin Officer');`);
        } else {
            const gn = gnResult.rows[0];
            console.log("\n✅ User found in grama_niladhari table:");
            console.log(`   GN ID: ${gn.gn_id}`);
            console.log(`   User ID: ${gn.user_id}`);
            console.log(`   Name: ${gn.name}`);
            console.log("\n✅ This user is properly set up and can login!");
        }

        process.exit(0);
    } catch (err) {
        console.error("❌ Error:", err.message);
        process.exit(1);
    }
}

checkGNOfficer();
