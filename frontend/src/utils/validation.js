/**
 * Validation Utility
 * Provides regex-based validation for all form inputs
 */

// Regex Patterns
const PATTERNS = {
  email: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
  // Password: Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  password:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
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

/**
 * Validate email address
 */
export function validateEmail(email) {
  if (!email || !email.trim()) {
    return { valid: false, message: "Email is required" };
  }
  if (!PATTERNS.email.test(email)) {
    return { valid: false, message: "Please enter a valid email address" };
  }
  return { valid: true, message: "" };
}

/**
 * Validate password strength
 */
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
      message:
        "Password must contain uppercase, lowercase, number, and special character",
    };
  }
  return { valid: true, message: "" };
}

/**
 * Validate password match
 */
export function validatePasswordMatch(password, confirmPassword) {
  if (!confirmPassword) {
    return { valid: false, message: "Please confirm your password" };
  }
  if (password !== confirmPassword) {
    return { valid: false, message: "Passwords do not match" };
  }
  return { valid: true, message: "" };
}

/**
 * Validate Sri Lankan NIC
 */
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

/**
 * Validate Sri Lankan phone number
 */
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

/**
 * Validate name (letters, spaces, common punctuation)
 */
export function validateName(name) {
  if (!name || !name.trim()) {
    return { valid: false, message: "Name is required" };
  }
  if (name.trim().length < 2) {
    return { valid: false, message: "Name must be at least 2 characters" };
  }
  if (!PATTERNS.name.test(name)) {
    return {
      valid: false,
      message: "Name can only contain letters, spaces, and common punctuation",
    };
  }
  return { valid: true, message: "" };
}

/**
 * Validate OTP (6 digits)
 */
export function validateOTP(otp) {
  if (!otp || !otp.trim()) {
    return { valid: false, message: "OTP is required" };
  }
  if (!PATTERNS.otp.test(otp)) {
    return { valid: false, message: "OTP must be exactly 6 digits" };
  }
  return { valid: true, message: "" };
}

/**
 * Validate required field (not empty)
 */
export function validateRequired(value, fieldName = "This field") {
  if (!value || !value.toString().trim()) {
    return { valid: false, message: `${fieldName} is required` };
  }
  return { valid: true, message: "" };
}

/**
 * Validate minimum length
 */
export function validateMinLength(value, minLength, fieldName = "This field") {
  if (!value) {
    return { valid: false, message: `${fieldName} is required` };
  }
  if (value.toString().trim().length < minLength) {
    return {
      valid: false,
      message: `${fieldName} must be at least ${minLength} characters`,
    };
  }
  return { valid: true, message: "" };
}

/**
 * Get password strength level
 */
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

/**
 * Format phone number (add spaces for readability)
 */
export function formatPhone(phone) {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  return phone;
}

/**
 * Format NIC (add space before V/X)
 */
export function formatNIC(nic) {
  if (!nic) return "";
  const cleaned = nic.toUpperCase().replace(/\s/g, "");
  if (cleaned.length === 10 && /[VX]$/.test(cleaned)) {
    return `${cleaned.slice(0, 9)} ${cleaned.slice(9)}`;
  }
  return nic;
}
