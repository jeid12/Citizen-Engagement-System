"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const complaintRoutes_1 = __importDefault(require("./routes/complaintRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const agencyRoutes_1 = __importDefault(require("./routes/agencyRoutes"));
const profileRoutes_1 = __importDefault(require("./routes/profileRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use("/api/auth", authRoutes_1.default);
app.use("/api/users", userRoutes_1.default);
app.use("/api/complaints", complaintRoutes_1.default);
app.use("/api/categories", categoryRoutes_1.default);
app.use("/api/agencies", agencyRoutes_1.default);
app.use("/api/profile", profileRoutes_1.default);
app.use("/api/dashboard", dashboardRoutes_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map