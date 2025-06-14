"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplaintController = void 0;
const data_source_1 = require("../data-source");
const Complaint_1 = require("../entity/Complaint");
const Category_1 = require("../entity/Category");
const Agency_1 = require("../entity/Agency");
const ComplaintResponse_1 = require("../entity/ComplaintResponse");
const User_1 = require("../entity/User");
const emailService_1 = require("../services/emailService");
class ComplaintController {
}
exports.ComplaintController = ComplaintController;
_a = ComplaintController;
ComplaintController.getCategories = async (req, res) => {
    try {
        const categoryRepository = data_source_1.AppDataSource.getRepository(Category_1.Category);
        const categories = await categoryRepository.find({
            where: { isActive: true },
            order: { name: "ASC" }
        });
        res.json(categories);
    }
    catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ message: "Error fetching categories" });
    }
};
ComplaintController.getAgencies = async (req, res) => {
    try {
        const agencyRepository = data_source_1.AppDataSource.getRepository(Agency_1.Agency);
        const agencies = await agencyRepository.find({
            where: { isActive: true },
            order: { name: "ASC" }
        });
        res.json(agencies);
    }
    catch (error) {
        console.error("Error fetching agencies:", error);
        res.status(500).json({ message: "Error fetching agencies" });
    }
};
ComplaintController.submitComplaint = async (req, res) => {
    try {
        const { title, description, location, categoryId, agencyId, attachments } = req.body;
        const complaintRepository = data_source_1.AppDataSource.getRepository(Complaint_1.Complaint);
        const categoryRepository = data_source_1.AppDataSource.getRepository(Category_1.Category);
        const agencyRepository = data_source_1.AppDataSource.getRepository(Agency_1.Agency);
        const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        // Find category
        const category = await categoryRepository.findOne({ where: { id: categoryId } });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        // Find agency
        const agency = await agencyRepository.findOne({
            where: { id: agencyId },
            relations: ['staff'] // Include agency staff for notifications
        });
        if (!agency) {
            return res.status(404).json({ message: "Agency not found" });
        }
        // Get user
        const user = await userRepository.findOne({
            where: { id: req.userId },
            select: ['id', 'firstName', 'lastName', 'email']
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Create complaint
        const complaint = complaintRepository.create({
            title,
            description,
            location,
            category,
            agency,
            attachments,
            user,
            status: "pending",
            priority: "medium", // Default priority
        });
        await complaintRepository.save(complaint);
        // Send email notifications
        try {
            // Notify agency staff
            if (agency.staff && agency.staff.length > 0) {
                for (const staffMember of agency.staff) {
                    await emailService_1.emailService.sendNewComplaintNotification(staffMember, complaint, agency);
                }
            }
            // Notify user of successful submission
            await emailService_1.emailService.sendComplaintConfirmation(user, complaint, agency);
        }
        catch (emailError) {
            console.error("Error sending email notifications:", emailError);
            // Don't fail the request if email fails
        }
        res.status(201).json({
            message: "Complaint submitted successfully",
            complaint: {
                id: complaint.id,
                title: complaint.title,
                status: complaint.status,
                category: category.name,
                agency: agency.name,
                createdAt: complaint.createdAt
            }
        });
    }
    catch (error) {
        console.error("Error creating complaint:", error);
        res.status(500).json({ message: "Error creating complaint" });
    }
};
ComplaintController.getComplaints = async (req, res) => {
    try {
        const complaintRepository = data_source_1.AppDataSource.getRepository(Complaint_1.Complaint);
        const complaints = await complaintRepository.find({
            where: { user: { id: req.user.id } },
            relations: ["category", "agency"],
        });
        res.json(complaints);
    }
    catch (error) {
        console.error("Error fetching complaints:", error);
        res.status(500).json({ message: "Error fetching complaints" });
    }
};
ComplaintController.getComplaintById = async (req, res) => {
    try {
        const { id } = req.params;
        const complaintRepository = data_source_1.AppDataSource.getRepository(Complaint_1.Complaint);
        const complaint = await complaintRepository.findOne({
            where: { id, user: { id: req.user.id } },
            relations: ["category", "agency"],
        });
        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }
        res.json(complaint);
    }
    catch (error) {
        console.error("Error fetching complaint:", error);
        res.status(500).json({ message: "Error fetching complaint" });
    }
};
ComplaintController.updateComplaint = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, agencyId } = req.body;
        const complaintRepository = data_source_1.AppDataSource.getRepository(Complaint_1.Complaint);
        const agencyRepository = data_source_1.AppDataSource.getRepository(Agency_1.Agency);
        const complaint = await complaintRepository.findOne({
            where: { id },
            relations: ["user", "category", "agency"],
        });
        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }
        // Only allow updates by the complaint owner or agency staff
        if (complaint.user.id !== req.user.id &&
            req.user.role !== "agency_staff" &&
            req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized to update this complaint" });
        }
        // Update fields
        if (status)
            complaint.status = status;
        if (agencyId) {
            const agency = await agencyRepository.findOne({ where: { id: agencyId } });
            if (!agency) {
                return res.status(404).json({ message: "Agency not found" });
            }
            complaint.agency = agency;
        }
        await complaintRepository.save(complaint);
        res.json(complaint);
    }
    catch (error) {
        console.error("Error updating complaint:", error);
        res.status(500).json({ message: "Error updating complaint" });
    }
};
ComplaintController.deleteComplaint = async (req, res) => {
    try {
        const { id } = req.params;
        const complaintRepository = data_source_1.AppDataSource.getRepository(Complaint_1.Complaint);
        const complaint = await complaintRepository.findOne({
            where: { id, user: { id: req.user.id } },
        });
        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }
        await complaintRepository.remove(complaint);
        res.json({ message: "Complaint deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting complaint:", error);
        res.status(500).json({ message: "Error deleting complaint" });
    }
};
ComplaintController.getAllComplaints = async (req, res) => {
    try {
        const complaintRepository = data_source_1.AppDataSource.getRepository(Complaint_1.Complaint);
        const complaints = await complaintRepository.find({
            relations: ["user", "category", "agency", "responses"],
            order: { createdAt: "DESC" }
        });
        res.json(complaints || []);
    }
    catch (error) {
        console.error("Error fetching all complaints:", error);
        res.status(500).json({ message: "Error fetching all complaints" });
    }
};
ComplaintController.respondToComplaint = async (req, res) => {
    try {
        const { id } = req.params;
        const { response, status } = req.body;
        const complaintRepository = data_source_1.AppDataSource.getRepository(Complaint_1.Complaint);
        const responseRepository = data_source_1.AppDataSource.getRepository(ComplaintResponse_1.ComplaintResponse);
        // Find complaint
        const complaint = await complaintRepository.findOne({
            where: { id },
            relations: ["responses", "user"]
        });
        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }
        // Create response
        const complaintResponse = responseRepository.create({
            response,
            complaint,
            respondedBy: req.user
        });
        await responseRepository.save(complaintResponse);
        // Update complaint status if provided
        if (status && status !== complaint.status) {
            complaint.status = status;
            await complaintRepository.save(complaint);
        }
        // Send email notification to the user
        try {
            await emailService_1.emailService.sendComplaintResponse(complaint, response);
        }
        catch (emailError) {
            console.error("Error sending email notification:", emailError);
            // Don't fail the request if email fails
        }
        res.json({
            message: "Response added successfully",
            response: complaintResponse,
            complaint
        });
    }
    catch (error) {
        console.error("Error responding to complaint:", error);
        res.status(500).json({ message: "Error responding to complaint" });
    }
};
ComplaintController.getAgencyComplaints = async (req, res) => {
    try {
        const agencyId = req.agencyId;
        const complaintRepository = data_source_1.AppDataSource.getRepository(Complaint_1.Complaint);
        const complaints = await complaintRepository.find({
            where: { agency: { id: agencyId } },
            relations: ["user", "category", "agency", "responses", "responses.respondedBy"],
            order: { createdAt: "DESC" }
        });
        res.json(complaints);
    }
    catch (error) {
        console.error("Error fetching agency complaints:", error);
        res.status(500).json({ message: "Error fetching agency complaints" });
    }
};
//# sourceMappingURL=complaintController.js.map