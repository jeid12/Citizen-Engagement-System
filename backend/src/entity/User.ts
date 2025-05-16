import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Complaint } from "./Complaint";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @Column({ nullable: true })
    phoneNumber?: string;

    @Column({
        type: "enum",
        enum: ["citizen", "admin", "agency_staff"],
        default: "citizen"
    })
    role!: "citizen" | "admin" | "agency_staff";

    @Column({ default: false })
    isEmailVerified!: boolean;

    @Column({ type: "varchar", nullable: true })
    verificationToken: string | null = null;

    @Column({ type: "timestamp", nullable: true })
    verificationTokenExpiry: Date | null = null;

    @OneToMany(() => Complaint, complaint => complaint.user)
    complaints!: Complaint[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
} 