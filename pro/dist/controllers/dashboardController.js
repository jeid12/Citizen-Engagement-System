"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const data_source_1 = require("../data-source");
const Complaint_1 = require("../entity/Complaint");
class DashboardController {
}
exports.DashboardController = DashboardController;
_a = DashboardController;
DashboardController.getUserStats = async (req, res) => {
    try {
        const userId = req.userId;
        const complaintRepository = data_source_1.AppDataSource.getRepository(Complaint_1.Complaint);
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
    }
    catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ message: "Error fetching dashboard statistics" });
    }
};
//# sourceMappingURL=dashboardController.js.map