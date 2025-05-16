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

    static generateVerificationToken = (): string => {
        return crypto.randomBytes(32).toString("hex");
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

            // Generate verification token
            const verificationToken = AuthController.generateVerificationToken();
            const verificationTokenExpiry = new Date();
            verificationTokenExpiry.setHours(verificationTokenExpiry.getHours() + 24);

            // Create new user
            const user = userRepository.create({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                phoneNumber,
                verificationToken,
                verificationTokenExpiry,
                isEmailVerified: false,
            });

            await userRepository.save(user);

            // Send verification email
            await emailService.sendVerificationEmail(user, verificationToken);

            // Generate JWT token
            const token = AuthController.generateToken(user.id, user.role);

            res.status(201).json({
                message: "Registration successful. Please verify your email.",
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
            console.error("Registration error:", error);
            res.status(500).json({ message: "Error registering user" });
        }
    };

    static verifyEmail = async (req: Request, res: Response) => {
        try {
            const { token } = req.params;

            const user = await userRepository.findOne({
                where: {
                    verificationToken: token,
                    isEmailVerified: false,
                },
            });

            if (!user) {
                return res.status(400).json({ message: "Invalid verification token" });
            }

            if (user.verificationTokenExpiry && user.verificationTokenExpiry < new Date()) {
                return res.status(400).json({ message: "Verification token has expired" });
            }

            // Update user verification status
            user.isEmailVerified = true;
            user.verificationToken = null;
            user.verificationTokenExpiry = null;

            await userRepository.save(user);

            res.json({ message: "Email verified successfully" });
        } catch (error) {
            console.error("Email verification error:", error);
            res.status(500).json({ message: "Error verifying email" });
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
                // Generate new verification token
                const verificationToken = AuthController.generateVerificationToken();
                const verificationTokenExpiry = new Date();
                verificationTokenExpiry.setHours(verificationTokenExpiry.getHours() + 24);

                user.verificationToken = verificationToken;
                user.verificationTokenExpiry = verificationTokenExpiry;
                await userRepository.save(user);

                // Send new verification email
                await emailService.sendVerificationEmail(user, verificationToken);

                return res.status(403).json({
                    message: "Email not verified. A new verification email has been sent.",
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