import "reflect-metadata";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { AppDataSource } from "./data-source";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import complaintRoutes from "./routes/complaintRoutes";
import userRoutes from "./routes/userRoutes";
import agencyRoutes from "./routes/agencyRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import profileRoutes from "./routes/profileRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import reviewRoutes from "./routes/reviewRoutes";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/users", userRoutes);


app.use("/api/categories", categoryRoutes);
app.use("/api/agencies", agencyRoutes);
app.use("/api/profile", profileRoutes);

app.use("/api/dashboard", dashboardRoutes);
//review routes
app.use("/api/reviews", reviewRoutes);                                                                 

// Health check route
app.get("/health", (req: Request, res: Response) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: "Something went wrong!",
        error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
});

// Welcome route
app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Welcome to Citizen Engagement System API" });
});

// Start server
const PORT = 5000;

AppDataSource.initialize().then(() => {
    console.log("Data Source has been initialized!");
    
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(error => {
    console.error("Error during Data Source initialization:", error);
}); 