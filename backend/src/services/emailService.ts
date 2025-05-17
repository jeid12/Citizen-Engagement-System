import nodemailer from 'nodemailer';
import { User } from '../entity/User';
import { Complaint } from '../entity/Complaint';
import { Agency } from '../entity/Agency';

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Verify transporter connection
transporter.verify((error) => {
    if (error) {
        console.error('SMTP connection error:', error);
    } else {
        console.log('SMTP server is ready to send emails');
    }
});

export const sendEmail = async (options: EmailOptions): Promise<void> => {
    try {
        // Send mail with defined transport object
        await transporter.sendMail({
            from: process.env.SMTP_FROM || '"Citizen Engagement System" <noreply@ces.rw>',
            to: options.to,
            subject: options.subject,
            html: options.html
        });
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};

class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER || "niyokwizerajd123@gmail.com",
                pass: process.env.EMAIL_PASS || "ptup lswr dccy xdat",
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
        const mailOptions = {
            from: process.env.EMAIL_USER || "niyokwizerajd123@gmail.com",
            to: user.email,
            subject: "Email Verification OTP",
            html: `
                <h1>Email Verification</h1>
                <p>Hello ${user.firstName},</p>
                <p>Your OTP for email verification is: <strong>${otp}</strong></p>
                <p>This OTP will expire in 10 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
            `,
        };

        await this.transporter.sendMail(mailOptions);
    }

    async sendNewComplaintNotification(staffMember: User, complaint: Complaint, agency: Agency) {
        const mailOptions = {
            from: process.env.EMAIL_USER || "niyokwizerajd123@gmail.com",
            to: staffMember.email,
            subject: `New Complaint Assigned - ${complaint.title}`,
            html: `
                <h1>New Complaint Assigned</h1>
                <p>Hello ${staffMember.firstName},</p>
                <p>A new complaint has been assigned to ${agency.name}:</p>
                <h2>${complaint.title}</h2>
                <p><strong>Description:</strong> ${complaint.description}</p>
                <p><strong>Location:</strong> ${complaint.location || 'Not specified'}</p>
                <p><strong>Category:</strong> ${complaint.category.name}</p>
                <p><strong>Status:</strong> ${complaint.status}</p>
                <p><strong>Priority:</strong> ${complaint.priority}</p>
                <p>Please review and take necessary action.</p>
                <p>You can view the full details in your dashboard.</p>
            `,
        };

        await this.transporter.sendMail(mailOptions);
    }

    async sendComplaintConfirmation(user: User, complaint: Complaint, agency: Agency) {
        const mailOptions = {
            from: process.env.EMAIL_USER || "niyokwizerajd123@gmail.com",
            to: user.email,
            subject: `Complaint Submitted Successfully - ${complaint.title}`,
            html: `
                <h1>Complaint Submitted Successfully</h1>
                <p>Hello ${user.firstName},</p>
                <p>Your complaint has been successfully submitted and assigned to ${agency.name}.</p>
                <h2>${complaint.title}</h2>
                <p><strong>Description:</strong> ${complaint.description}</p>
                <p><strong>Location:</strong> ${complaint.location || 'Not specified'}</p>
                <p><strong>Category:</strong> ${complaint.category.name}</p>
                <p><strong>Status:</strong> ${complaint.status}</p>
                <p>You will be notified of any updates to your complaint.</p>
                <p>You can track the status of your complaint in your dashboard.</p>
            `,
        };

        await this.transporter.sendMail(mailOptions);
    }

    async sendComplaintResponse(complaint: Complaint, response: string) {
        const mailOptions = {
            from: process.env.EMAIL_USER || "niyokwizerajd123@gmail.com",
            to: complaint.user.email,
            subject: `Update on your complaint - ${complaint.title}`,
            html: `
                <h1>Complaint Update</h1>
                <p>Hello ${complaint.user.firstName},</p>
                <p>There has been an update to your complaint:</p>
                <h2>${complaint.title}</h2>
                <p><strong>New Response:</strong> ${response}</p>
                <p><strong>Current Status:</strong> ${complaint.status}</p>
                <p>You can view the full details in your dashboard.</p>
            `,
        };

        await this.transporter.sendMail(mailOptions);
    }
}

export const emailService = new EmailService(); 