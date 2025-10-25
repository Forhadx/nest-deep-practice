import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration21761393812210 implements MigrationInterface {
  name = "Migration21761393812210";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "employee" ADD "phone" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ADD CONSTRAINT "UQ_81afb288b526f7e8fed0e4200cc" UNIQUE ("phone")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "employee" DROP CONSTRAINT "UQ_81afb288b526f7e8fed0e4200cc"`,
    );
    await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "phone"`);
  }
}
