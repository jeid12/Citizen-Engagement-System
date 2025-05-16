import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Complaint } from "./Complaint";

@Entity()
export class Agency {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column({ nullable: true })
    description!: string;

    @Column()
    email!: string;

    @Column({ nullable: true })
    phoneNumber!: string;

    @Column({ nullable: true })
    address!: string;

    @Column({ default: true })
    isActive!: boolean;

    @OneToMany(() => Complaint, (complaint: Complaint) => complaint.agency)
    complaints!: Complaint[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
} 