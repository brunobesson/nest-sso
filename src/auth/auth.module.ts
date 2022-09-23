import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import {
  jwtModuleAsyncConfig,
  passportModuleConfig,
} from '../config/auth.config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { LocalStrategy } from './local.strategy';
import { JwtRefreshTokenStrategy } from './jwt-refresh-token.strategy';
import { EmailConfirmationGuard } from './email-confirmation-auth.guard';
import { EmailConfirmationService } from './email-confirmation.service';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    UsersModule,
    EmailModule,
    PassportModule.register(passportModuleConfig),
    JwtModule.registerAsync(jwtModuleAsyncConfig),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    EmailConfirmationService,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    LocalStrategy,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: EmailConfirmationGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AuthModule {}
