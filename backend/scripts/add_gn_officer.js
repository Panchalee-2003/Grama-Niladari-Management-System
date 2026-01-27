const db = require("../config/db");
const bcrypt = require("bcrypt");

async function addGNOfficer() {
    const email = "admin@gmail.com";
    const password = "Admin@123";
    const role = "GNOFFICER";
    const gnName = "Admin Officer"; // Change this to the actual GN Officer name

    try {
        // Check if user already exists
        const check = await db.query("SELECT user_id FROM user_table WHERE email = $1", [email]);
        if (check.rows.length > 0) {
            console.log("❌ User with this email already exists!");
            process.exit(1);
        }

        // Hash password
        const password_hash = await bcrypt.hash(password, 10);

        // Start transaction
        await db.query('BEGIN');

        try {
            // 1. Insert into user_table
            const userResult = await db.query(
                `INSERT INTO user_table (email, password_hash, role, status, "created _at") 
         VALUES ($1, $2, $3, 'ACTIVE', CURRENT_TIMESTAMP) 
         RETURNING user_id`,
                [email, password_hash, role]
            );

            const newUserID = userResult.rows[0].user_id;

            // 2. Insert into grama_niladhari table
            await db.query(
                "INSERT INTO grama_niladhari (user_id, name) VALUES ($1, $2)",
                [newUserID, gnName]
            );

            // Commit transaction
            await db.query('COMMIT');

            console.log("✅ GN Officer created successfully!");
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log("User ID:", newUserID);
            console.log("Email:", email);
            console.log("Password:", password);
            console.log("Role:", role);
            console.log("Name:", gnName);
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log("\n🔐 Login credentials:");
            console.log(`   Email: ${email}`);
            console.log(`   Password: ${password}`);

            process.exit(0);
        } catch (err) {
            // Rollback on error
            await db.query('ROLLBACK');
            throw err;
        }

    } catch (err) {
        console.error("❌ Error creating GN Officer:", err.message);
        console.error("Details:", err);
        process.exit(1);
    }
}

addGNOfficer();
