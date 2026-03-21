const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function testAdminLogin() {
    const email = "staff@gmail.com";
    const password = "Admin@123";

    try {
        console.log("🔐 Testing Divisional Secretariat login...\n");

        // Step 1: Get user from database
        const result = await db.query(
            "SELECT user_id, email, password_hash, role, status FROM user_table WHERE email = $1 LIMIT 1",
            [email]
        );

        if (result.rows.length === 0) {
            console.log("❌ FAIL: User not found");
            process.exit(1);
        }

        const user = result.rows[0];
        console.log("✅ Step 1: User found in database");
        console.log(`   User ID: ${user.user_id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Status: ${user.status}`);

        // Step 2: Check status
        if (user.status !== "ACTIVE") {
            console.log("❌ FAIL: Account is inactive");
            process.exit(1);
        }
        console.log("✅ Step 2: Account is ACTIVE");

        // Step 3: Verify password
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            console.log("❌ FAIL: Password does not match");
            process.exit(1);
        }
        console.log("✅ Step 3: Password verified");

        // Step 4: Generate token
        const token = jwt.sign(
            { id: user.user_id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );
        console.log("✅ Step 4: JWT token generated");

        // Step 5: Return user data
        console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("🎉 LOGIN SUCCESSFUL!");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("\nResponse data:");
        console.log({
            ok: true,
            token: token.substring(0, 30) + "...",
            user: {
                id: user.user_id,
                email: user.email,
                role: user.role
            }
        });

        console.log("\n✅ The Divisional Secretariat login works!");
        console.log("   Login credentials:");
        console.log(`   Email: ${email}`);
        console.log(`   Password: ${password}`);
        console.log(`   Role: Divisional Secretariat`);
        console.log(`   Redirect: /admin-dashboard`);

        process.exit(0);
    } catch (err) {
        console.error("❌ Error:", err.message);
        process.exit(1);
    }
}

testAdminLogin();
