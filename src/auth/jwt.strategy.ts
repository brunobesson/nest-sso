import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtAccessTokenPayload as JwtAccessTokenPayload } from './auth.service';

export type Payload = JwtAccessTokenPayload & {
  exp: number;
  iat: number;
  sub: string;
};

export type AuthUser = {
  email: string;
  emailVerified: boolean;
  userId: number;
  tokenId: string;
  roles: string[];
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('auth.jwtAccessTokenSecret'),
    });
  }

  async validate({
    uid,
    scp,
    sub,
    tid,
    email_verified,
  }: Payload): Promise<AuthUser> {
    return {
      userId: uid,
      email: sub,
      emailVerified: email_verified,
      roles: scp,
      tokenId: tid,
    };
  }
}
