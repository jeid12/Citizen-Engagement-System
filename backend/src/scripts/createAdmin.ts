import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import bcrypt from "bcryptjs";

async function createAdminUser() {
    try {
        // Initialize the database connection
        await AppDataSource.initialize();

        const userRepository = AppDataSource.getRepository(User);

        // Check if admin exists and delete it
        const existingAdmin = await userRepository.findOne({
            where: { email: "siencetechrwa@gmail.com" }
        });

        if (existingAdmin) {
            await userRepository.remove(existingAdmin);
            console.log("Existing admin user removed");
        }

        // Create admin user
        const adminUser = new User();
        adminUser.firstName = "Science";
        adminUser.lastName = "Tech";
        adminUser.email = "siencetechrwa@gmail.com";
        adminUser.password = await bcrypt.hash("Admin@123", 12);
        adminUser.role = "admin";
        adminUser.isEmailVerified = true;

        await userRepository.save(adminUser);

        console.log("Admin user created successfully!");
        console.log("Email: siencetechrwa@gmail.com");
        console.log("Password: Admin@123");

    } catch (error) {
        console.error("Error creating admin user:", error);
    } finally {
        await AppDataSource.destroy();
    }
}

// Run the function
createAdminUser(); 