const { generateOTP, getOTPExpiry } = require('./otp');

describe('OTP Utility', () => {
    describe('generateOTP', () => {
        it('should generate a 6-digit string', () => {
            const otp = generateOTP();
            expect(typeof otp).toBe('string');
            expect(otp.length).toBe(6);
        });

        it('should only contain numbers', () => {
             const otp = generateOTP();
             const isOnlyNumbers = /^\d+$/.test(otp);
             expect(isOnlyNumbers).toBe(true);
        });
    });

    describe('getOTPExpiry', () => {
        it('should return a valid Date object', () => {
            const expiry = getOTPExpiry();
            expect(expiry).toBeInstanceOf(Date);
        });

        it('should be roughly 10 minutes in the future', () => {
            const now = new Date();
            const expiry = getOTPExpiry();
            
            const diffMs = expiry.getTime() - now.getTime();
            const diffMinutes = diffMs / (1000 * 60);

            // allowing a small margin of error (e.g., execution time difference)
            expect(diffMinutes).toBeGreaterThanOrEqual(9.9);
            expect(diffMinutes).toBeLessThanOrEqual(10.1);
        });
    });
});
