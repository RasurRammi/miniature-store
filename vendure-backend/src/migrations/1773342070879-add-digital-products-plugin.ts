import {MigrationInterface, QueryRunner} from "typeorm";

export class AddDigitalProductsPlugin1773342070879 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "fulfillment" ADD "customFieldsDownloadurls" text`, undefined);
        await queryRunner.query(`ALTER TABLE "shipping_method" ADD "customFieldsIsdigital" boolean DEFAULT true`, undefined);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD "customFieldsIsdigital" boolean DEFAULT true`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN "customFieldsIsdigital"`, undefined);
        await queryRunner.query(`ALTER TABLE "shipping_method" DROP COLUMN "customFieldsIsdigital"`, undefined);
        await queryRunner.query(`ALTER TABLE "fulfillment" DROP COLUMN "customFieldsDownloadurls"`, undefined);
   }

}
