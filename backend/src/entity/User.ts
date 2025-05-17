import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from "typeorm";
import { Complaint } from "./Complaint";
import { ComplaintResponse } from "./ComplaintResponse";
import { Agency } from "./Agency";

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

    @Column({ nullable: true })
    verificationToken?: string;

    @Column({ type: "timestamp", nullable: true })
    verificationTokenExpiry?: Date;

    @Column({ nullable: true })
    resetPasswordToken?: string;

    @Column({ type: "timestamp", nullable: true })
    resetPasswordExpiry?: Date;

    @Column({ nullable: true })
    profilePhoto?: string;

    @Column({ type: "text", nullable: true })
    bio?: string;

    @Column({ nullable: true })
    address?: string;

    @Column({ nullable: true })
    city?: string;

    @Column({ nullable: true })
    country?: string;

    @OneToMany(() => Complaint, complaint => complaint.user)
    complaints!: Complaint[];

    @OneToMany(() => ComplaintResponse, response => response.respondedBy)
    responses!: ComplaintResponse[];

    @ManyToOne(() => Agency, agency => agency.staff, { nullable: true })
    agency?: Agency;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
} 