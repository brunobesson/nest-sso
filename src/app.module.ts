import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from './config/typeorm.config';
import { AppController } from './app.controller';
import config, { validationSchema } from './config/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      expandVariables: true,
      validationSchema,
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
