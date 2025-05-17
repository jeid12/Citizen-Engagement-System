import { Router } from "express";
import { DashboardController } from "../controllers/dashboardController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Protected routes - require authentication
router.use(authMiddleware);
router.get("/stats", DashboardController.getUserStats);

export default router; 