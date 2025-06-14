"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../entity/User");
const data_source_1 = require("../data-source");
const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            throw new Error("No token provided");
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "your-secret-key");
        const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        const user = await userRepository.findOne({ where: { id: decoded.userId } });
        if (!user) {
            throw new Error("User not found");
        }
        // Add user and token to request object using proper types
        req.user = user;
        req.token = token;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Please authenticate" });
    }
};
exports.auth = auth;
//# sourceMappingURL=auth.js.map