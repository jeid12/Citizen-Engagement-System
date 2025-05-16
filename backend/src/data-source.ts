import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Complaint } from "./entity/Complaint";
import { Category } from "./entity/Category";
import { Agency } from "./entity/Agency";

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    },
    synchronize: process.env.NODE_ENV !== "production",
    logging: process.env.NODE_ENV !== "production",
    entities: [User, Complaint, Category, Agency],
    migrations: ["src/migration/**/*.ts"],
    subscribers: ["src/subscriber/**/*.ts"],
}); 