const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.post("/register", authController.register);
router.post("/login", authController.login);

// Password Reset Routes
router.post("/forgot-password", authController.requestPasswordReset);
router.post("/verify-otp", authController.verifyOTP);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
