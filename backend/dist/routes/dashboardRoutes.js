"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboardController_1 = require("../controllers/dashboardController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Protected routes - require authentication
router.use(authMiddleware_1.authMiddleware);
router.get("/stats", dashboardController_1.DashboardController.getUserStats);
exports.default = router;
//# sourceMappingURL=dashboardRoutes.js.map