"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const data_source_1 = require("../data-source");
const User_1 = require("../entity/User");
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "No authentication token provided" });
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "your-secret-key");
            // Get user from database
            const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
            const user = await userRepository.findOne({
                where: { id: decoded.userId },
                select: [
                    "id",
                    "firstName",
                    "lastName",
                    "email",
                    "role",
                    "isEmailVerified"
                ]
            });
            if (!user) {
                return res.status(401).json({ message: "User not found" });
            }
            if (!user.isEmailVerified) {
                return res.status(401).json({ message: "Email not verified" });
            }
            // Set user and role in request
            req.user = user;
            req.userId = user.id;
            req.userRole = user.role;
            next();
        }
        catch (jwtError) {
            console.error("JWT verification error:", jwtError);
            return res.status(401).json({ message: "Invalid or expired token" });
        }
    }
    catch (error) {
        console.error("Auth middleware error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map