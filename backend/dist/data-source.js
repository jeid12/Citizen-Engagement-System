"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const User_1 = require("./entity/User");
const Complaint_1 = require("./entity/Complaint");
const Category_1 = require("./entity/Category");
const Agency_1 = require("./entity/Agency");
const ComplaintResponse_1 = require("./entity/ComplaintResponse");
const Review_1 = require("./entity/Review");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    url: "postgresql://postgres.xfrtxnbwgkaofydvmeiv:Niyokwizera1$@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
    ssl: {
        rejectUnauthorized: false,
    },
    synchronize: process.env.NODE_ENV !== "production",
    logging: process.env.NODE_ENV !== "production",
    entities: [User_1.User, Complaint_1.Complaint, Category_1.Category, Agency_1.Agency, ComplaintResponse_1.ComplaintResponse, Review_1.Review],
    migrations: ["dist/migration/**/*.js"],
    subscribers: ["dist/subscriber/**/*.js"],
});
//# sourceMappingURL=data-source.js.map