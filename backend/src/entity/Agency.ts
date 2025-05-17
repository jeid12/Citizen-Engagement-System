import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Complaint } from "./Complaint";
import { User } from "./User";

@Entity()
export class Agency {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column("text")
    description!: string;

    @Column({ nullable: true })
    contactEmail?: string;

    @Column({ nullable: true })
    contactPhone?: string;

    @Column({ nullable: true })
    address?: string;

    @Column({ default: true })
    isActive!: boolean;

    @Column({ nullable: true })
    website?: string;

    @Column({ nullable: true })
    jurisdiction?: string;

    @Column({ type: "text", nullable: true })
    operatingHours?: string;

    @OneToMany(() => Complaint, complaint => complaint.agency)
    complaints!: Complaint[];

    @OneToMany(() => User, user => user.agency)
    staff!: User[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
} 