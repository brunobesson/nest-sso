import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class Roles1662977740000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'roles',
        type: 'text',
        default: 'user',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user', 'roles');
  }
}
