"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const data_source_1 = require("../data-source");
const User_1 = require("../entity/User");
const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
class UserController {
}
exports.UserController = UserController;
_a = UserController;
UserController.getAllUsers = async (req, res) => {
    try {
        const users = await userRepository.find({
            select: [
                "id",
                "firstName",
                "lastName",
                "email",
                "role",
                "isEmailVerified",
                "createdAt"
            ],
            order: {
                createdAt: "DESC"
            }
        });
        res.json(users);
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Error fetching users" });
    }
};
UserController.updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        // Validate role
        const validRoles = ["citizen", "admin", "agency_staff"];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }
        const user = await userRepository.findOne({ where: { id } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Prevent self-role change
        if (user.id === req.user.id) {
            return res.status(403).json({ message: "Cannot change your own role" });
        }
        user.role = role;
        await userRepository.save(user);
        res.json({
            message: "User role updated successfully",
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });
    }
    catch (error) {
        console.error("Error updating user role:", error);
        res.status(500).json({ message: "Error updating user role" });
    }
};
UserController.verifyUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userRepository.findOne({ where: { id } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Prevent self-verification
        if (user.id === req.user.id) {
            return res.status(403).json({ message: "Cannot verify your own account" });
        }
        user.isEmailVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await userRepository.save(user);
        res.json({
            message: "User verified successfully",
            user: {
                id: user.id,
                email: user.email,
                isEmailVerified: true
            }
        });
    }
    catch (error) {
        console.error("Error verifying user:", error);
        res.status(500).json({ message: "Error verifying user" });
    }
};
UserController.getUserStats = async (req, res) => {
    try {
        const totalUsers = await userRepository.count();
        const verifiedUsers = await userRepository.count({ where: { isEmailVerified: true } });
        const adminUsers = await userRepository.count({ where: { role: "admin" } });
        const agencyStaffUsers = await userRepository.count({ where: { role: "agency_staff" } });
        res.json({
            total: totalUsers,
            verified: verifiedUsers,
            admins: adminUsers,
            agencyStaff: agencyStaffUsers,
            citizens: totalUsers - adminUsers - agencyStaffUsers
        });
    }
    catch (error) {
        console.error("Error fetching user statistics:", error);
        res.status(500).json({ message: "Error fetching user statistics" });
    }
};
UserController.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userRepository.findOne({ where: { id } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Prevent self-deletion
        if (user.id === req.user.id) {
            return res.status(403).json({ message: "Cannot delete your own account" });
        }
        // Prevent deletion of other admin users
        if (user.role === 'admin') {
            return res.status(403).json({ message: "Cannot delete admin users" });
        }
        await userRepository.remove(user);
        res.json({
            message: "User deleted successfully",
            userId: id
        });
    }
    catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Error deleting user" });
    }
};
//# sourceMappingURL=userController.js.map