"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const complaintController_1 = require("../controllers/complaintController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const agencyStaffMiddleware_1 = require("../middleware/agencyStaffMiddleware");
const router = (0, express_1.Router)();
// Public routes
router.get("/categories", complaintController_1.ComplaintController.getCategories);
router.get("/agencies", complaintController_1.ComplaintController.getAgencies);
// Protected routes
router.use(authMiddleware_1.authMiddleware);
// Admin routes (must come before /:id routes to avoid parameter conflict)
router.get("/all", adminMiddleware_1.adminMiddleware, complaintController_1.ComplaintController.getAllComplaints);
router.post("/:id/respond", adminMiddleware_1.adminMiddleware, complaintController_1.ComplaintController.respondToComplaint);
// Agency staff routes
router.get("/agency", agencyStaffMiddleware_1.agencyStaffMiddleware, complaintController_1.ComplaintController.getAgencyComplaints);
router.post("/:id/respond", agencyStaffMiddleware_1.agencyStaffMiddleware, complaintController_1.ComplaintController.respondToComplaint);
// User routes
router.post("/", complaintController_1.ComplaintController.submitComplaint);
router.get("/my-complaints", complaintController_1.ComplaintController.getComplaints);
router.get("/:id", complaintController_1.ComplaintController.getComplaintById);
router.patch("/:id", complaintController_1.ComplaintController.updateComplaint);
router.delete("/:id", complaintController_1.ComplaintController.deleteComplaint);
exports.default = router;
//# sourceMappingURL=complaintRoutes.js.map