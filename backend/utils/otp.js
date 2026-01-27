/**
 * OTP Utility for Password Reset
 * Generates 6-digit OTP and prints to terminal
 */

/**
 * Generate a random 6-digit OTP
 * @returns {string} 6-digit OTP code
 */
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Print OTP to terminal with formatted output
 * @param {string} email - User email
 * @param {string} otp - 6-digit OTP code
 * @param {Date} expiresAt - Expiry timestamp
 */
const printOTPToTerminal = (email, otp, expiresAt) => {
    const border = '═'.repeat(50);
    const expiryTime = expiresAt.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    console.log('\n');
    console.log('╔' + border + '╗');
    console.log('║' + ' '.repeat(10) + 'PASSWORD RESET OTP GENERATED' + ' '.repeat(12) + '║');
    console.log('╠' + border + '╣');
    console.log('║  Email: ' + email.padEnd(41) + '║');
    console.log('║  OTP Code: ' + otp.padEnd(38) + '║');
    console.log('║  Expires: ' + expiryTime.padEnd(39) + '║');
    console.log('╚' + border + '╝');
    console.log('\n');
};

/**
 * Calculate OTP expiry time (10 minutes from now)
 * @returns {Date} Expiry timestamp
 */
const getOTPExpiry = () => {
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 10);
    return expiry;
};

module.exports = {
    generateOTP,
    printOTPToTerminal,
    getOTPExpiry
};
