"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMigrationsTable1710000000000 = void 0;
class CreateMigrationsTable1710000000000 {
    constructor() {
        this.name = 'CreateMigrationsTable1710000000000';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            DROP TABLE IF EXISTS "migrations";
            CREATE TABLE "migrations" (
                "id" SERIAL PRIMARY KEY,
                "name" character varying NOT NULL
            );
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "migrations"`);
    }
}
exports.CreateMigrationsTable1710000000000 = CreateMigrationsTable1710000000000;
//# sourceMappingURL=1710000000000-CreateMigrationsTable.js.map