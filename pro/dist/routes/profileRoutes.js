"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profileController_1 = require("../controllers/profileController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
// Configure multer for memory storage
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed!'));
        }
        cb(null, true);
    }
});
// Protected routes - require authentication
router.use(authMiddleware_1.authMiddleware);
// Get user profile
router.get("/", profileController_1.ProfileController.getProfile);
// Update user profile
router.patch("/", profileController_1.ProfileController.updateProfile);
// Upload profile photo
router.post("/photo", upload.single('photo'), profileController_1.ProfileController.uploadProfilePhoto);
exports.default = router;
//# sourceMappingURL=profileRoutes.js.map