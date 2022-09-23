import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import EmailService from '../email/email.service';
import VerificationTokenPayload from './verification-token-payload';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';

@Injectable()
export class EmailConfirmationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,
  ) {}

  public sendVerificationLink(email: string) {
    const payload: VerificationTokenPayload = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('auth.jwtVerificationTokenSecret'),
      expiresIn: `${this.configService.get<number>(
        'auth.jwtVerificationTokenExpireTimeInHours',
      )}h`,
    });

    const url = `http://localhost:${this.configService.get<number>(
      'port',
    )}/auth/confirm-email?token=${token}`;

    const text = `Welcome to the application. To confirm the email address, click here: ${url}`;

    return this.emailService.sendMail({
      to: email,
      subject: 'Email confirmation',
      text,
    });
  }

  public async decodeConfirmationToken(token: string): Promise<string> {
    try {
      const payload: unknown = await this.jwtService.verify(token, {
        secret: this.configService.get<string>(
          'auth.jwtVerificationTokenSecret',
        ),
      });

      if (!!payload && typeof payload === 'object' && 'email' in payload) {
        return (payload as { email: string }).email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  public async confirmEmail(email: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new InternalServerErrorException('User not found');
    }
    if (user.emailVerified) {
      throw new BadRequestException('Email already confirmed');
    }
    await this.usersService.markEmailAsConfirmed(email);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await this.usersService.findByEmail(email))!;
  }

  public async resendConfirmationLink(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (user?.emailVerified) {
      throw new BadRequestException('Email already confirmed');
    }
    await this.sendVerificationLink(email);
  }
}
