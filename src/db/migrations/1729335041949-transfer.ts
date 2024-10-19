import { MigrationInterface, QueryRunner } from "typeorm";

export class Transfer1729335041949 implements MigrationInterface {
    name = 'Transfer1729335041949'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "walletBalance" TO "balance"`);
        await queryRunner.query(`CREATE TABLE "transfer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "amount" numeric(12,2) NOT NULL, "senderId" uuid, "receiverId" uuid, CONSTRAINT "PK_fd9ddbdd49a17afcbe014401295" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "balance"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "balance" numeric(12,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "transfer" ADD CONSTRAINT "FK_780bd0b359a2b4576b2e3268600" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transfer" ADD CONSTRAINT "FK_6bad5b656535794d899c2a50323" FOREIGN KEY ("receiverId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transfer" DROP CONSTRAINT "FK_6bad5b656535794d899c2a50323"`);
        await queryRunner.query(`ALTER TABLE "transfer" DROP CONSTRAINT "FK_780bd0b359a2b4576b2e3268600"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "balance"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "balance" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`DROP TABLE "transfer"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "balance" TO "walletBalance"`);
    }

}
