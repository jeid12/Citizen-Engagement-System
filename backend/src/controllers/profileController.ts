import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse } from "cloudinary";

const userRepository = AppDataSource.getRepository(User);

// Configure Cloudinary directly
cloudinary.config({
    cloud_name: 'dxufhhhbl',
    api_key: '656287143733291',
    api_secret: '5MUejExUbvXOvC41-PPSiHR_T1s'
});

export class ProfileController {
    static getProfile = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId;
            const user = await userRepository.findOne({
                where: { id: userId },
                select: [
                    "id",
                    "firstName",
                    "lastName",
                    "email",
                    "phoneNumber",
                    "role",
                    "profilePhoto",
                    "bio",
                    "address",
                    "city",
                    "country",
                    "isEmailVerified",
                    "createdAt"
                ]
            });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            res.json(user);
        } catch (error) {
            console.error("Error fetching profile:", error);
            res.status(500).json({ message: "Error fetching profile" });
        }
    };

    static updateProfile = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId;
            const {
                firstName,
                lastName,
                phoneNumber,
                bio,
                address,
                city,
                country
            } = req.body;

            const user = await userRepository.findOne({ where: { id: userId } });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Update fields if provided
            if (firstName) user.firstName = firstName;
            if (lastName) user.lastName = lastName;
            if (phoneNumber) user.phoneNumber = phoneNumber;
            if (bio) user.bio = bio;
            if (address) user.address = address;
            if (city) user.city = city;
            if (country) user.country = country;

            await userRepository.save(user);

            res.json({
                message: "Profile updated successfully",
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    bio: user.bio,
                    address: user.address,
                    city: user.city,
                    country: user.country,
                    profilePhoto: user.profilePhoto
                }
            });
        } catch (error) {
            console.error("Error updating profile:", error);
            res.status(500).json({ message: "Error updating profile" });
        }
    };

    static uploadProfilePhoto = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId;
            const file = req.file;

            if (!file) {
                return res.status(400).json({ message: "No file uploaded" });
            }

            const user = await userRepository.findOne({ where: { id: userId } });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Upload to Cloudinary
            const result: UploadApiResponse = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({
                    folder: 'profile_photos',
                    allowed_formats: ['jpg', 'png', 'jpeg'],
                    transformation: [
                        { width: 500, height: 500, crop: 'fill' },
                        { quality: 'auto' }
                    ]
                }, (error, result) => {
                    if (error) reject(error);
                    else resolve(result as UploadApiResponse);
                }).end(file.buffer);
            });

            // Delete old photo if exists
            if (user.profilePhoto) {
                const publicId = user.profilePhoto.split('/').pop()?.split('.')[0];
                if (publicId) {
                    await cloudinary.uploader.destroy(`profile_photos/${publicId}`);
                }
            }

            // Update user profile photo URL
            user.profilePhoto = result.secure_url;
            await userRepository.save(user);

            res.json({
                message: "Profile photo updated successfully",
                profilePhoto: result.secure_url
            });
        } catch (error) {
            console.error("Error uploading profile photo:", error);
            res.status(500).json({ message: "Error uploading profile photo" });
        }
    };
} 