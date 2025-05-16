import { Router } from "express";
import { ComplaintController } from "../controllers/complaintController";
import { authMiddleware } from "../middleware/authMiddleware";
import { adminMiddleware } from "../middleware/adminMiddleware";
import { validateComplaint } from "../middleware/validationMiddleware";

const router = Router();

// Public routes
router.get("/categories", ComplaintController.getCategories);

// Protected routes (requires authentication)
router.use(authMiddleware);
router.post("/submit", validateComplaint, ComplaintController.submitComplaint);
router.get("/my-complaints", ComplaintController.getComplaints);
router.get("/complaint/:id", ComplaintController.getComplaintById);

// Admin routes
router.use(adminMiddleware);
router.get("/all", ComplaintController.getAllComplaints);
router.post("/complaint/:id/respond", ComplaintController.respondToComplaint);

export default router; 