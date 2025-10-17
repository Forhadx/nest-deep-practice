import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationOne1760629913789 implements MigrationInterface {
  name = "MigrationOne1760629913789";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "path" character varying NOT NULL, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."employee_role_enum" AS ENUM('admin', 'employee', 'user')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."employee_status_enum" AS ENUM('active', 'inactive')`,
    );
    await queryRunner.query(
      `CREATE TABLE "employee" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "email" character varying, "password" character varying, "firstName" character varying, "lastName" character varying, "role" "public"."employee_role_enum" NOT NULL DEFAULT 'employee', "status" "public"."employee_status_enum" NOT NULL DEFAULT 'active', "photoId" uuid, CONSTRAINT "UQ_817d1d427138772d47eca048855" UNIQUE ("email"), CONSTRAINT "REL_2a77e78d6b243797b57e990051" UNIQUE ("photoId"), CONSTRAINT "PK_3c2bc72f03fd5abbbc5ac169498" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b304fdea1e7004a4bbf106f97d" ON "employee" ("firstName") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c7f3c521e99f5668d2af7e77ea" ON "employee" ("lastName") `,
    );
    await queryRunner.query(
      `CREATE TABLE "session" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" character varying NOT NULL, "role" character varying NOT NULL, "hash" character varying NOT NULL, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3d2f174ef04fb312fdebd0ddc5" ON "session" ("userId") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."admin_role_enum" AS ENUM('admin', 'employee', 'user')`,
    );
    await queryRunner.query(
      `CREATE TABLE "admin" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "email" character varying, "password" character varying, "firstName" character varying, "lastName" character varying, "role" "public"."admin_role_enum" NOT NULL DEFAULT 'admin', "photoId" uuid, CONSTRAINT "UQ_de87485f6489f5d0995f5841952" UNIQUE ("email"), CONSTRAINT "REL_ed9719aa13091b2c552ec5d69a" UNIQUE ("photoId"), CONSTRAINT "PK_e032310bcef831fb83101899b10" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_84f7ad37308539d360c13dc4c3" ON "admin" ("firstName") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cb75c19f2ffb1a7dd2ec8537f6" ON "admin" ("lastName") `,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ADD CONSTRAINT "FK_2a77e78d6b243797b57e9900517" FOREIGN KEY ("photoId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin" ADD CONSTRAINT "FK_ed9719aa13091b2c552ec5d69ab" FOREIGN KEY ("photoId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admin" DROP CONSTRAINT "FK_ed9719aa13091b2c552ec5d69ab"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" DROP CONSTRAINT "FK_2a77e78d6b243797b57e9900517"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cb75c19f2ffb1a7dd2ec8537f6"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_84f7ad37308539d360c13dc4c3"`,
    );
    await queryRunner.query(`DROP TABLE "admin"`);
    await queryRunner.query(`DROP TYPE "public"."admin_role_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3d2f174ef04fb312fdebd0ddc5"`,
    );
    await queryRunner.query(`DROP TABLE "session"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c7f3c521e99f5668d2af7e77ea"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b304fdea1e7004a4bbf106f97d"`,
    );
    await queryRunner.query(`DROP TABLE "employee"`);
    await queryRunner.query(`DROP TYPE "public"."employee_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."employee_role_enum"`);
    await queryRunner.query(`DROP TABLE "file"`);
  }
}
