import { MigrationInterface, QueryRunner } from "typeorm";

export class UserEntity1729272109228 implements MigrationInterface {
    name = 'UserEntity1729272109228'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "walletBalance" integer NOT NULL DEFAULT '0', "username" character varying(14) NOT NULL, "password" character varying(255) NOT NULL, "firstName" character varying(30) NOT NULL, "lastName" character varying(30) NOT NULL, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
