import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Complaint } from "../entity/Complaint";
import { Category } from "../entity/Category";
import { Agency } from "../entity/Agency";

export class ComplaintController {
    static createComplaint = async (req: Request, res: Response) => {
        try {
            const { title, description, location, categoryId } = req.body;
            const complaintRepository = AppDataSource.getRepository(Complaint);
            const categoryRepository = AppDataSource.getRepository(Category);

            // Find category
            const category = await categoryRepository.findOne({ where: { id: categoryId } });
            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }

            // Create complaint
            const complaint = complaintRepository.create({
                title,
                description,
                location,
                category,
                user: (req as any).user,
                status: "pending",
            });

            await complaintRepository.save(complaint);
            res.status(201).json(complaint);
        } catch (error) {
            console.error("Error creating complaint:", error);
            res.status(500).json({ message: "Error creating complaint" });
        }
    };

    static getComplaints = async (req: Request, res: Response) => {
        try {
            const complaintRepository = AppDataSource.getRepository(Complaint);
            const complaints = await complaintRepository.find({
                where: { user: { id: (req as any).user.id } },
                relations: ["category", "agency"],
            });

            res.json(complaints);
        } catch (error) {
            console.error("Error fetching complaints:", error);
            res.status(500).json({ message: "Error fetching complaints" });
        }
    };

    static getComplaintById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const complaintRepository = AppDataSource.getRepository(Complaint);
            const complaint = await complaintRepository.findOne({
                where: { id, user: { id: (req as any).user.id } },
                relations: ["category", "agency"],
            });

            if (!complaint) {
                return res.status(404).json({ message: "Complaint not found" });
            }

            res.json(complaint);
        } catch (error) {
            console.error("Error fetching complaint:", error);
            res.status(500).json({ message: "Error fetching complaint" });
        }
    };

    static updateComplaint = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { status, response, agencyId } = req.body;
            const complaintRepository = AppDataSource.getRepository(Complaint);
            const agencyRepository = AppDataSource.getRepository(Agency);

            const complaint = await complaintRepository.findOne({
                where: { id },
                relations: ["user", "category", "agency"],
            });

            if (!complaint) {
                return res.status(404).json({ message: "Complaint not found" });
            }

            // Only allow updates by the complaint owner or agency staff
            if (
                complaint.user.id !== (req as any).user.id &&
                (req as any).user.role !== "agency_staff" &&
                (req as any).user.role !== "admin"
            ) {
                return res.status(403).json({ message: "Not authorized to update this complaint" });
            }

            // Update fields
            if (status) complaint.status = status;
            if (response) {
                complaint.response = response;
                complaint.respondedBy = (req as any).user.id;
            }
            if (agencyId) {
                const agency = await agencyRepository.findOne({ where: { id: agencyId } });
                if (!agency) {
                    return res.status(404).json({ message: "Agency not found" });
                }
                complaint.agency = agency;
            }

            await complaintRepository.save(complaint);
            res.json(complaint);
        } catch (error) {
            console.error("Error updating complaint:", error);
            res.status(500).json({ message: "Error updating complaint" });
        }
    };

    static deleteComplaint = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const complaintRepository = AppDataSource.getRepository(Complaint);
            const complaint = await complaintRepository.findOne({
                where: { id, user: { id: (req as any).user.id } },
            });

            if (!complaint) {
                return res.status(404).json({ message: "Complaint not found" });
            }

            await complaintRepository.remove(complaint);
            res.json({ message: "Complaint deleted successfully" });
        } catch (error) {
            console.error("Error deleting complaint:", error);
            res.status(500).json({ message: "Error deleting complaint" });
        }
    };
} 