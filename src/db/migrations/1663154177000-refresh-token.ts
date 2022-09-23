import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class RefreshToken16631541770000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'refresh-token',
        columns: [
          new TableColumn({ name: 'userId', type: 'int' }),
          new TableColumn({ name: 'jwtid', type: 'varchar' }),
          new TableColumn({ name: 'token', type: 'varchar' }),
          new TableColumn({
            name: 'expiresAt',
            type: 'timestamptz',
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('refresh-token');
  }
}
