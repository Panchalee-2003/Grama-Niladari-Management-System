const db = require("../config/db");
const bcrypt = require("bcrypt");

async function fixGNOfficer() {
    const email = "admin@gmail.com";
    const password = "Admin@123";
    const correctRole = "GN"; // Frontend expects "GN", not "GNOFFICER"

    try {
        // Hash the password correctly
        const password_hash = await bcrypt.hash(password, 10);

        // Update both password_hash and role
        const result = await db.query(
            `UPDATE user_table 
       SET password_hash = $1, role = $2 
       WHERE email = $3 
       RETURNING user_id, email, role`,
            [password_hash, correctRole, email]
        );

        if (result.rows.length === 0) {
            console.log("❌ User not found");
            process.exit(1);
        }

        console.log("✅ Successfully updated GN Officer account!");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("User ID:", result.rows[0].user_id);
        console.log("Email:", result.rows[0].email);
        console.log("Role:", result.rows[0].role);
        console.log("Password: Admin@123");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("\n🎉 You can now login with:");
        console.log(`   Email: ${email}`);
        console.log(`   Password: ${password}`);
        console.log(`   Role: GN Officer`);

        // Verify the password works
        console.log("\n🔐 Verifying password...");
        const match = await bcrypt.compare(password, password_hash);
        if (match) {
            console.log("✅ Password verification successful!");
        } else {
            console.log("❌ Password verification failed!");
        }

        process.exit(0);
    } catch (err) {
        console.error("❌ Error:", err.message);
        console.error("Details:", err);
        process.exit(1);
    }
}

fixGNOfficer();
