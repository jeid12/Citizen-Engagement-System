import { Router } from "express";
import { ComplaintController } from "../controllers/complaintController";
import { authMiddleware } from "../middleware/authMiddleware";
import { adminMiddleware } from "../middleware/adminMiddleware";
import { agencyStaffMiddleware } from "../middleware/agencyStaffMiddleware";

const router = Router();

// Public routes
router.get("/categories", ComplaintController.getCategories);
router.get("/agencies", ComplaintController.getAgencies);

// Protected routes
router.use(authMiddleware);

// Admin routes (must come before /:id routes to avoid parameter conflict)
router.get("/all", adminMiddleware, ComplaintController.getAllComplaints);
router.post("/:id/respond", adminMiddleware, ComplaintController.respondToComplaint);

// Agency staff routes
router.get("/agency", agencyStaffMiddleware, ComplaintController.getAgencyComplaints);
router.post("/:id/respond", agencyStaffMiddleware, ComplaintController.respondToComplaint);

// User routes
router.post("/", ComplaintController.submitComplaint);
router.get("/my-complaints", ComplaintController.getComplaints);
router.get("/:id", ComplaintController.getComplaintById);
router.patch("/:id", ComplaintController.updateComplaint);
router.delete("/:id", ComplaintController.deleteComplaint);

export default router; 