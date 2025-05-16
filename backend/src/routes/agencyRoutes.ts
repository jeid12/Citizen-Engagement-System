import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Protected routes
router.use(authMiddleware);

// Basic CRUD routes will be added here
router.get("/", (req, res) => {
    res.json({ message: "Agencies endpoint" });
});

export default router; 