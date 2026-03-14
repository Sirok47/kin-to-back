import { MigrationInterface, QueryRunner } from "typeorm";

export class Profiles1773510868494 implements MigrationInterface {
    name = 'Profiles1773510868494'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Profiles" DROP COLUMN "phoneNumber"`);
        await queryRunner.query(`ALTER TABLE "Profiles" ADD "name" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "Profiles" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "Profiles" ADD "email" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "Profiles" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "Profiles" ADD "address" character varying(200)`);
        await queryRunner.query(`ALTER TABLE "Users" ALTER COLUMN "phoneNumber" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" ALTER COLUMN "phoneNumber" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Profiles" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "Profiles" ADD "address" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Profiles" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "Profiles" ADD "email" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Profiles" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "Profiles" ADD "phoneNumber" character varying NOT NULL`);
    }

}
