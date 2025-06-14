"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("../data-source");
const User_1 = require("../entity/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function createAdminUser() {
    try {
        // Initialize the database connection
        await data_source_1.AppDataSource.initialize();
        const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        // Check if admin exists and delete it
        const existingAdmin = await userRepository.findOne({
            where: { email: "siencetechrwa@gmail.com" }
        });
        if (existingAdmin) {
            await userRepository.remove(existingAdmin);
            console.log("Existing admin user removed");
        }
        // Create admin user
        const adminUser = new User_1.User();
        adminUser.firstName = "Science";
        adminUser.lastName = "Tech";
        adminUser.email = "siencetechrwa@gmail.com";
        adminUser.password = await bcryptjs_1.default.hash("Admin@123", 12);
        adminUser.role = "admin";
        adminUser.isEmailVerified = true;
        await userRepository.save(adminUser);
        console.log("Admin user created successfully!");
        console.log("Email: siencetechrwa@gmail.com");
        console.log("Password: Admin@123");
    }
    catch (error) {
        console.error("Error creating admin user:", error);
    }
    finally {
        await data_source_1.AppDataSource.destroy();
    }
}
// Run the function
createAdminUser();
//# sourceMappingURL=createAdmin.js.map