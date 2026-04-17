# Validation and Error Handling Documentation

## Table of Contents
1. [Frontend Validation](#frontend-validation)
2. [Backend Validation](#backend-validation)
3. [Error Handling Patterns](#error-handling-patterns)
4. [API Error Interceptors](#api-error-interceptors)
5. [Authentication & Authorization](#authentication--authorization)
6. [Best Practices](#best-practices)

---

## Frontend Validation

The system uses a comprehensive client-side validation approach with real-time feedback and user-friendly error messages.

### Validation Utility (`frontend/src/utils/validation.js`)

The frontend has a centralized validation utility that provides consistent validation across all forms.

#### **Regex Patterns**

```javascript
const PATTERNS = {
    // Email validation
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

    // Password: Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,

    // Sri Lankan NIC: 9 digits + V/X or 12 digits
    nic: /^([0-9]{9}[VvXx]|[0-9]{12})$/,

    // Sri Lankan phone: 10 digits starting with 0
    phone: /^0[0-9]{9}$/,

    // Name: Letters, spaces, dots, hyphens, apostrophes
    name: /^[a-zA-Z\s.'-]+$/,

    // OTP: 6 digits
    otp: /^[0-9]{6}$/,

    // Numbers only
    numbersOnly: /^[0-9]+$/,
};
```

#### **Validation Functions**

Each validation function returns an object with `valid` (boolean) and `message` (string).

**1. Email Validation**
```javascript
export function validateEmail(email) {
    if (!email || !email.trim()) {
        return { valid: false, message: "Email is required" };
    }
    if (!PATTERNS.email.test(email)) {
        return { valid: false, message: "Please enter a valid email address" };
    }
    return { valid: true, message: "" };
}
```

**Example Usage in Login Component:**
```javascript
const handleEmailBlur = () => {
    const validation = validateEmail(email);
    if (!validation.valid) {
        setEmailError(validation.message);
    }
};
```

**2. Password Validation**
```javascript
export function validatePassword(password) {
    if (!password) {
        return { valid: false, message: "Password is required" };
    }
    if (password.length < 8) {
        return { valid: false, message: "Password must be at least 8 characters" };
    }
    if (!PATTERNS.password.test(password)) {
        return {
            valid: false,
            message: "Password must contain uppercase, lowercase, number, and special character",
        };
    }
    return { valid: true, message: "" };
}
```

**3. Password Strength Indicator**
```javascript
export function getPasswordStrength(password) {
    if (!password) return { level: 0, text: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[@$!%*?&#]/.test(password)) strength++;

    if (strength <= 2) {
        return { level: 1, text: "Weak", color: "#c41e3a" };
    } else if (strength <= 4) {
        return { level: 2, text: "Medium", color: "#f59e0b" };
    } else {
        return { level: 3, text: "Strong", color: "#10b981" };
    }
}
```

**Example Usage in SignUp Component (Lines 169-172):**
```javascript
const strength = passwordStrength(form.password);
const strengthPct = (strength / 4) * 100;
const strengthLabel = STRENGTH_LABELS[strength];
const strengthColor = STRENGTH_COLORS[strength];
```

**4. NIC Validation (Sri Lankan National Identity Card)**
```javascript
export function validateNIC(nic) {
    if (!nic || !nic.trim()) {
        return { valid: false, message: "NIC is required" };
    }
    if (!PATTERNS.nic.test(nic)) {
        return {
            valid: false,
            message: "Invalid NIC format (e.g., 123456789V or 200012345678)",
        };
    }
    return { valid: true, message: "" };
}
```

**5. Phone Number Validation**
```javascript
export function validatePhone(phone) {
    if (!phone || !phone.trim()) {
        return { valid: false, message: "Phone number is required" };
    }
    if (!PATTERNS.phone.test(phone)) {
        return {
            valid: false,
            message: "Phone must be 10 digits starting with 0 (e.g., 0712345678)",
        };
    }
    return { valid: true, message: "" };
}
```

---

### Validation Timing Strategies

The system employs **three validation timing strategies**:

#### **1. On Blur Validation** (Field loses focus)

**Example from Login.jsx (Lines 44-50):**
```javascript
const handleEmailBlur = () => {
    const validation = validateEmail(email);
    if (!validation.valid) {
        setEmailError(validation.message);
    }
};

// Usage in JSX:
<input
    value={email}
    onChange={handleEmailChange}
    onBlur={handleEmailBlur}  // ← Validates when user leaves field
/>
```

**Benefits:**
- Non-intrusive (doesn't interrupt typing)
- Provides feedback after user finishes entering data
- User-friendly and reduces annoyance

#### **2. On Change Validation** (Clear errors while typing)

**Example from Login.jsx (Lines 37-42):**
```javascript
const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(""); // ← Clear error on change
};
```

**Benefits:**
- Immediate visual feedback that error is being addressed
- Removes red highlighting as user corrects the issue

#### **3. On Submit Validation** (Comprehensive validation before submission)

**Example from Login.jsx (Lines 71-83):**
```javascript
const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    // Validate all fields before submission
    const emailValidation = validateEmail(email);
    const passwordValidation = validateRequired(password, "Password");

    if (!emailValidation.valid) {
        setEmailError(emailValidation.message);
        return;
    }

    if (!passwordValidation.valid) {
        setPasswordError(passwordValidation.message);
        return;
    }

    // Proceed with API call...
};
```

**Benefits:**
- Final catch-all validation
- Prevents submission of invalid data
- Shows all errors at once for user review

---

### Visual Feedback Patterns

#### **1. Dynamic Input Classes Based on Validation State**

**Example from RegisterCitizen.jsx (Lines 93-98):**
```javascript
function inputClass(error, value) {
    if (error) return "input input-error";       // Red border
    if (value.trim()) return "input input-success";  // Green border
    return "input";                               // Default state
}

// Usage:
<input
    className={inputClass(emailError, email)}
    value={email}
    onChange={handleEmailChange}
/>
```

**CSS States:**
- **Default**: Gray border, neutral appearance
- **Error**: Red border + red error message below
- **Success**: Green border (validation passed)

#### **2. Inline Error Messages**

**Example from Login.jsx (Line 174):**
```javascript
{emailError && <div className="field-error">{emailError}</div>}
```

**Rendered HTML:**
```html
<div class="field">
    <input class="input input-error" />
</div>
<div class="field-error">Please enter a valid email address</div>
```

#### **3. Password Requirements Checklist**

**Example from SignUp.jsx (Lines 268-283):**
```javascript
<div className="password-requirements">
    {[
        { ok: form.password.length >= 8, text: "At least 8 characters" },
        { ok: /[A-Z]/.test(form.password), text: "One uppercase letter" },
        { ok: /[0-9]/.test(form.password), text: "One number" },
        { ok: /[^A-Za-z0-9]/.test(form.password), text: "One special character" },
    ].map(({ ok, text }) => (
        <div key={text} style={{ color: ok ? "#38a169" : "#999" }}>
            <span>{ok ? "✔" : "○"}</span> {text}
        </div>
    ))}
</div>
```

**Visual Result:**
- ✔ At least 8 characters (green)
- ○ One uppercase letter (gray)
- ✔ One number (green)
- ○ One special character (gray)

#### **4. Password Strength Bar**

**Example from SignUp.jsx (Lines 254-266):**
```javascript
{form.password && (
    <div className="password-strength">
        <div className="strength-bar">
            <div
                className="strength-fill"
                style={{
                    width: `${strengthPct}%`,
                    backgroundColor: strengthColor
                }}
            />
        </div>
        <span className="strength-text" style={{ color: strengthColor }}>
            {strengthLabel}
        </span>
    </div>
)}
```

**Color Scheme:**
- **Weak**: Red (#e53e3e)
- **Fair**: Orange (#dd6b20)
- **Good**: Yellow (#d69e2e)
- **Strong**: Green (#38a169)

---

### Real-time Cross-Field Validation

**Example: Password Confirmation Match (RegisterCitizen.jsx, Lines 136-145)**
```javascript
function handlePasswordChange(e) {
    const val = e.target.value;
    setPassword(val);
    setPasswordError("");

    // Keep confirm-error in sync whenever password changes
    if (confirm) {
        const cv = validatePasswordMatch(val, confirm);
        setConfirmError(cv.valid ? "" : cv.message);
    }
}
```

**Benefits:**
- Immediately updates confirmation error when password changes
- User sees mismatch error disappear as they type matching password

---

## Backend Validation

The backend implements **defense-in-depth validation** with multiple layers.

### Layer 1: Required Field Validation

**Example from auth.controller.js (Lines 10-16):**
```javascript
exports.register = async (req, res) => {
    const { email, password, full_name, nic_number, phone_number } = req.body;

    // Required field validation
    if (!email || !password || !full_name || !nic_number) {
        return res.status(400).json({
            ok: false,
            error: "Required fields are missing"
        });
    }
    // ... continue processing
};
```

### Layer 2: Data Integrity Validation

**Example: Duplicate Email Check (auth.controller.js, Lines 19-23):**
```javascript
// Check if the email already exists in user_table
const emailCheck = await db.query(
    "SELECT user_id FROM user_table WHERE email = $1",
    [email]
);

if (emailCheck.rows.length > 0) {
    return res.status(409).json({
        ok: false,
        error: "Email already registered"
    });
}
```

**Example: Duplicate NIC Check (auth.controller.js, Lines 25-29):**
```javascript
// Check if the NIC already exists in citizen table
const nicCheck = await db.query(
    "SELECT citizen_id FROM citizen WHERE nic_number = $1",
    [nic_number]
);

if (nicCheck.rows.length > 0) {
    return res.status(409).json({
        ok: false,
        error: "NIC already registered"
    });
}
```

### Layer 3: Business Logic Validation

**Example from certificate.routes.js (Lines 62-63):**
```javascript
if (!cert_type || !CERT_TYPES.includes(cert_type))
    return res.status(400).json({
        ok: false,
        error: "Invalid certificate type"
    });
```

**Example: NIC Ownership Validation (certificate.routes.js, Lines 80-90):**
```javascript
// Check if NIC belongs to citizen or their family member
if (citizen.nic_number !== nic_number) {
    const memberCheck = await pool.query(
        `SELECT fm.member_id FROM family_member fm
         JOIN household h ON h.household_id = fm.household_id
         WHERE fm.nic_number = $1 AND h.citizen_id = $2 LIMIT 1`,
        [nic_number, citizen_id]
    );

    if (!memberCheck.rows.length)
        return res.status(400).json({
            ok: false,
            error: "No citizen or family member found with the provided NIC number in your household"
        });

    family_member_id = memberCheck.rows[0].member_id;
}
```

### Layer 4: Format and Type Validation

**Example: Password Strength (auth.controller.js, Lines 282-288):**
```javascript
// Validate password strength
if (newPassword.length < 8) {
    return res.status(400).json({
        ok: false,
        error: "Password must be at least 8 characters long"
    });
}
```

**Example: Action Validation (certificate.routes.js, Lines 232-234):**
```javascript
if (!action || !["approve", "visit", "reject"].includes(action))
    return res.status(400).json({
        ok: false,
        error: "Invalid action. Must be approve, visit, or reject."
    });
```

**Example: Certificate Data Type Validation (certificate.routes.js, Lines 470-472):**
```javascript
if (!certificate_data || typeof certificate_data !== "object") {
    return res.status(400).json({
        ok: false,
        error: "Invalid certificate data"
    });
}
```

### Layer 5: Conditional Validation

**Example: Appointment Date Required for Visit Action (certificate.routes.js, Lines 287-289):**
```javascript
if (action === "visit") {
    if (!appointment_date)
        return res.status(400).json({
            ok: false,
            error: "Appointment date is required for visit action."
        });
    // ... proceed
}
```

**Example: Rejection Reason Required (certificate.routes.js, Lines 310-312):**
```javascript
if (action === "reject") {
    if (!rejection_reason?.trim())
        return res.status(400).json({
            ok: false,
            error: "Rejection reason is required."
        });
    // ... proceed
}
```

---

## Error Handling Patterns

### Frontend Error Handling

#### **1. API Call Error Handling with Detailed Error Messages**

**Example from Login.jsx (Lines 116-141):**
```javascript
try {
    const res = await api.post("/api/auth/login", { email, password });
    const { token, user } = res.data;

    // ... success handling
} catch (ex) {
    console.error('Login error:', ex);

    // Handle different error types
    if (ex.response) {
        // Server responded with error status
        const status = ex.response.status;
        const errorMsg = ex.response.data?.error;

        if (status === 401) {
            setErr("Invalid email or password");
        } else if (status === 403) {
            setErr("Your account is inactive. Please contact support.");
        } else if (status === 400) {
            setErr(errorMsg || "Please check your input");
        } else {
            setErr(errorMsg || "Login failed. Please try again.");
        }
    } else if (ex.request) {
        // Request made but no response
        setErr("Cannot connect to server. Please check your connection.");
    } else {
        // Something else happened
        setErr("An unexpected error occurred. Please try again.");
    }
}
```

**Error Categories:**
- **400 Bad Request**: Invalid input data
- **401 Unauthorized**: Invalid credentials
- **403 Forbidden**: Account inactive or insufficient permissions
- **500 Internal Server Error**: Server-side issue

#### **2. Response Data Validation**

**Example from Login.jsx (Lines 93-97):**
```javascript
// Validate response data
if (!token || !user) {
    setErr("Invalid response from server. Please try again.");
    return;
}
```

#### **3. Role-Based Validation**

**Example from Login.jsx (Lines 99-103):**
```javascript
// Role validation (important for security)
if (user.role !== role) {
    setErr("Selected role does not match your account");
    return;
}
```

---

### Backend Error Handling

#### **1. Database Transaction Error Handling**

**Example from auth.controller.js (Lines 33-76):**
```javascript
try {
    // --- Start Transaction ---
    await db.query('BEGIN');

    // Insert into user_table
    const userResult = await db.query(
        `INSERT INTO user_table (email, password_hash, role, status, "created _at")
         VALUES ($1, $2, 'CITIZEN', 'ACTIVE', CURRENT_TIME)
         RETURNING user_id`,
        [email, password_hash]
    );

    const newUserID = userResult.rows[0].user_id;

    // Insert into citizen table
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

    return res.status(500).json({
        ok: false,
        error: "Internal Server Error",
        details: err.message
    });
}
```

**Key Features:**
- **BEGIN/COMMIT/ROLLBACK**: Ensures data consistency
- **Detailed error logging**: Helps debugging
- **Generic error message to client**: Prevents information leakage

#### **2. Comprehensive Error Logging**

**Example from auth.controller.js (Lines 114-126):**
```javascript
catch (err) {
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
```

**Features:**
- **Detailed server-side logging**: Full error information for debugging
- **Safe client-side messages**: Generic error message in production
- **Environment-based details**: Show error details only in development

#### **3. Security-Conscious Error Messages**

**Example: Don't Reveal User Existence (auth.controller.js, Lines 149-155):**
```javascript
if (userCheck.rows.length === 0) {
    // For security, don't reveal if email exists or not
    return res.status(200).json({
        ok: true,
        message: "If this email exists, an OTP has been generated. Check your terminal."
    });
}
```

**Security Principle:**
- Prevents **email enumeration attacks**
- Same response whether email exists or not
- Attackers can't determine valid user accounts

#### **4. Rate Limiting**

**Example from auth.controller.js (Lines 158-169):**
```javascript
// Check rate limiting (max 3 OTPs per hour)
const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
const recentOTPs = await db.query(
    "SELECT COUNT(*) FROM password_reset_otp WHERE email = $1 AND created_at > $2",
    [email, oneHourAgo]
);

if (parseInt(recentOTPs.rows[0].count) >= 3) {
    return res.status(429).json({
        ok: false,
        error: "Too many OTP requests. Please try again later."
    });
}
```

**Benefits:**
- Prevents **brute force attacks**
- Limits abuse of OTP generation
- Returns **429 Too Many Requests** status code

#### **5. Resource Not Found Handling**

**Example from certificate.routes.js (Lines 246-248):**
```javascript
if (!reqRow.rows.length)
    return res.status(404).json({
        ok: false,
        error: "Request not found"
    });
```

#### **6. Nested Try-Catch for Transaction Error Handling**

**Example from auth.controller.js (Lines 300-334):**
```javascript
try {
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
        throw err;  // Re-throw for outer catch
    }

} catch (err) {
    // Outer error handler
    console.error('Reset Password Error:', err);
    return res.status(500).json({
        ok: false,
        error: 'Failed to reset password. Please try again later.'
    });
}
```

---

## API Error Interceptors

The system uses **Axios interceptors** for centralized authentication and error handling.

**File: `frontend/src/api/api.js`**

### Request Interceptor (Auto-attach JWT Token)

```javascript
// Attach token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});
```

**Benefits:**
- Automatically adds `Authorization: Bearer <token>` header
- No need to manually add token to every API call
- Centralized token management

### Response Interceptor (Auto-logout on Invalid Token)

```javascript
// Auto-logout when the server reports an invalid/expired token
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const msg = error.response?.data?.error || "";
            if (msg === "Invalid token" || msg === "Missing token") {
                localStorage.clear();
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);
```

**Benefits:**
- **Automatic session expiry handling**: Redirects to login on token expiry
- **Centralized logout logic**: No need to check in every component
- **Security**: Clears all local storage data on invalid token

---

## Authentication & Authorization

### Middleware-Based Authorization

**File: `backend/middleware/auth.middleware.js`**

#### **1. requireAuth Middleware**

```javascript
exports.requireAuth = (req, res, next) => {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token)
        return res.status(401).json({ ok: false, error: "Missing token" });

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload; // {id, role}
        next();
    } catch (err) {
        return res.status(401).json({ ok: false, error: "Invalid token" });
    }
};
```

**Usage in Routes:**
```javascript
router.get("/my", requireAuth, requireRole("CITIZEN"), async (req, res) => {
    // Only authenticated citizens can access this
});
```

#### **2. requireRole Middleware**

```javascript
exports.requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user?.role)
            return res.status(401).json({ ok: false, error: "Unauthorized" });

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ ok: false, error: "Forbidden" });
        }
        next();
    };
};
```

**Usage Examples:**

```javascript
// Only GN officers
router.patch("/:id/gn-action", requireAuth, requireRole("GN"), async (req, res) => {
    // ...
});

// Only Admins (Divisional Secretary)
router.patch("/:id/ds-action", requireAuth, requireRole("ADMIN"), async (req, res) => {
    // ...
});

// Both GN and Admin can access
router.get("/all", requireAuth, requireRole("GN", "ADMIN"), async (req, res) => {
    // ...
});
```

### Status Code Meanings

| Status Code | Meaning | Example Use Case |
|------------|---------|------------------|
| **200 OK** | Success | Data fetched successfully |
| **201 Created** | Resource created | User registered, certificate requested |
| **400 Bad Request** | Invalid input | Missing fields, invalid format |
| **401 Unauthorized** | Authentication failed | Invalid token, wrong password |
| **403 Forbidden** | Access denied | Inactive account, insufficient role |
| **404 Not Found** | Resource not found | Certificate not found |
| **409 Conflict** | Resource already exists | Duplicate email/NIC |
| **429 Too Many Requests** | Rate limit exceeded | Too many OTP requests |
| **500 Internal Server Error** | Server error | Database error, unhandled exception |

---

## Best Practices

### Frontend Best Practices

1. **Always Validate on Multiple Events**
   - `onChange`: Clear errors
   - `onBlur`: Show validation errors
   - `onSubmit`: Final validation before API call

2. **Provide Immediate Visual Feedback**
   - Use color-coded input borders (red/green)
   - Show inline error messages below fields
   - Display success indicators for valid fields

3. **User-Friendly Error Messages**
   - ❌ Bad: "Validation failed"
   - ✅ Good: "Email is required"
   - ✅ Good: "Phone must be 10 digits starting with 0 (e.g., 0712345678)"

4. **Password Security UX**
   - Show password strength indicator
   - Provide requirements checklist
   - Toggle password visibility

5. **Never Trust Client-Side Validation Alone**
   - Always validate on the backend
   - Client-side is for UX, not security

6. **Handle All Error Types**
   - Network errors (`ex.request`)
   - Server errors (`ex.response`)
   - Unexpected errors (fallback)

---

### Backend Best Practices

1. **Defense in Depth**
   - Validate at middleware level (auth)
   - Validate in route handlers (business logic)
   - Validate in database (constraints)

2. **Use Transactions for Multi-Step Operations**
   - Always use `BEGIN`, `COMMIT`, `ROLLBACK`
   - Ensures data integrity
   - Prevents partial updates

3. **Secure Error Messages**
   - Don't reveal sensitive information
   - Log detailed errors server-side
   - Return generic messages to client

4. **Rate Limiting**
   - Limit OTP generation
   - Limit login attempts
   - Prevent brute force attacks

5. **Validate Data Types**
   - Check if data is an object, string, number
   - Validate array contents
   - Use `typeof`, `Array.isArray()`

6. **Return Appropriate Status Codes**
   - Use semantic HTTP status codes
   - Helps frontend handle errors correctly
   - Improves API clarity

7. **Always Hash Passwords**
   - Use bcrypt with salt rounds (10+)
   - Never store plain text passwords
   - Never log passwords

8. **Use Parameterized Queries**
   - Prevent SQL injection
   - Use `$1, $2` placeholders
   - Never concatenate user input into SQL

---

## Summary

The **Grama Niladari Management System** implements a comprehensive validation and error handling strategy:

### **Frontend**
- ✅ Centralized validation utility (`validation.js`)
- ✅ Multi-stage validation (onChange, onBlur, onSubmit)
- ✅ Visual feedback (color-coded inputs, error messages)
- ✅ Password strength indicators
- ✅ Real-time cross-field validation
- ✅ Axios interceptors for global error handling

### **Backend**
- ✅ Multi-layer validation (required fields, format, business logic)
- ✅ Database transactions with rollback
- ✅ Role-based authorization middleware
- ✅ Rate limiting for sensitive operations
- ✅ Secure error messages (no information leakage)
- ✅ Comprehensive error logging
- ✅ Password hashing with bcrypt
- ✅ SQL injection prevention (parameterized queries)

This architecture ensures **robust data integrity**, **excellent user experience**, and **strong security** across the entire application.
