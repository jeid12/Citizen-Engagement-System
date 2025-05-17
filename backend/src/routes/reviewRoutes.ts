import { Router } from "express";
import { ReviewController } from "../controllers/reviewController";
import { body } from "express-validator";
import { validateRequest } from "../middleware/validateRequest";

const router = Router();

// Validation middleware
const reviewValidation = [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("comment").trim().notEmpty().withMessage("Comment is required"),
    body("rating")
        .isInt({ min: 1, max: 5 })
        .withMessage("Rating must be between 1 and 5"),
];

// Routes
router.post("/submit", reviewValidation, validateRequest, ReviewController.submitReview);
router.get("/", ReviewController.getReviews);

export default router; 