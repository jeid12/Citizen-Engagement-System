"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoryController_1 = require("../controllers/categoryController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const data_source_1 = require("../data-source");
const Category_1 = require("../entity/Category");
const router = (0, express_1.Router)();
// Public route for getting active categories (used by complaint submission)
router.get("/active", async (req, res) => {
    try {
        const categoryRepository = data_source_1.AppDataSource.getRepository(Category_1.Category);
        const categories = await categoryRepository.find({
            where: { isActive: true },
            order: { name: "ASC" }
        });
        res.json(categories);
    }
    catch (error) {
        console.error("Error fetching active categories:", error);
        res.status(500).json({ message: "Error fetching active categories" });
    }
});
// Protected routes - require authentication and proper role
router.use(authMiddleware_1.authMiddleware);
// Custom middleware to check for admin or agency staff role
const checkAdminOrAgencyStaff = (req, res, next) => {
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
router.get("/", categoryController_1.CategoryController.getAll);
router.get("/:id", categoryController_1.CategoryController.getById);
// Toggle category status route (accessible by both admin and agency staff)
router.patch("/:id/toggle-status", async (req, res) => {
    try {
        const { id } = req.params;
        const categoryRepository = data_source_1.AppDataSource.getRepository(Category_1.Category);
        const category = await categoryRepository.findOne({ where: { id } });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        category.isActive = !category.isActive;
        await categoryRepository.save(category);
        res.json(category);
    }
    catch (error) {
        console.error("Error toggling category status:", error);
        res.status(500).json({ message: "Error updating category status" });
    }
});
// Admin-only routes
router.post("/", adminMiddleware_1.adminMiddleware, categoryController_1.CategoryController.create);
router.put("/:id", adminMiddleware_1.adminMiddleware, categoryController_1.CategoryController.update);
router.delete("/:id", adminMiddleware_1.adminMiddleware, categoryController_1.CategoryController.delete);
exports.default = router;
//# sourceMappingURL=categoryRoutes.js.map