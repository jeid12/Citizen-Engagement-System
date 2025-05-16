import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Complaint } from "./entity/Complaint";
import { Category } from "./entity/Category";
import { Agency } from "./entity/Agency";
import { ComplaintResponse } from "./entity/ComplaintResponse";         

export const AppDataSource = new DataSource({
    type: "postgres",
    url: 'postgresql://asm_8k0j_user:NcJkdjdVdfRRJif31Z3rW8JcFKxWgufk@dpg-d0ipqk6uk2gs73alo2ug-a.oregon-postgres.render.com/asm_8k0j',
    ssl: {
        rejectUnauthorized: false
    },
    synchronize: process.env.NODE_ENV !== "production",
    logging: process.env.NODE_ENV !== "production",
    entities: [User, Complaint, Category, Agency, ComplaintResponse],
    migrations: ["src/migration/**/*.ts"],
    subscribers: ["src/subscriber/**/*.ts"],
}); 