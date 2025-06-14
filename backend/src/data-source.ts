import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Complaint } from "./entity/Complaint";
import { Category } from "./entity/Category";
import { Agency } from "./entity/Agency";
import { ComplaintResponse } from "./entity/ComplaintResponse";
import { Review } from "./entity/Review";
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    url: "postgres://postgres:Niyokwizera1$@34.60.94.48:5432/db",
    ssl: {
        rejectUnauthorized: false
    },
    synchronize: process.env.NODE_ENV !== "production",
    logging: process.env.NODE_ENV !== "production",
    entities: [User, Complaint, Category, Agency, ComplaintResponse, Review],
    migrations: ["src/migration/**/*.ts"],
    subscribers: ["src/subscriber/**/*.ts"],
}); 