import { MigrationInterface, QueryRunner } from "typeorm";

export class Banners1773419522388 implements MigrationInterface {
    name = 'Banners1773419522388'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Banners" ("id" SERIAL NOT NULL, "imageLink" character varying(500) NOT NULL, CONSTRAINT "PK_d0677533a49f9ca579de7a90929" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "Banners"`);
    }

}
