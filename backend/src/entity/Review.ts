import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Review {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column("text")
    comment!: string;

    @Column()
    rating!: number;

    @Column({ default: true })
    isVisible!: boolean;

    @CreateDateColumn()
    createdAt!: Date;
} 