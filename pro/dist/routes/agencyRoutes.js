"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const agencyController_1 = require("../controllers/agencyController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const router = (0, express_1.Router)();
// Public routes - No authentication needed
router.get("/", agencyController_1.AgencyController.getAllAgencies);
// Protected routes - Require authentication
router.use(authMiddleware_1.authMiddleware);
// Admin-only routes
router.use(adminMiddleware_1.adminMiddleware);
router.post("/", agencyController_1.AgencyController.createAgency);
router.get("/:id", agencyController_1.AgencyController.getAgencyById);
router.patch("/:id", agencyController_1.AgencyController.updateAgency);
router.delete("/:id", agencyController_1.AgencyController.deleteAgency);
// Agency staff management
router.get("/:id/staff", agencyController_1.AgencyController.getAgencyStaff);
router.post("/:agencyId/assign/:userId", agencyController_1.AgencyController.assignUserToAgency);
router.delete("/:agencyId/remove/:userId", agencyController_1.AgencyController.removeUserFromAgency);
exports.default = router;
//# sourceMappingURL=agencyRoutes.js.map