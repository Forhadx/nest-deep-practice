import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration31750535669628 implements MigrationInterface {
  name = "Migration31750535669628";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Step 1: Add "role" column as nullable
    await queryRunner.query(
      `ALTER TABLE "session" ADD "role" character varying`,
    );

    // Step 2: Fill existing rows with a default role (adjust 'EMPLOYEE' as needed)
    await queryRunner.query(
      `UPDATE "session" SET "role" = 'EMPLOYEE' WHERE "role" IS NULL`,
    );

    // Step 3: Set "role" as NOT NULL
    await queryRunner.query(
      `ALTER TABLE "session" ALTER COLUMN "role" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "role"`);
  }
}
 