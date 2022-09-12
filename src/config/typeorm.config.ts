import { ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { User } from '../users/user.entity';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  useFactory: (configService: ConfigService) => {
    return {
      type: 'postgres',
      host: configService.get<string>('database.host'),
      port: configService.get<number>('database.port'),
      username: configService.get<string>('database.username'),
      password: configService.get<string>('database.password'),
      database: configService.get<string>('database.name'),
      entities: [User],
      synchronize: false,
      migrations: [__dirname + '/../db/migrations/*.@(ts|js)'],
      migrationsTransactionMode: 'each',
      migrationsRun: true,
      logging: true,
    };
  },
  inject: [ConfigService],
};

export const typeOrmConfig: TypeOrmModuleOptions = {};
