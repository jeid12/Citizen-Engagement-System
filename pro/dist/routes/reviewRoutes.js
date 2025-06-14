"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reviewController_1 = require("../controllers/reviewController");
const express_validator_1 = require("express-validator");
const validateRequest_1 = require("../middleware/validateRequest");
const router = (0, express_1.Router)();
// Validation middleware
const reviewValidation = [
    (0, express_validator_1.body)("name").trim().notEmpty().withMessage("Name is required"),
    (0, express_validator_1.body)("comment").trim().notEmpty().withMessage("Comment is required"),
    (0, express_validator_1.body)("rating")
        .isInt({ min: 1, max: 5 })
        .withMessage("Rating must be between 1 and 5"),
];
// Routes
router.post("/submit", reviewValidation, validateRequest_1.validateRequest, reviewController_1.ReviewController.submitReview);
router.get("/", reviewController_1.ReviewController.getReviews);
exports.default = router;
//# sourceMappingURL=reviewRoutes.js.map