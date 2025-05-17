import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Complaint } from "../entity/Complaint";
import { User } from "../entity/User";
import { Not, IsNull } from "typeorm";

export class DashboardController {
    static getUserStats = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId;
            const complaintRepository = AppDataSource.getRepository(Complaint);

            // Get total complaints
            const totalComplaints = await complaintRepository.count({
                where: { user: { id: userId } }
            });

            // Get pending complaints
            const pendingComplaints = await complaintRepository.count({
                where: { 
                    user: { id: userId },
                    status: "pending"
                }
            });

            // Get resolved complaints
            const resolvedComplaints = await complaintRepository.count({
                where: { 
                    user: { id: userId },
                    status: "resolved"
                }
            });

            // Get recent complaints
            const recentComplaints = await complaintRepository.find({
                where: { user: { id: userId } },
                order: { createdAt: "DESC" },
                take: 5,
                relations: ["category", "agency"]
            });

            // Calculate response rate by getting complaints with at least one response
            const complaintsWithResponses = await complaintRepository
                .createQueryBuilder("complaint")
                .leftJoin("complaint.responses", "response")
                .where("complaint.userId = :userId", { userId })
                .andWhere("response.id IS NOT NULL")
                .getCount();

            const responseRate = totalComplaints > 0 
                ? Math.round((complaintsWithResponses / totalComplaints) * 100)
                : 0;

            res.json({
                totalComplaints,
                pendingComplaints,
                resolvedComplaints,
                responseRate,
                recentComplaints
            });
        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
            res.status(500).json({ message: "Error fetching dashboard statistics" });
        }
    };
} 