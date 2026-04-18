const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateOTP, printOTPToTerminal, getOTPExpiry } = require("../utils/otp");

const signToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });
};

exports.register = async (req, res) => {
  // Note: We include nic_number and phone_number as per your citizen table requirements
  const { email, password, full_name, nic_number, phone_number } = req.body;

  if (!email || !password || !full_name || !nic_number || !phone_number) {
    return res.status(400).json({ ok: false, error: "Required fields are missing" });
  }

  // Regex Patterns for validation
  const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  const nicPattern = /^([0-9]{9}[VvXx]|[0-9]{12})$/;
  const phonePattern = /^0[0-9]{9}$/;

  if (!emailPattern.test(email)) {
    return res.status(400).json({ ok: false, error: "Invalid email address format" });
  }

  if (!nicPattern.test(nic_number)) {
    return res.status(400).json({ ok: false, error: "Invalid NIC format" });
  }

  if (!phonePattern.test(phone_number)) {
    return res.status(400).json({ ok: false, error: "Invalid phone number format" });
  }

  try {
    // 1. Check if the email already exists in user_table
    const emailCheck = await db.query("SELECT user_id FROM user_table WHERE email = $1", [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(409).json({ ok: false, error: "Email already registered" });
    }

    // 2. Check if the NIC already exists in citizen table
    const nicCheck = await db.query("SELECT citizen_id FROM citizen WHERE nic_number = $1", [nic_number]);
    if (nicCheck.rows.length > 0) {
      return res.status(409).json({ ok: false, error: "NIC already registered" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    // --- Start Transaction ---
    await db.query('BEGIN');

    // 3. Insert into user_table
    // Note: PostgreSQL uses $1, $2 syntax and returns rows, not insertId
    // Including created _at (note the space in column name) with current timestamp
    const userResult = await db.query(
      `INSERT INTO user_table (email, password_hash, role, status, "created _at") 
       VALUES ($1, $2, 'CITIZEN', 'ACTIVE', CURRENT_TIME) 
       RETURNING user_id`,
      [email, password_hash]
    );

    const newUserID = userResult.rows[0].user_id;

    // 4. Insert into citizen table using the new user_id
    await db.query(
      "INSERT INTO citizen (user_id, nic_number, full_name, phone_number) VALUES ($1, $2, $3, $4)",
      [newUserID, nic_number, full_name, phone_number]
    );

    // Commit the transaction
    await db.query('COMMIT');

    return res.status(201).json({
      ok: true,
      message: "Citizen registered successfully",
      user_id: newUserID
    });

  } catch (err) {
    // Rollback in case of any error during the transaction
    await db.query('ROLLBACK');
    console.error("Registration Error:", err);
    console.error("Error Details:", {
      message: err.message,
      code: err.code,
      detail: err.detail,
      table: err.table,
      column: err.column,
      constraint: err.constraint
    });
    return res.status(500).json({ ok: false, error: "Internal Server Error", details: err.message });
  }
};
// ✅ Login (Citizen/GN/Admin)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ ok: false, error: "Email and password required" });
    }

    const result = await db.query(
      "SELECT user_id, email, password_hash, role, status FROM user_table WHERE email = $1 LIMIT 1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ ok: false, error: "Invalid credentials" });
    }

    const user = result.rows[0];

    if (user.status !== "ACTIVE") {
      return res.status(403).json({ ok: false, error: "Account is inactive" });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ ok: false, error: "Invalid credentials" });
    }

    const token = signToken({ id: user.user_id, role: user.role });

    return res.json({
      ok: true,
      token,
      user: { id: user.user_id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Login Error:', err);
    console.error('Error Details:', {
      message: err.message,
      code: err.code,
      stack: err.stack
    });
    return res.status(500).json({
      ok: false,
      error: 'Login failed. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};


// Password Reset Functions

/**
 * Request Password Reset - Generate and print OTP
 */
exports.requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ ok: false, error: "Email is required" });
        }

        // Check if user exists
        const userCheck = await db.query(
            "SELECT user_id, email FROM user_table WHERE email = $1",
            [email]
        );

        if (userCheck.rows.length === 0) {
            // For security, don't reveal if email exists or not
            return res.status(200).json({
                ok: true,
                message: "If this email exists, an OTP has been generated. Check your terminal."
            });
        }

        const userId = userCheck.rows[0].user_id;

        // Check rate limiting (max 3 OTPs per hour)
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const recentOTPs = await db.query(
            "SELECT COUNT(*) FROM password_reset_otp WHERE user_id = $1 AND created_at > $2",
            [userId, oneHourAgo]
        );

        if (parseInt(recentOTPs.rows[0].count) >= 3) {
            return res.status(429).json({
                ok: false,
                error: "Too many OTP requests. Please try again later."
            });
        }

        // Generate OTP
        const otp = generateOTP();
        const expiresAt = getOTPExpiry();

        // Store OTP in database
        await db.query(
            `INSERT INTO password_reset_otp (user_id, email, otp_code, expires_at) 
       VALUES ($1, $2, $3, $4)`,
            [userId, email, otp, expiresAt]
        );

        // Print OTP to terminal
        printOTPToTerminal(email, otp, expiresAt);

        return res.status(200).json({
            ok: true,
            message: "OTP generated successfully. Check your terminal."
        });

    } catch (err) {
        console.error('Request Password Reset Error:', err);
        console.error('Error Details:', {
            message: err.message,
            code: err.code,
            stack: err.stack
        });
        return res.status(500).json({
            ok: false,
            error: 'Failed to generate OTP. Please try again later.'
        });
    }
};

/**
 * Verify OTP - Validate OTP code
 */
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ ok: false, error: "Email and OTP are required" });
        }

        // Find valid OTP
        const result = await db.query(
            `SELECT otp_id, email, otp_code, expires_at, is_used 
       FROM password_reset_otp 
       WHERE email = $1 AND otp_code = $2 
       ORDER BY created_at DESC 
       LIMIT 1`,
            [email, otp]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ ok: false, error: "Invalid OTP" });
        }

        const otpRecord = result.rows[0];

        // Check if OTP is already used
        if (otpRecord.is_used) {
            return res.status(401).json({ ok: false, error: "OTP has already been used" });
        }

        // Check if OTP is expired
        if (new Date() > new Date(otpRecord.expires_at)) {
            return res.status(401).json({ ok: false, error: "OTP has expired" });
        }

        // Generate verification token (valid for 15 minutes)
        const verificationToken = jwt.sign(
            { email, otpId: otpRecord.otp_id },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        return res.status(200).json({
            ok: true,
            message: "OTP verified successfully",
            verificationToken
        });

    } catch (err) {
        console.error('Verify OTP Error:', err);
        console.error('Error Details:', {
            message: err.message,
            code: err.code,
            stack: err.stack
        });
        return res.status(500).json({
            ok: false,
            error: 'Failed to verify OTP. Please try again later.'
        });
    }
};

