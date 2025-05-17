import { Router } from "express";
import { AgencyController } from "../controllers/agencyController";
import { authMiddleware } from "../middleware/authMiddleware";
import { adminMiddleware } from "../middleware/adminMiddleware";

const router = Router();

// Public routes
router.get("/", AgencyController.getAllAgencies);

// Protected routes - Admin only
router.use(authMiddleware);
router.use(adminMiddleware);

router.post("/", AgencyController.createAgency);
router.get("/:id", AgencyController.getAgencyById);
router.patch("/:id", AgencyController.updateAgency);
router.delete("/:id", AgencyController.deleteAgency);

// Agency staff management
router.get("/:id/staff", AgencyController.getAgencyStaff);
router.post("/:agencyId/assign/:userId", AgencyController.assignUserToAgency);
router.delete("/:agencyId/remove/:userId", AgencyController.removeUserFromAgency);

export default router; 