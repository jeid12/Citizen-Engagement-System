"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
const data_source_1 = require("../data-source");
const Review_1 = require("../entity/Review");
class ReviewController {
}
exports.ReviewController = ReviewController;
_a = ReviewController;
ReviewController.submitReview = async (req, res) => {
    try {
        const { name, comment, rating } = req.body;
        // Validate input
        if (!name || !comment || !rating) {
            return res.status(400).json({ message: "Name, comment and rating are required" });
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }
        const reviewRepository = data_source_1.AppDataSource.getRepository(Review_1.Review);
        // Create new review
        const review = reviewRepository.create({
            name,
            comment,
            rating,
            isVisible: true
        });
        await reviewRepository.save(review);
        res.status(201).json({
            message: "Review submitted successfully",
            review
        });
    }
    catch (error) {
        console.error("Error submitting review:", error);
        res.status(500).json({ message: "Error submitting review" });
    }
};
ReviewController.getReviews = async (req, res) => {
    try {
        const reviewRepository = data_source_1.AppDataSource.getRepository(Review_1.Review);
        const reviews = await reviewRepository.find({
            where: { isVisible: true },
            order: { createdAt: "DESC" },
            take: 10 // Limit to latest 10 reviews
        });
        res.json(reviews);
    }
    catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ message: "Error fetching reviews" });
    }
};
//# sourceMappingURL=reviewController.js.map