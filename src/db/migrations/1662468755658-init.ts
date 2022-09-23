import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class Init1662468755658 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          new TableColumn({ name: 'id', type: 'serial', isPrimary: true }),
          new TableColumn({ name: 'firstName', type: 'varchar' }),
          new TableColumn({ name: 'lastName', type: 'varchar' }),
          new TableColumn({
            name: 'email',
            type: 'varchar',
            isUnique: true,
            isNullable: false,
          }),
          new TableColumn({
            name: 'password',
            type: 'varchar',
            isNullable: false,
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user');
  }
}
