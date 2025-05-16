import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { User } from "./User";
import { Category } from "./Category";
import { Agency } from "./Agency";

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
    location!: string;

    @Column("simple-array", { nullable: true })
    attachments!: string[];

    @ManyToOne(() => User, (user: User) => user.complaints)
    user!: User;

    @ManyToOne(() => Category, (category: Category) => category.complaints)
    category!: Category;

    @ManyToOne(() => Agency, (agency: Agency) => agency.complaints)
    agency!: Agency;

    @Column({ type: "text", nullable: true })
    response!: string;

    @Column({ nullable: true })
    respondedBy!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
} 