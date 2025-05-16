import nodemailer from 'nodemailer';
import { User } from '../entity/User';
import { Complaint } from '../entity/Complaint';

class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "niyokwizerajd123@gmail.com",
                pass: "ptup lswr dccy xdat",
            },
        });
    }

    async sendVerificationEmail(user: User, token: string) {
        const verificationUrl = `http://localhost:5000/verify-email/${token}`;

        await this.transporter.sendMail({
            from: "niyokwizerajd123@gmail.com",
            to: user.email,
            subject: "Verify your email address",
            html: `
                <h1>Welcome to CES Rwanda</h1>
                <p>Hello ${user.firstName},</p>
                <p>Thank you for registering with the Citizen Engagement System. Please verify your email address by clicking the button below:</p>
                <p>
                    <a href="${verificationUrl}" style="background-color: #1976d2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                        Verify Email Address
                    </a>
                </p>
                <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
                <p>${verificationUrl}</p>
                <p>This link will expire in 24 hours.</p>
                <p>Best regards,<br>CES Rwanda Team</p>
            `,
        });
    }

    async sendOTPEmail(user: User, otp: string) {
        await this.transporter.sendMail({
            from: "niyokwizerajd123@gmail.com",
            to: user.email,
            subject: "Verify your email - CES Rwanda",
            html: `
                <h1>Email Verification</h1>
                <p>Hello ${user.firstName},</p>
                <p>Your verification code is:</p>
                <h2 style="background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 24px; letter-spacing: 5px;">
                    ${otp}
                </h2>
                <p>This code will expire in 10 minutes.</p>
                <p>If you didn't request this code, please ignore this email.</p>
                <p>Best regards,<br>CES Rwanda Team</p>
            `,
        });
    }

    async sendComplaintStatusUpdate(complaint: Complaint) {
        await this.transporter.sendMail({
            from: "niyokwizerajd123@gmail.com",
            to: complaint.user.email,
            subject: `Complaint Status Update - ${complaint.title}`,
            html: `
                <h1>Complaint Status Update</h1>
                <p>Hello ${complaint.user.firstName},</p>
                <p>There has been an update to your complaint:</p>
                <p><strong>Title:</strong> ${complaint.title}</p>
                <p><strong>New Status:</strong> ${complaint.status.replace('_', ' ')}</p>
                <p>You can track your complaint progress by clicking the button below:</p>
                <p>
                    <a href="http://localhost:5000/track-complaints" style="background-color: #1976d2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                        Track Complaint
                    </a>
                </p>
                <p>Best regards,<br>CES Rwanda Team</p>
            `,
        });
    }

    async sendComplaintResponse(complaint: Complaint, response: string) {
        await this.transporter.sendMail({
            from: "niyokwizerajd123@gmail.com",
            to: complaint.user.email,
            subject: `New Response to Your Complaint - ${complaint.title}`,
            html: `
                <h1>New Response to Your Complaint</h1>
                <p>Hello ${complaint.user.firstName},</p>
                <p>A new response has been added to your complaint:</p>
                <p><strong>Title:</strong> ${complaint.title}</p>
                <p><strong>Response:</strong></p>
                <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
                    ${response}
                </div>
                <p>You can view the full complaint and response history by clicking the button below:</p>
                <p>
                    <a href="http://localhost:5000/track-complaints" style="background-color: #1976d2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                        View Complaint
                    </a>
                </p>
                <p>Best regards,<br>CES Rwanda Team</p>
            `,
        });
    }
}

export const emailService = new EmailService(); 