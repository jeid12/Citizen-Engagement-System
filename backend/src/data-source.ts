import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Complaint } from "./entity/Complaint";
import { Category } from "./entity/Category";
import { Agency } from "./entity/Agency";
import { ComplaintResponse } from "./entity/ComplaintResponse";
import { Review } from "./entity/Review";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  url: "postgresql://postgres.xfrtxnbwgkaofydvmeiv:Niyokwizera1$@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
  ssl: {
    rejectUnauthorized: false,
  },
  synchronize: process.env.NODE_ENV !== "production",
  logging: process.env.NODE_ENV !== "production",
  entities: [User, Complaint, Category, Agency, ComplaintResponse, Review],
  migrations: ["dist/migration/**/*.js"],
  subscribers: ["dist/subscriber/**/*.js"],
});
