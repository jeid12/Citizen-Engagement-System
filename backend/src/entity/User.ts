import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Complaint } from "./Complaint";
import { ComplaintResponse } from "./ComplaintResponse";

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

    @Column({ default: false })
    isEmailVerified!: boolean;

    @Column({ nullable: true })
    otp?: string;

    @Column({ type: "timestamp", nullable: true })
    otpExpiry?: Date;

    @Column({ 
        type: "enum",
        enum: ["citizen", "admin", "agency_staff"],
        default: "citizen"
    })
    role!: "citizen" | "admin" | "agency_staff";

    @Column({ type: "varchar", nullable: true })
    verificationToken: string | null = null;

    @Column({ type: "timestamp", nullable: true })
    verificationTokenExpiry: Date | null = null;

    @OneToMany(() => Complaint, complaint => complaint.user)
    complaints!: Complaint[];

    @OneToMany(() => ComplaintResponse, response => response.respondedBy)
    responses!: ComplaintResponse[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
} 