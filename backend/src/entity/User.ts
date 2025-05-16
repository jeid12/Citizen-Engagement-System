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

    @Column({ default: "citizen" })
    role!: "citizen" | "admin" | "agency_staff";

    @Column({ nullable: true })
    phoneNumber!: string;

    @Column({ nullable: true })
    address!: string;

    @Column({ default: "en" })
    preferredLanguage!: "en" | "rw";

    @Column({ default: false })
    isEmailVerified!: boolean;

    @Column({ nullable: true })
    verificationToken!: string | null;

    @Column({ nullable: true })
    verificationTokenExpiry!: Date | null;

    @Column({ nullable: true })
    passwordResetToken!: string | null;

    @Column({ nullable: true })
    passwordResetExpiry!: Date | null;

    @OneToMany(() => Complaint, (complaint: Complaint) => complaint.user)
    complaints!: Complaint[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
} 