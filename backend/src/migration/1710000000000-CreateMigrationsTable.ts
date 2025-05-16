import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMigrationsTable1710000000000 implements MigrationInterface {
    name = 'CreateMigrationsTable1710000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE IF EXISTS "migrations";
            CREATE TABLE "migrations" (
                "id" SERIAL PRIMARY KEY,
                "name" character varying NOT NULL
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "migrations"`);
    }
} 