import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload as JwtPayload } from './auth.service';

export type Payload = JwtPayload & {
  exp: number;
  iat: number;
  sub: string;
};

export type AuthUser = {
  email: string;
  userId: number;
  roles: string[];
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('auth.jwtSecret'),
    });
  }

  async validate({ uid, scp, sub }: Payload): Promise<AuthUser | null> {
    return { userId: uid, email: sub, roles: scp };
  }
}
