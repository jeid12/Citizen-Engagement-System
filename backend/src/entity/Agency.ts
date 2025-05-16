import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { Complaint } from "./Complaint";
import { User } from "./User";

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

    @ManyToMany(() => User)
    @JoinTable({
        name: "agency_staff",
        joinColumn: {
            name: "agency_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "user_id",
            referencedColumnName: "id"
        }
    })
    staff!: User[];
} 