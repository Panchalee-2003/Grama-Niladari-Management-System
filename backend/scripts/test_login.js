const db = require("../config/db");
const bcrypt = require("bcrypt");

async function testLogin() {
    const email = "admin@gmail.com";
    const password = "Admin@123";

    try {
        // Get user from database
        const result = await db.query(
            "SELECT user_id, email, password_hash, role, status FROM user_table WHERE email = $1 LIMIT 1",
            [email]
        );

        if (result.rows.length === 0) {
            console.log("❌ User not found in database");
            process.exit(1);
        }

        const user = result.rows[0];
        console.log("✅ User found:");
        console.log(`   User ID: ${user.user_id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Status: ${user.status}`);
        console.log(`   Password Hash: ${user.password_hash.substring(0, 20)}...`);

        // Test password
        console.log("\n🔐 Testing password...");
        const match = await bcrypt.compare(password, user.password_hash);

        if (match) {
            console.log("✅ Password matches!");
        } else {
            console.log("❌ Password does NOT match!");
            console.log("\n💡 This means the password hash in the database is incorrect.");
            console.log("   You may need to update it with the correct hash.");
        }

        process.exit(0);
    } catch (err) {
        console.error("❌ Error:", err.message);
        process.exit(1);
    }
}

testLogin();
