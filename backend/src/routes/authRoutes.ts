import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { body } from "express-validator";
import { validateRequest } from "../middleware/validateRequest";

const router = Router();

// Registration validation
const registerValidation = [
    body("firstName").trim().notEmpty().withMessage("First name is required"),
    body("lastName").trim().notEmpty().withMessage("Last name is required"),
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
        .matches(/\d/)
        .withMessage("Password must contain at least one number")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one uppercase letter"),
    body("phoneNumber")
        .optional()
        .matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)
        .withMessage("Please enter a valid phone number"),
];

// Login validation
const loginValidation = [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
];

// OTP validation
const otpValidation = [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("otp").matches(/^\d{6}$/).withMessage("Please enter a valid 6-digit OTP"),
];

// Routes
router.post("/register", registerValidation, validateRequest, AuthController.register);
router.post("/login", loginValidation, validateRequest, AuthController.login);
router.post("/verify-otp", otpValidation, validateRequest, AuthController.verifyOTP);
router.post("/resend-otp", body("email").isEmail(), validateRequest, AuthController.resendOTP);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);

export default router; 