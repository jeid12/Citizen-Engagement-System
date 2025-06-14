"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const data_source_1 = require("./data-source");
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const complaintRoutes_1 = __importDefault(require("./routes/complaintRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const agencyRoutes_1 = __importDefault(require("./routes/agencyRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const profileRoutes_1 = __importDefault(require("./routes/profileRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
// Load environment variables
dotenv_1.default.config();
// Create Express app
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
// Routes
app.use("/api/auth", authRoutes_1.default);
app.use("/api/complaints", complaintRoutes_1.default);
app.use("/api/users", userRoutes_1.default);
app.use("/api/categories", categoryRoutes_1.default);
app.use("/api/agencies", agencyRoutes_1.default);
app.use("/api/profile", profileRoutes_1.default);
app.use("/api/dashboard", dashboardRoutes_1.default);
//review routes
app.use("/api/reviews", reviewRoutes_1.default);
// Health check route
app.get("/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: "Something went wrong!",
        error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
});
// Welcome route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Citizen Engagement System API" });
});
// Start server
const PORT = 5000;
data_source_1.AppDataSource.initialize().then(() => {
    console.log("Data Source has been initialized!");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(error => {
    console.error("Error during Data Source initialization:", error);
});
//# sourceMappingURL=index.js.map