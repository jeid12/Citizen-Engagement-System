import { Request, Response, NextFunction } from "express";

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).userRole;

    if (userRole !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
    }

    next();
}; 