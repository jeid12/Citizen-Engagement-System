import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import complaintRoutes from "./routes/complaintRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import agencyRoutes from "./routes/agencyRoutes";
import profileRoutes from "./routes/profileRoutes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/agencies", agencyRoutes);
app.use("/api/profile", profileRoutes);

export default app; 