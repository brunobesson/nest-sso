import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseError } from 'pg-protocol';
import { CreateUserDto } from 'src/users/create.user.dto';
import { User } from 'src/users/user.entity';
import { QueryFailedError } from 'typeorm';
import { UsersService } from '../users/users.service';
import { AuthLoginDto } from './auth-login.dto';

export type JwtPayload = {
  uid: number;
  scp: string[];
};

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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
  }: AuthLoginDto): Promise<{ access_token: string }> {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    const payload: JwtPayload = { uid: user.id, scp: user.roles };
    return {
      access_token: this.jwtService.sign(payload, { subject: user.email }),
    };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !(await user?.validatePassword(password))) {
      return null;
    }
    return user;
  }
}
