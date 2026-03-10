import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedStatus1773166436921 implements MigrationInterface {
    name = 'AddedStatus1773166436921'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ServiceStatus" ("id" SERIAL NOT NULL, "isActive" boolean NOT NULL, "approxReadyTime" TIME NOT NULL, "approxDeliveryTime" TIME NOT NULL, CONSTRAINT "PK_e46bbed006f9dc23763007ceb8f" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "ServiceStatus"`);
    }

}
