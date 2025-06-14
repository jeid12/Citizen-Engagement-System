"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agencyStaffMiddleware = void 0;
const data_source_1 = require("../data-source");
const User_1 = require("../entity/User");
const agencyStaffMiddleware = async (req, res, next) => {
    try {
        const userId = req.userId;
        const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        const user = await userRepository.findOne({
            where: { id: userId },
            relations: ["agency"]
        });
        if (!user || user.role !== "agency_staff" || !user.agency) {
            return res.status(403).json({ message: "Access denied. Agency staff only." });
        }
        // Add agency info to request for use in controller
        req.agencyId = user.agency.id;
        next();
    }
    catch (error) {
        console.error("Agency staff middleware error:", error);
        res.status(500).json({ message: "Error checking agency staff permissions" });
    }
};
exports.agencyStaffMiddleware = agencyStaffMiddleware;
//# sourceMappingURL=agencyStaffMiddleware.js.map