import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Complaint } from "./Complaint";

@Entity()
export class Agency {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column({ type: "text", nullable: true })
    description?: string;

    @Column({ nullable: true })
    contactEmail?: string;

    @Column({ nullable: true })
    contactPhone?: string;

    @Column({ default: true })
    isActive!: boolean;

    @OneToMany(() => Complaint, complaint => complaint.agency)
    complaints!: Complaint[];
} 