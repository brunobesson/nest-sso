import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import { RefreshToken } from 'src/auth/refresh-token.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './create.user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private configService: ConfigService,
  ) {
    // clean up expired refresh tokens
    setInterval(() => {
      this.refreshTokenRepository
        .createQueryBuilder()
        .delete()
        .from(RefreshToken)
        .where('expiresAt < :now::timestamptz', {
          now: new Date().toISOString(),
        })
        .execute();
    }, 1000 * 60);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOneBy({ email });
  }

  async findById(id: number): Promise<User | null> {
    return await this.usersRepository.findOneBy({ id });
  }

  async create(userDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create({
      ...userDto,
      emailVerified: false,
    });
    return await this.usersRepository.save(user);
  }

  async markEmailAsConfirmed(email: string): Promise<void> {
    await this.usersRepository.update({ email }, { emailVerified: true });
  }

  async remove(email: string): Promise<void> {
    await this.usersRepository.delete({ email });
  }

  async setRefreshToken(
    user: User,
    token: string,
    jwtid: string,
    expiresAt: Date,
  ): Promise<void> {
    const hashed = await hash(token, 10);
    this.refreshTokenRepository.insert({
      userId: user.id,
      token: hashed,
      jwtid,
      expiresAt,
    });
  }

  async isRefreshTokenRegistered(
    userId: number,
    tokenId: string,
    token: string,
  ): Promise<boolean> {
    const refreshToken = await this.refreshTokenRepository.findOneBy({
      jwtid: tokenId,
      userId,
    });
    return !!refreshToken && (await compare(token, refreshToken.token));
  }

  async deleteRefreshToken(refreshTokenId: string): Promise<User | null> {
    const refreshToken = await this.refreshTokenRepository.findOneBy({
      jwtid: refreshTokenId,
    });
    if (!refreshToken) {
      return null;
    }
    // add leeway before expiring refesh token, to handle network concurrency issues
    setTimeout(async () => {
      try {
        await this.refreshTokenRepository.delete({ jwtid: refreshTokenId });
      } catch (error: unknown) {
        // TODO: log
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    }, 1000 * this.configService.get<number>('auh.jwtRefreshTokenReuseGracePeriodInSeconds')!);
    return await this.findById(refreshToken.userId);
  }

  async deleteAllRefreshTokens(userId: number): Promise<void> {
    try {
      await this.refreshTokenRepository.delete({ userId });
    } catch (error: unknown) {
      // TODO: log
    }
  }
}
