import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { JwtRefreshTokenPayload } from './auth.service';
import { AuthUser } from './jwt.strategy';

type Payload = JwtRefreshTokenPayload & {
  exp: number;
  iat: number;
};

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private usersService: UsersService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('token'),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('auth.jwtRefreshTokenSecret'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, { uid, tid }: Payload): Promise<AuthUser> {
    if (
      !this.usersService.isRefreshTokenRegistered(
        uid,
        tid,
        request.body?.token as string,
      )
    ) {
      // the refresh token isn't registered anymore: either it was stolen and the impersonator is trying to use it after
      // its renewal by the user, or the opposite: the impersonator stole the token, the user is now unawailable to
      // refresh its token. In both cases, there is a security breach: disable all refresh tokens.
      // https://auth0.com/docs/secure/tokens/refresh-tokens/refresh-token-rotation
      this.usersService.deleteAllRefreshTokens(uid); // async call
      throw new UnauthorizedException();
    }
    const user = await this.usersService.findById(uid);
    if (!user) {
      throw new UnauthorizedException();
    }
    return {
      userId: uid,
      email: user.email,
      emailVerified: user.emailVerified,
      roles: user.roles,
      tokenId: tid,
    };
  }
}
