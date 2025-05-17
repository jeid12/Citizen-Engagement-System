import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Agency } from "../entity/Agency";
import { User } from "../entity/User";

const agencyRepository = AppDataSource.getRepository(Agency);
const userRepository = AppDataSource.getRepository(User);

export class AgencyController {
    static getAllAgencies = async (req: Request, res: Response) => {
        try {
            const agencies = await agencyRepository.find({
                relations: ["staff"],
                order: { name: "ASC" }
            });
            res.json(agencies);
        } catch (error) {
            console.error("Error fetching agencies:", error);
            res.status(500).json({ message: "Error fetching agencies" });
        }
    };

    static getAgencyById = async (req: Request, res: Response) => {
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
        } catch (error) {
            console.error("Error fetching agency:", error);
            res.status(500).json({ message: "Error fetching agency" });
        }
    };

    static createAgency = async (req: Request, res: Response) => {
        try {
            const {
                name,
                description,
                contactEmail,
                contactPhone,
                address,
                website,
                jurisdiction,
                operatingHours
            } = req.body;

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
                operatingHours
            });

            await agencyRepository.save(agency);
            res.status(201).json(agency);
        } catch (error) {
            console.error("Error creating agency:", error);
            res.status(500).json({ message: "Error creating agency" });
        }
    };

    static updateAgency = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const agency = await agencyRepository.findOne({ where: { id } });
            if (!agency) {
                return res.status(404).json({ message: "Agency not found" });
            }

            Object.assign(agency, updateData);
            await agencyRepository.save(agency);

            res.json(agency);
        } catch (error) {
            console.error("Error updating agency:", error);
            res.status(500).json({ message: "Error updating agency" });
        }
    };

    static deleteAgency = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const agency = await agencyRepository.findOne({ where: { id } });

            if (!agency) {
                return res.status(404).json({ message: "Agency not found" });
            }

            await agencyRepository.remove(agency);
            res.json({ message: "Agency deleted successfully" });
        } catch (error) {
            console.error("Error deleting agency:", error);
            res.status(500).json({ message: "Error deleting agency" });
        }
    };

    static assignUserToAgency = async (req: Request, res: Response) => {
        try {
            const { agencyId, userId } = req.params;
            
            const agency = await agencyRepository.findOne({ where: { id: agencyId } });
            if (!agency) {
                return res.status(404).json({ message: "Agency not found" });
            }

            const user = await userRepository.findOne({ where: { id: userId } });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Update user role and agency
            user.role = "agency_staff";
            user.agency = agency;
            await userRepository.save(user);

            res.json({ message: "User assigned to agency successfully" });
        } catch (error) {
            console.error("Error assigning user to agency:", error);
            res.status(500).json({ message: "Error assigning user to agency" });
        }
    };

    static removeUserFromAgency = async (req: Request, res: Response) => {
        try {
            const { agencyId, userId } = req.params;
            
            const user = await userRepository.findOne({
                where: { id: userId, agency: { id: agencyId } }
            });

            if (!user) {
                return res.status(404).json({ message: "User not found or not assigned to this agency" });
            }

            // Remove agency assignment and reset role
            user.role = "user";
            user.agency = null;
            await userRepository.save(user);

            res.json({ message: "User removed from agency successfully" });
        } catch (error) {
            console.error("Error removing user from agency:", error);
            res.status(500).json({ message: "Error removing user from agency" });
        }
    };

    static getAgencyStaff = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const staff = await userRepository.find({
                where: { agency: { id }, role: "agency_staff" },
                select: ["id", "firstName", "lastName", "email", "role", "createdAt"]
            });

            res.json(staff);
        } catch (error) {
            console.error("Error fetching agency staff:", error);
            res.status(500).json({ message: "Error fetching agency staff" });
        }
    };
} 