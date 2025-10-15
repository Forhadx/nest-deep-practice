import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration11750532152944 implements MigrationInterface {
  name = "Migration11750532152944";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "session" DROP CONSTRAINT IF EXISTS "FK_3d2f174ef04fb312fdebd0ddc53"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_3d2f174ef04fb312fdebd0ddc5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" DROP COLUMN IF EXISTS "userId"`,
    );

    // Step 1: Add userId as nullable first
    await queryRunner.query(
      `ALTER TABLE "session" ADD "userId" character varying`,
    );

    // Step 2: Optional – Fill old rows with placeholder or valid ID (this depends on your case)
    await queryRunner.query(
      `UPDATE "session" SET "userId" = 'TEMP-ID' WHERE "userId" IS NULL`,
    );

    // Step 3: Now make column NOT NULL
    await queryRunner.query(
      `ALTER TABLE "session" ALTER COLUMN "userId" SET NOT NULL`,
    );

    // Step 4: Recreate index
    await queryRunner.query(
      `CREATE INDEX "IDX_3d2f174ef04fb312fdebd0ddc5" ON "session" ("userId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_3d2f174ef04fb312fdebd0ddc5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" DROP COLUMN IF EXISTS "userId"`,
    );
    await queryRunner.query(`ALTER TABLE "session" ADD "userId" uuid`);
    await queryRunner.query(
      `CREATE INDEX "IDX_3d2f174ef04fb312fdebd0ddc5" ON "session" ("userId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "admin"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
