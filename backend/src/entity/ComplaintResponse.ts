import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { User } from "./User";
import { Complaint } from "./Complaint";

@Entity()
export class ComplaintResponse {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column("text")
    response!: string;

    @ManyToOne(() => Complaint, complaint => complaint.responses)
    complaint!: Complaint;

    @ManyToOne(() => User)
    respondedBy!: User;

    @CreateDateColumn()
    createdAt!: Date;
} 