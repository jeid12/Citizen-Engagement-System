"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = void 0;
const adminMiddleware = (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Authentication required" });
        }
        if (user.role !== "admin") {
            return res.status(403).json({ message: "Admin access required" });
        }
        next();
    }
    catch (error) {
        console.error("Admin middleware error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.adminMiddleware = adminMiddleware;
//# sourceMappingURL=adminMiddleware.js.map