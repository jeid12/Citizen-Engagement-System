import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { emailService } from "../services/emailService";
import crypto from "crypto";

const userRepository = AppDataSource.getRepository(User);

export class AuthController {
    static generateToken = (userId: string, role: string): string => {
        return jwt.sign(
            { userId, role },
            process.env.JWT_SECRET || "your-secret-key",
            { expiresIn: "24h" }
        );
    };

    static generateOTP = (): string => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    static register = async (req: Request, res: Response) => {
        try {
            const { firstName, lastName, email, password, phoneNumber } = req.body;

            // Check if user already exists
            const existingUser = await userRepository.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: "Email already registered" });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 12);

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
            await emailService.sendOTPEmail(user, otp);

            res.status(201).json({
                message: "Registration successful. Please check your email for OTP verification.",
                email: user.email,
            });
        } catch (error) {
            console.error("Registration error:", error);
            res.status(500).json({ message: "Error registering user" });
        }
    };

    static verifyOTP = async (req: Request, res: Response) => {
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
        } catch (error) {
            console.error("OTP verification error:", error);
            res.status(500).json({ message: "Error verifying OTP" });
        }
    };

    static resendOTP = async (req: Request, res: Response) => {
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
            await emailService.sendOTPEmail(user, otp);

            res.json({ message: "New OTP has been sent to your email" });
        } catch (error) {
            console.error("Resend OTP error:", error);
            res.status(500).json({ message: "Error resending OTP" });
        }
    };

    static login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            // Find user
            const user = await userRepository.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            // Check password
            const isPasswordValid = await bcrypt.compare(password, user.password);
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
                await emailService.sendOTPEmail(user, otp);

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
        } catch (error) {
            console.error("Login error:", error);
            res.status(500).json({ message: "Error logging in" });
        }
    };
} 