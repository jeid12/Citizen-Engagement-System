import { Router } from "express";
import { ProfileController } from "../controllers/profileController";
import { authMiddleware } from "../middleware/authMiddleware";
import multer from "multer";

const router = Router();

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
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
router.use(authMiddleware);

// Get user profile
router.get("/", ProfileController.getProfile);

// Update user profile
router.patch("/", ProfileController.updateProfile);

// Upload profile photo
router.post("/photo", upload.single('photo'), ProfileController.uploadProfilePhoto);

export default router; 