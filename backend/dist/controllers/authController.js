"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const data_source_1 = require("../data-source");
const User_1 = require("../entity/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const emailService_1 = require("../services/emailService");
const emailService_2 = require("../services/emailService");
const crypto_1 = __importDefault(require("crypto"));
const typeorm_1 = require("typeorm");
const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
class AuthController {
}
exports.AuthController = AuthController;
_a = AuthController;
AuthController.generateToken = (userId, role) => {
    return jsonwebtoken_1.default.sign({ userId, role }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "24h" });
};
AuthController.generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
AuthController.register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phoneNumber } = req.body;
        // Check if user already exists
        const existingUser = await userRepository.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        // Generate OTP
        const otp = AuthController.generateOTP();
        const otpExpiry = new Date();
        otpExpiry.setMinutes(otpExpiry.getMinutes() + 10); // OTP valid for 10 minutes
        // Create new user
        const user = userRepository.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phoneNumber,
            otp,
            otpExpiry,
            isEmailVerified: false,
        });
        await userRepository.save(user);
        // Send OTP email
        await emailService_1.emailService.sendOTPEmail(user, otp);
        res.status(201).json({
            message: "Registration successful. Please check your email for OTP verification.",
            email: user.email,
        });
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Error registering user" });
    }
};
AuthController.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await userRepository.findOne({
            where: {
                email,
                otp,
                isEmailVerified: false,
            },
        });
        if (!user) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        if (user.otpExpiry && user.otpExpiry < new Date()) {
            return res.status(400).json({ message: "OTP has expired" });
        }
        // Update user verification status
        user.isEmailVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await userRepository.save(user);
        // Generate JWT token
        const token = AuthController.generateToken(user.id, user.role);
        res.json({
            message: "Email verified successfully",
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                isEmailVerified: true,
            },
        });
    }
    catch (error) {
        console.error("OTP verification error:", error);
        res.status(500).json({ message: "Error verifying OTP" });
    }
};
AuthController.resendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userRepository.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.isEmailVerified) {
            return res.status(400).json({ message: "Email is already verified" });
        }
        // Generate new OTP
        const otp = AuthController.generateOTP();
        const otpExpiry = new Date();
        otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await userRepository.save(user);
        // Send new OTP email
        await emailService_1.emailService.sendOTPEmail(user, otp);
        res.json({ message: "New OTP has been sent to your email" });
    }
    catch (error) {
        console.error("Resend OTP error:", error);
        res.status(500).json({ message: "Error resending OTP" });
    }
};
AuthController.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user
        const user = await userRepository.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        // Check password
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        // Check if email is verified
        if (!user.isEmailVerified) {
            // Generate new OTP
            const otp = AuthController.generateOTP();
            const otpExpiry = new Date();
            otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);
            user.otp = otp;
            user.otpExpiry = otpExpiry;
            await userRepository.save(user);
            // Send new OTP email
            await emailService_1.emailService.sendOTPEmail(user, otp);
            return res.status(403).json({
                message: "Email not verified. A new OTP has been sent to your email.",
                email: user.email,
            });
        }
        // Generate token
        const token = AuthController.generateToken(user.id, user.role);
        res.json({
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                isEmailVerified: user.isEmailVerified,
            },
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Error logging in" });
    }
};
AuthController.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        const user = await userRepository.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Generate reset token
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now
        // Save hashed token to database
        user.resetPasswordToken = crypto_1.default.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpiry = resetTokenExpiry;
        await userRepository.save(user);
        // Create reset URL
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
        // Send email
        const emailContent = `
                <h1>Password Reset Request</h1>
                <p>You requested to reset your password. Click the link below to reset it:</p>
                <a href="${resetUrl}">Reset Password</a>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request this, please ignore this email.</p>
            `;
        await (0, emailService_2.sendEmail)({
            to: user.email,
            subject: 'Password Reset Request',
            html: emailContent
        });
        res.json({ message: "Password reset link sent to email" });
    }
    catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ message: "Error processing forgot password request" });
    }
};
AuthController.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            return res.status(400).json({ message: "Token and new password are required" });
        }
        // Hash token to compare with stored hash
        const hashedToken = crypto_1.default.createHash('sha256').update(token).digest('hex');
        const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        const user = await userRepository.findOne({
            where: {
                resetPasswordToken: hashedToken,
                resetPasswordExpiry: (0, typeorm_1.MoreThan)(new Date())
            }
        });
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }
        // Update password and clear reset token fields
        user.password = await bcryptjs_1.default.hash(newPassword, 12);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiry = undefined;
        await userRepository.save(user);
        res.json({ message: "Password reset successful" });
    }
    catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ message: "Error resetting password" });
    }
};
//# sourceMappingURL=authController.js.map