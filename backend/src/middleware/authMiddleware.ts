import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any;
        (req as any).userId = decoded.userId;
        (req as any).userRole = decoded.role;

        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        res.status(401).json({ message: "Invalid or expired token" });
    }
}; 