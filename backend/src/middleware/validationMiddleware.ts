import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

export const validateComplaint = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ min: 5, max: 100 })
        .withMessage("Title must be between 5 and 100 characters"),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required")
        .isLength({ min: 20, max: 1000 })
        .withMessage("Description must be between 20 and 1000 characters"),

    body("categoryId")
        .trim()
        .notEmpty()
        .withMessage("Category is required")
        .isUUID()
        .withMessage("Invalid category ID"),

    body("location")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Location cannot be empty if provided"),

    body("attachments")
        .optional()
        .isArray()
        .withMessage("Attachments must be an array"),

    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]; 