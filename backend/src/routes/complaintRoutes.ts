import { Router } from "express";
import { ComplaintController } from "../controllers/complaintController";
import { auth } from "../middleware/auth";
import { body } from "express-validator";
import { validateRequest } from "../middleware/validateRequest";

const router = Router();

// Validation middleware
const createComplaintValidation = [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description").trim().notEmpty().withMessage("Description is required"),
    body("location").optional().trim().notEmpty().withMessage("Location cannot be empty if provided"),
    body("categoryId").trim().notEmpty().withMessage("Category is required"),
];

const updateComplaintValidation = [
    body("status")
        .optional()
        .isIn(["pending", "in_progress", "resolved", "rejected"])
        .withMessage("Invalid status"),
    body("response").optional().trim().notEmpty().withMessage("Response cannot be empty if provided"),
];

// Routes
router.post("/", auth, createComplaintValidation, validateRequest, ComplaintController.createComplaint);
router.get("/", auth, ComplaintController.getComplaints);
router.get("/:id", auth, ComplaintController.getComplaintById);
router.patch("/:id", auth, updateComplaintValidation, validateRequest, ComplaintController.updateComplaint);
router.delete("/:id", auth, ComplaintController.deleteComplaint);

export default router; 