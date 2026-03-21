const db = require("../config/db");
const bcrypt = require("bcrypt");

async function addAdminStaff() {
    const email = "staff@gmail.com";
    const password = "Admin@123";
    const role = "ADMIN";

    try {
        // Check if user already exists
        const check = await db.query("SELECT user_id FROM user_table WHERE email = $1", [email]);
        if (check.rows.length > 0) {
            console.log("⚠️  User with this email already exists!");
            console.log("   Updating password and role instead...\n");

            // Update existing user
            const password_hash = await bcrypt.hash(password, 10);
            const result = await db.query(
                `UPDATE user_table 
         SET password_hash = $1, role = $2, status = 'ACTIVE'
         WHERE email = $3 
         RETURNING user_id, email, role, status`,
                [password_hash, role, email]
            );

            console.log("✅ Divisional Secretariat account updated successfully!");
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log("User ID:", result.rows[0].user_id);
            console.log("Email:", result.rows[0].email);
            console.log("Password:", password);
            console.log("Role:", result.rows[0].role);
            console.log("Status:", result.rows[0].status);
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        } else {
            // Hash password
            const password_hash = await bcrypt.hash(password, 10);

            // Insert new user (no separate admin table needed)
            const result = await db.query(
                `INSERT INTO user_table (email, password_hash, role, status, "created _at") 
         VALUES ($1, $2, $3, 'ACTIVE', CURRENT_TIMESTAMP) 
         RETURNING user_id, email, role, status`,
                [email, password_hash, role]
            );

            console.log("✅ Divisional Secretariat account created successfully!");
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log("User ID:", result.rows[0].user_id);
            console.log("Email:", result.rows[0].email);
            console.log("Password:", password);
            console.log("Role:", result.rows[0].role);
            console.log("Status:", result.rows[0].status);
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        }

        console.log("\n🔐 Login credentials:");
        console.log(`   Email: ${email}`);
        console.log(`   Password: ${password}`);
        console.log(`   Role: Divisional Secretariat`);

        process.exit(0);
    } catch (err) {
        console.error("❌ Error creating Divisional Secretariat:", err.message);
        console.error("Details:", err);
        process.exit(1);
    }
}

addAdminStaff();
