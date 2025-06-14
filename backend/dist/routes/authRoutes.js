"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const express_validator_1 = require("express-validator");
const validateRequest_1 = require("../middleware/validateRequest");
const router = (0, express_1.Router)();
// Registration validation
const registerValidation = [
    (0, express_validator_1.body)("firstName").trim().notEmpty().withMessage("First name is required"),
    (0, express_validator_1.body)("lastName").trim().notEmpty().withMessage("Last name is required"),
    (0, express_validator_1.body)("email").isEmail().withMessage("Please enter a valid email"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
        .matches(/\d/)
        .withMessage("Password must contain at least one number")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one uppercase letter"),
    (0, express_validator_1.body)("phoneNumber")
        .optional()
        .matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)
        .withMessage("Please enter a valid phone number"),
];
// Login validation
const loginValidation = [
    (0, express_validator_1.body)("email").isEmail().withMessage("Please enter a valid email"),
    (0, express_validator_1.body)("password").notEmpty().withMessage("Password is required"),
];
// OTP validation
const otpValidation = [
    (0, express_validator_1.body)("email").isEmail().withMessage("Please enter a valid email"),
    (0, express_validator_1.body)("otp").matches(/^\d{6}$/).withMessage("Please enter a valid 6-digit OTP"),
];
// Routes
router.post("/register", registerValidation, validateRequest_1.validateRequest, authController_1.AuthController.register);
router.post("/login", loginValidation, validateRequest_1.validateRequest, authController_1.AuthController.login);
router.post("/verify-otp", otpValidation, validateRequest_1.validateRequest, authController_1.AuthController.verifyOTP);
router.post("/resend-otp", (0, express_validator_1.body)("email").isEmail(), validateRequest_1.validateRequest, authController_1.AuthController.resendOTP);
router.post("/forgot-password", authController_1.AuthController.forgotPassword);
router.post("/reset-password", authController_1.AuthController.resetPassword);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map