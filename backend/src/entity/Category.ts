import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Complaint } from "./Complaint";

@Entity()
export class Category {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column({ type: "text", nullable: true })
    description?: string;

    @Column({ default: true })
    isActive!: boolean;

    @OneToMany(() => Complaint, complaint => complaint.category)
    complaints!: Complaint[];
} 