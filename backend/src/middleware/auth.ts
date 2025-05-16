import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";

interface JwtPayload {
    userId: string;
}

// Extend Express Request type to include user and token
declare global {
    namespace Express {
        interface Request {
            user?: User;
            token?: string;
        }
    }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new Error("No token provided");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as JwtPayload;
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { id: decoded.userId } });

        if (!user) {
            throw new Error("User not found");
        }

        // Add user and token to request object using proper types
        req.user = user;
        req.token = token;

        next();
    } catch (error) {
        res.status(401).json({ message: "Please authenticate" });
    }
}; 