/**
 * Reset Password - Update password with verified token
 */
exports.resetPassword = async (req, res) => {
    try {
        const { verificationToken, newPassword } = req.body;

        if (!verificationToken || !newPassword) {
            return res.status(400).json({
                ok: false,
                error: "Verification token and new password are required"
            });
        }

        // Validate password strength
        if (newPassword.length < 8) {
            return res.status(400).json({
                ok: false,
                error: "Password must be at least 8 characters long"
            });
        }

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(verificationToken, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ ok: false, error: "Invalid or expired verification token" });
        }

        const { email, otpId } = decoded;

        // Start transaction
        await db.query('BEGIN');

        try {
            // Mark OTP as used
            await db.query(
                "UPDATE password_reset_otp SET is_used = TRUE WHERE otp_id = $1",
                [otpId]
            );

            // Hash new password
            const password_hash = await bcrypt.hash(newPassword, 10);

            // Update user password
            const updateResult = await db.query(
                "UPDATE user_table SET password_hash = $1 WHERE email = $2 RETURNING user_id",
                [password_hash, email]
            );

            if (updateResult.rows.length === 0) {
                throw new Error('User not found');
            }

            // Commit transaction
            await db.query('COMMIT');

            return res.status(200).json({
                ok: true,
                message: "Password reset successfully"
            });

        } catch (err) {
            // Rollback on error
            await db.query('ROLLBACK');
            throw err;
        }

    } catch (err) {
        console.error('Reset Password Error:', err);
        console.error('Error Details:', {
            message: err.message,
            code: err.code,
            stack: err.stack
        });
        return res.status(500).json({
            ok: false,
            error: 'Failed to reset password. Please try again later.'
        });
    }
};
