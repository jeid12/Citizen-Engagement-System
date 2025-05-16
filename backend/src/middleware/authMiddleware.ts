import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "No authentication token provided" });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any;
            
            // Get user from database
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOne({ 
                where: { id: decoded.userId },
                select: [
                    "id",
                    "firstName",
                    "lastName",
                    "email",
                    "role",
                    "isEmailVerified"
                ]
            });

            if (!user) {
                return res.status(401).json({ message: "User not found" });
            }

            if (!user.isEmailVerified) {
                return res.status(401).json({ message: "Email not verified" });
            }

            // Set user and role in request
            (req as any).user = user;
            (req as any).userId = user.id;
            (req as any).userRole = user.role;

            next();
        } catch (jwtError) {
            console.error("JWT verification error:", jwtError);
            return res.status(401).json({ message: "Invalid or expired token" });
        }
    } catch (error) {
        console.error("Auth middleware error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}; 