import { Router } from "express";
import { UserController } from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";
import { adminMiddleware } from "../middleware/adminMiddleware";

const router = Router();

// Protected routes - require authentication and admin role
router.use(authMiddleware);
router.use(adminMiddleware);

// Get all users
router.get("/", UserController.getAllUsers);

// Get user statistics
router.get("/stats", UserController.getUserStats);

// Update user role
router.patch("/:id/role", UserController.updateUserRole);

// Verify user
router.post("/:id/verify", UserController.verifyUser);

// Delete user
router.delete("/:id", UserController.deleteUser);

export default router; 