"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateComplaint = void 0;
const express_validator_1 = require("express-validator");
exports.validateComplaint = [
    (0, express_validator_1.body)("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ min: 5, max: 100 })
        .withMessage("Title must be between 5 and 100 characters"),
    (0, express_validator_1.body)("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required")
        .isLength({ min: 20, max: 1000 })
        .withMessage("Description must be between 20 and 1000 characters"),
    (0, express_validator_1.body)("categoryId")
        .trim()
        .notEmpty()
        .withMessage("Category is required")
        .isUUID()
        .withMessage("Invalid category ID"),
    (0, express_validator_1.body)("location")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Location cannot be empty if provided"),
    (0, express_validator_1.body)("attachments")
        .optional()
        .isArray()
        .withMessage("Attachments must be an array"),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
//# sourceMappingURL=validationMiddleware.js.map