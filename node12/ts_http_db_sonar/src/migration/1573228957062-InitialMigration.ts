import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1573228957062 implements MigrationInterface {
  name = 'InitialMigration1573228957062';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "photo_info" ("id" SERIAL NOT NULL, "height" integer NOT NULL, "width" integer NOT NULL, "comment" character varying NOT NULL, "photoId" integer, CONSTRAINT "REL_7f001e7c3eb22b6a817f1e8d57" UNIQUE ("photoId"), CONSTRAINT "PK_1d5309e1d62c366b716d368c3ce" PRIMARY KEY ("id"))`,
      undefined
    );
    await queryRunner.query(
      `CREATE TABLE "author" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_5a0e79799d372fe56f2f3fa6871" PRIMARY KEY ("id"))`,
      undefined
    );
    await queryRunner.query(
      `CREATE TABLE "photo" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "isPublished" boolean NOT NULL, "authorId" integer, CONSTRAINT "PK_723fa50bf70dcfd06fb5a44d4ff" PRIMARY KEY ("id"))`,
      undefined
    );
    await queryRunner.query(
      `CREATE TABLE "album" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_58e0b4b8a31bb897e6959fe3206" PRIMARY KEY ("id"))`,
      undefined
    );
    await queryRunner.query(
      `CREATE TABLE "album_photos_photo" ("albumId" integer NOT NULL, "photoId" integer NOT NULL, CONSTRAINT "PK_d6508e57e194669e6b77bee307d" PRIMARY KEY ("albumId", "photoId"))`,
      undefined
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fb5deea2817dea41af76b11fd1" ON "album_photos_photo" ("albumId") `,
      undefined
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d292b18c5fbb585c8ddb959ea8" ON "album_photos_photo" ("photoId") `,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "photo_info" ADD CONSTRAINT "FK_7f001e7c3eb22b6a817f1e8d57c" FOREIGN KEY ("photoId") REFERENCES "photo"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "photo" ADD CONSTRAINT "FK_c073d197b41cfbeb09835ca233c" FOREIGN KEY ("authorId") REFERENCES "author"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "album_photos_photo" ADD CONSTRAINT "FK_fb5deea2817dea41af76b11fd15" FOREIGN KEY ("albumId") REFERENCES "album"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "album_photos_photo" ADD CONSTRAINT "FK_d292b18c5fbb585c8ddb959ea81" FOREIGN KEY ("photoId") REFERENCES "photo"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "album_photos_photo" DROP CONSTRAINT "FK_d292b18c5fbb585c8ddb959ea81"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "album_photos_photo" DROP CONSTRAINT "FK_fb5deea2817dea41af76b11fd15"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "photo" DROP CONSTRAINT "FK_c073d197b41cfbeb09835ca233c"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "photo_info" DROP CONSTRAINT "FK_7f001e7c3eb22b6a817f1e8d57c"`,
      undefined
    );
    await queryRunner.query(
      `DROP INDEX "IDX_d292b18c5fbb585c8ddb959ea8"`,
      undefined
    );
    await queryRunner.query(
      `DROP INDEX "IDX_fb5deea2817dea41af76b11fd1"`,
      undefined
    );
    await queryRunner.query(`DROP TABLE "album_photos_photo"`, undefined);
    await queryRunner.query(`DROP TABLE "album"`, undefined);
    await queryRunner.query(`DROP TABLE "photo"`, undefined);
    await queryRunner.query(`DROP TABLE "author"`, undefined);
    await queryRunner.query(`DROP TABLE "photo_info"`, undefined);
  }
}
