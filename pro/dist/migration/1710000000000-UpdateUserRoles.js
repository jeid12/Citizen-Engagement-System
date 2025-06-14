"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserRoles1710000000000 = void 0;
class UpdateUserRoles1710000000000 {
    constructor() {
        this.name = 'UpdateUserRoles1710000000000';
    }
    async up(queryRunner) {
        // First create the new enum type
        await queryRunner.query(`
            CREATE TYPE "public"."user_role_enum_new" AS ENUM ('user', 'admin', 'agency_staff');
        `);
        // Drop the default constraint
        await queryRunner.query(`
            ALTER TABLE "user" ALTER COLUMN role DROP DEFAULT;
        `);
        // Update the column to use the new enum type, converting 'citizen' to 'user'
        await queryRunner.query(`
            ALTER TABLE "user" 
            ALTER COLUMN role TYPE "public"."user_role_enum_new" 
            USING (CASE WHEN role = 'citizen' THEN 'user'::text ELSE role::text END)::"public"."user_role_enum_new";
        `);
        // Add the new default value
        await queryRunner.query(`
            ALTER TABLE "user" ALTER COLUMN role SET DEFAULT 'user';
        `);
        // Drop the old enum type
        await queryRunner.query(`
            DROP TYPE "public"."user_role_enum";
        `);
        // Rename the new enum type to the original name
        await queryRunner.query(`
            ALTER TYPE "public"."user_role_enum_new" RENAME TO "user_role_enum";
        `);
    }
    async down(queryRunner) {
        // Create the old enum type
        await queryRunner.query(`
            CREATE TYPE "public"."user_role_enum_old" AS ENUM ('citizen', 'admin', 'agency_staff');
        `);
        // Drop the default constraint
        await queryRunner.query(`
            ALTER TABLE "user" ALTER COLUMN role DROP DEFAULT;
        `);
        // Update the column to use the old enum type, converting 'user' back to 'citizen'
        await queryRunner.query(`
            ALTER TABLE "user" 
            ALTER COLUMN role TYPE "public"."user_role_enum_old" 
            USING (CASE WHEN role = 'user' THEN 'citizen'::text ELSE role::text END)::"public"."user_role_enum_old";
        `);
        // Add back the old default value
        await queryRunner.query(`
            ALTER TABLE "user" ALTER COLUMN role SET DEFAULT 'citizen';
        `);
        // Drop the current enum type
        await queryRunner.query(`
            DROP TYPE "public"."user_role_enum";
        `);
        // Rename the old enum type to the original name
        await queryRunner.query(`
            ALTER TYPE "public"."user_role_enum_old" RENAME TO "user_role_enum";
        `);
    }
}
exports.UpdateUserRoles1710000000000 = UpdateUserRoles1710000000000;
//# sourceMappingURL=1710000000000-UpdateUserRoles.js.map