import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { JwtPaylaod as JwtPayload } from './auth.service';

export type Payload = JwtPayload & {
  exp: number;
  iat: number;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('auth.jwtSecret'),
    });
  }

  async validate({
    email,
  }: Payload): Promise<Omit<
    User,
    'password' | 'hashPassword' | 'validatePassword'
  > | null> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }
    const { password, hashPassword, validatePassword, ...userWoPwd } = user;
    return userWoPwd;
  }
}
