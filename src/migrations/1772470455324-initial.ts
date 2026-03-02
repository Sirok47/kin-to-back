import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1772470455324 implements MigrationInterface {
    name = 'Initial1772470455324'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Dishes" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "description" character varying(1000) NOT NULL, "price" integer NOT NULL, "imageLink" character varying(500) NOT NULL, "category" character varying(70) NOT NULL, "isActive" boolean NOT NULL, "isSpicy" boolean NOT NULL, CONSTRAINT "PK_5073d41d0bd38689078f492ae69" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Profiles" ("id" SERIAL NOT NULL, "phoneNumber" character varying NOT NULL, "email" character varying NOT NULL, "address" character varying NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "REL_2222d166a9adb00a5302beae94" UNIQUE ("userId"), CONSTRAINT "PK_1cafb33ec125c423acbde2be7a6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ConfirmationData" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "confirmationCode" character varying(100) NOT NULL, "confirmationCodeExpDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "isConfirmed" boolean NOT NULL DEFAULT false, "userId" uuid NOT NULL, CONSTRAINT "REL_3e13f300dcbd044b077fbae2b2" UNIQUE ("userId"), CONSTRAINT "PK_25d1c5a2300a767ca822fa278a0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "phoneNumber" character varying(30), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Sessions" ("ip" character varying(20) NOT NULL, "title" character varying(150) NOT NULL, "lastActiveDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "expDate" TIMESTAMP WITH TIME ZONE NOT NULL, "deviceId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_9107b59fc56d82e05451365e536" PRIMARY KEY ("deviceId"))`);
        await queryRunner.query(`CREATE TABLE "Admins" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "login" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_519fa28e9620ff7e67759daa754" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Profiles" ADD CONSTRAINT "FK_2222d166a9adb00a5302beae942" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ConfirmationData" ADD CONSTRAINT "FK_3e13f300dcbd044b077fbae2b2a" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Sessions" ADD CONSTRAINT "FK_582c3cb0fcddddf078b33e316d3" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Sessions" DROP CONSTRAINT "FK_582c3cb0fcddddf078b33e316d3"`);
        await queryRunner.query(`ALTER TABLE "ConfirmationData" DROP CONSTRAINT "FK_3e13f300dcbd044b077fbae2b2a"`);
        await queryRunner.query(`ALTER TABLE "Profiles" DROP CONSTRAINT "FK_2222d166a9adb00a5302beae942"`);
        await queryRunner.query(`DROP TABLE "Admins"`);
        await queryRunner.query(`DROP TABLE "Sessions"`);
        await queryRunner.query(`DROP TABLE "Users"`);
        await queryRunner.query(`DROP TABLE "ConfirmationData"`);
        await queryRunner.query(`DROP TABLE "Profiles"`);
        await queryRunner.query(`DROP TABLE "Dishes"`);
    }

}
