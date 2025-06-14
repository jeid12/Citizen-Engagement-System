"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const router = (0, express_1.Router)();
// Protected routes - require authentication and admin role
router.use(authMiddleware_1.authMiddleware);
router.use(adminMiddleware_1.adminMiddleware);
// Get all users
router.get("/", userController_1.UserController.getAllUsers);
// Get user statistics
router.get("/stats", userController_1.UserController.getUserStats);
// Update user role
router.patch("/:id/role", userController_1.UserController.updateUserRole);
// Verify user
router.post("/:id/verify", userController_1.UserController.verifyUser);
// Delete user
router.delete("/:id", userController_1.UserController.deleteUser);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map