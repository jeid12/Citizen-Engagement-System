import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";
import { Category } from "./Category";
import { Agency } from "./Agency";
import { ComplaintResponse } from "./ComplaintResponse";

@Entity()
export class Complaint {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    title!: string;

    @Column("text")
    description!: string;

    @Column({
        type: "enum",
        enum: ["pending", "in_progress", "resolved", "rejected"],
        default: "pending"
    })
    status!: "pending" | "in_progress" | "resolved" | "rejected";

    @Column({ nullable: true })
    location?: string;

    @Column("simple-array", { nullable: true })
    attachments?: string[];

    @ManyToOne(() => User, user => user.complaints)
    user!: User;

    @ManyToOne(() => Category, category => category.complaints)
    category!: Category;

    @ManyToOne(() => Agency, agency => agency.complaints)
    agency!: Agency;

    @OneToMany(() => ComplaintResponse, response => response.complaint)
    responses!: ComplaintResponse[];

    @Column({ type: "text", nullable: true })
    adminNotes?: string;

    @Column({ nullable: true })
    priority?: "low" | "medium" | "high";

    @Column({ nullable: true })
    assignedTo?: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
} 