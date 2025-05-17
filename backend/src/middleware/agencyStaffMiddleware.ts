import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

export const agencyStaffMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).userId;
        const userRepository = AppDataSource.getRepository(User);
        
        const user = await userRepository.findOne({
            where: { id: userId },
            relations: ["agency"]
        });

        if (!user || user.role !== "agency_staff" || !user.agency) {
            return res.status(403).json({ message: "Access denied. Agency staff only." });
        }

        // Add agency info to request for use in controller
        (req as any).agencyId = user.agency.id;
        next();
    } catch (error) {
        console.error("Agency staff middleware error:", error);
        res.status(500).json({ message: "Error checking agency staff permissions" });
    }
}; 