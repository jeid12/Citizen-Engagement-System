import { Router } from "express";
import { CategoryController } from "../controllers/categoryController";
import { authMiddleware } from "../middleware/authMiddleware";
import { adminMiddleware } from "../middleware/adminMiddleware";
import { AppDataSource } from "../data-source";
import { Category } from "../entity/Category";

const router = Router();

// Public route for getting active categories (used by complaint submission)
router.get("/active", async (req, res) => {
    try {
        const categoryRepository = AppDataSource.getRepository(Category);
        const categories = await categoryRepository.find({
            where: { isActive: true },
            order: { name: "ASC" }
        });
        res.json(categories);
    } catch (error) {
        console.error("Error fetching active categories:", error);
        res.status(500).json({ message: "Error fetching active categories" });
    }
});

// Protected routes - require authentication and proper role
router.use(authMiddleware);

// Custom middleware to check for admin or agency staff role
const checkAdminOrAgencyStaff = (req: any, res: any, next: any) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "Authentication required" });
    }

    if (user.role !== "admin" && user.role !== "agency_staff") {
        return res.status(403).json({ message: "Admin or agency staff access required" });
    }

    next();
};

// Apply role check middleware for read operations
router.use(checkAdminOrAgencyStaff);

// Read-only routes (accessible by both admin and agency staff)
router.get("/", CategoryController.getAll);
router.get("/:id", CategoryController.getById);

// Toggle category status route (accessible by both admin and agency staff)
router.patch("/:id/toggle-status", async (req, res) => {
    try {
        const { id } = req.params;
        const categoryRepository = AppDataSource.getRepository(Category);
        const category = await categoryRepository.findOne({ where: { id } });

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        category.isActive = !category.isActive;
        await categoryRepository.save(category);
        res.json(category);
    } catch (error) {
        console.error("Error toggling category status:", error);
        res.status(500).json({ message: "Error updating category status" });
    }
});

// Admin-only routes
router.post("/", adminMiddleware, CategoryController.create);
router.put("/:id", adminMiddleware, CategoryController.update);
router.delete("/:id", adminMiddleware, CategoryController.delete);

export default router; 