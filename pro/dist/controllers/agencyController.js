"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgencyController = void 0;
const data_source_1 = require("../data-source");
const Agency_1 = require("../entity/Agency");
const User_1 = require("../entity/User");
const agencyRepository = data_source_1.AppDataSource.getRepository(Agency_1.Agency);
const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
class AgencyController {
}
exports.AgencyController = AgencyController;
_a = AgencyController;
AgencyController.getAllAgencies = async (req, res) => {
    try {
        const agencies = await agencyRepository.find({
            relations: ["staff"],
            order: { name: "ASC" }
        });
        res.json(agencies);
    }
    catch (error) {
        console.error("Error fetching agencies:", error);
        res.status(500).json({ message: "Error fetching agencies" });
    }
};
AgencyController.getAgencyById = async (req, res) => {
    try {
        const { id } = req.params;
        const agency = await agencyRepository.findOne({
            where: { id },
            relations: ["staff"]
        });
        if (!agency) {
            return res.status(404).json({ message: "Agency not found" });
        }
        res.json(agency);
    }
    catch (error) {
        console.error("Error fetching agency:", error);
        res.status(500).json({ message: "Error fetching agency" });
    }
};
AgencyController.createAgency = async (req, res) => {
    try {
        const { name, description, contactEmail, contactPhone, address, website, jurisdiction, operatingHours, isActive } = req.body;
        // Validate required fields
        if (!name || !description) {
            return res.status(400).json({ message: "Name and description are required" });
        }
        // Validate email format if provided
        if (contactEmail && !contactEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        const existingAgency = await agencyRepository.findOne({ where: { name } });
        if (existingAgency) {
            return res.status(400).json({ message: "Agency with this name already exists" });
        }
        const agency = agencyRepository.create({
            name,
            description,
            contactEmail,
            contactPhone,
            address,
            website,
            jurisdiction,
            operatingHours,
            isActive: isActive ?? true
        });
        await agencyRepository.save(agency);
        res.status(201).json(agency);
    }
    catch (error) {
        console.error("Error creating agency:", error);
        res.status(500).json({ message: "Error creating agency" });
    }
};
AgencyController.updateAgency = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        // Validate required fields if provided
        if (updateData.name === '') {
            return res.status(400).json({ message: "Name cannot be empty" });
        }
        if (updateData.description === '') {
            return res.status(400).json({ message: "Description cannot be empty" });
        }
        // Validate email format if provided
        if (updateData.contactEmail && !updateData.contactEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        const agency = await agencyRepository.findOne({ where: { id } });
        if (!agency) {
            return res.status(404).json({ message: "Agency not found" });
        }
        // Check for name uniqueness if name is being updated
        if (updateData.name && updateData.name !== agency.name) {
            const existingAgency = await agencyRepository.findOne({ where: { name: updateData.name } });
            if (existingAgency) {
                return res.status(400).json({ message: "Agency with this name already exists" });
            }
        }
        Object.assign(agency, updateData);
        await agencyRepository.save(agency);
        res.json(agency);
    }
    catch (error) {
        console.error("Error updating agency:", error);
        res.status(500).json({ message: "Error updating agency" });
    }
};
AgencyController.deleteAgency = async (req, res) => {
    try {
        const { id } = req.params;
        const agency = await agencyRepository.findOne({
            where: { id },
            relations: ["staff", "complaints"]
        });
        if (!agency) {
            return res.status(404).json({ message: "Agency not found" });
        }
        // Check if agency has active complaints
        if (agency.complaints && agency.complaints.length > 0) {
            return res.status(400).json({
                message: "Cannot delete agency with active complaints. Please reassign or resolve complaints first."
            });
        }
        // Remove agency reference from staff members
        if (agency.staff && agency.staff.length > 0) {
            for (const staff of agency.staff) {
                staff.role = "citizen";
                staff.agency = undefined;
                await userRepository.save(staff);
            }
        }
        await agencyRepository.remove(agency);
        res.json({ message: "Agency deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting agency:", error);
        res.status(500).json({ message: "Error deleting agency" });
    }
};
AgencyController.assignUserToAgency = async (req, res) => {
    try {
        const { agencyId, userId } = req.params;
        const agency = await agencyRepository.findOne({ where: { id: agencyId } });
        if (!agency) {
            return res.status(404).json({ message: "Agency not found" });
        }
        if (!agency.isActive) {
            return res.status(400).json({ message: "Cannot assign users to inactive agency" });
        }
        const user = await userRepository.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Check if user is already assigned to another agency
        if (user.agency) {
            return res.status(400).json({ message: "User is already assigned to an agency" });
        }
        // Update user role and agency
        user.role = "agency_staff";
        user.agency = agency;
        await userRepository.save(user);
        res.json({ message: "User assigned to agency successfully" });
    }
    catch (error) {
        console.error("Error assigning user to agency:", error);
        res.status(500).json({ message: "Error assigning user to agency" });
    }
};
AgencyController.removeUserFromAgency = async (req, res) => {
    try {
        const { agencyId, userId } = req.params;
        const user = await userRepository.findOne({
            where: { id: userId, agency: { id: agencyId } }
        });
        if (!user) {
            return res.status(404).json({ message: "User not found or not assigned to this agency" });
        }
        // Remove agency assignment and reset role
        user.role = "citizen";
        user.agency = undefined;
        await userRepository.save(user);
        res.json({ message: "User removed from agency successfully" });
    }
    catch (error) {
        console.error("Error removing user from agency:", error);
        res.status(500).json({ message: "Error removing user from agency" });
    }
};
AgencyController.getAgencyStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const agency = await agencyRepository.findOne({ where: { id } });
        if (!agency) {
            return res.status(404).json({ message: "Agency not found" });
        }
        if (!agency.isActive) {
            return res.status(400).json({ message: "Cannot view staff of inactive agency" });
        }
        const staff = await userRepository.find({
            where: { agency: { id }, role: "agency_staff" },
            select: ["id", "firstName", "lastName", "email", "role", "createdAt"]
        });
        res.json(staff);
    }
    catch (error) {
        console.error("Error fetching agency staff:", error);
        res.status(500).json({ message: "Error fetching agency staff" });
    }
};
//# sourceMappingURL=agencyController.js.map