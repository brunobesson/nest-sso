import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { DateTime } from 'luxon';
import { DatabaseError } from 'pg-protocol';
import { CreateUserDto } from 'src/users/create.user.dto';
import { User } from 'src/users/user.entity';
import { QueryFailedError } from 'typeorm';
import { UsersService } from '../users/users.service';
import { AuthLoginDto } from './auth-login.dto';
import { AuthRefreshDto } from './auth-refresh.dto';
import { AuthUser } from './jwt.strategy';

export type JwtAccessTokenPayload = {
  uid: number;
  scp: string[];
  tid: string;
};

export type JwtRefreshTokenPayload = {
  uid: number;
  tid: string;
};

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(creatUserDo: CreateUserDto): Promise<void> {
    try {
      await this.usersService.create(creatUserDo);
    } catch (error: unknown) {
      if (error instanceof QueryFailedError) {
        const err = error.driverError as DatabaseError;
        if (err.code === '23505') {
          throw new ConflictException('Username already exists');
        }
      }
      throw error;
    }
  }

  async login({
    email,
    password,
  }: AuthLoginDto): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.createTokens(user);
  }

  private createTokens(user: User): {
    access_token: string;
    refresh_token: string;
  } {
    const tokenId = randomUUID();
    const accessToken = this.generateAccessToken(
      { uid: user.id, scp: user.roles, tid: tokenId },
      user.email,
    );
    const refreshToken = this.generateRefreshToken({
      uid: user.id,
      tid: tokenId,
    });
    const expiresAt = DateTime.now()
      .plus({
        day: this.configService.get<number>(
          'auth.jwtRefreshTokenExpireTimeInDays',
        ),
      })
      .toJSDate();
    this.usersService.setRefreshToken(user, refreshToken, tokenId, expiresAt); // async call
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refresh({ token: refreshToken }: AuthRefreshDto): Promise<{
    access_token: string;
    refresh_token: string;
  } | null> {
    // invalidate previous refresh token, leaving grace period
    const decoded = this.jwtService.decode(refreshToken);
    if (!decoded || typeof decoded === 'string') {
      return null;
    }
    const refreshTokenId = decoded.tid as string;
    const user = await this.usersService.deleteRefreshToken(refreshTokenId);
    if (!user) {
      return null;
    }
    // create new tokens
    return this.createTokens(user);
  }

  private generateAccessToken(payload: JwtAccessTokenPayload, subject: string) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('auth.jwtAccessTokenSecret'),
      subject,
      expiresIn:
        this.configService.get<number>('auth.jwtAccessTokenExpireTimeInHours') +
        'h',
    });
  }

  private generateRefreshToken(payload: JwtRefreshTokenPayload) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('auth.jwtRefreshTokenSecret'),
      expiresIn:
        this.configService.get<number>('auth.jwtRefreshTokenExpireTimeInDays') +
        'd',
    });
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !(await user?.validatePassword(password))) {
      return null;
    }
    return user;
  }

  async logout(user: AuthUser): Promise<void> {
    this.usersService.deleteRefreshToken(user.tokenId);
  }
}
