import { Router } from "express";
import { ComplaintController } from "../controllers/complaintController";
import { authMiddleware } from "../middleware/authMiddleware";
import { adminMiddleware } from "../middleware/adminMiddleware";

const router = Router();

// Public routes
router.get("/categories", ComplaintController.getCategories);
router.get("/agencies", ComplaintController.getAgencies);

// Protected routes
router.use(authMiddleware);

// User routes
router.post("/", ComplaintController.submitComplaint);
router.get("/my-complaints", ComplaintController.getComplaints);
router.get("/:id", ComplaintController.getComplaintById);
router.patch("/:id", ComplaintController.updateComplaint);
router.delete("/:id", ComplaintController.deleteComplaint);

// Admin routes
router.get("/all", adminMiddleware, ComplaintController.getAllComplaints);
router.post("/:id/respond", adminMiddleware, ComplaintController.respondToComplaint);

export default router; 