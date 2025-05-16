import { Request, Response, NextFunction } from "express";

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as any).user;
        
        if (!user) {
            return res.status(401).json({ message: "Authentication required" });
        }

        if (user.role !== "admin") {
            return res.status(403).json({ message: "Admin access required" });
        }

        next();
    } catch (error) {
        console.error("Admin middleware error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}; 