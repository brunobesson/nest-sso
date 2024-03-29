import {
  Body,
  Controller,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { Request as Req } from 'express';
import { AuthLoginDto } from './auth-login.dto';
import { AuthRefreshDto } from './auth-refresh.dto';
import { AuthService } from './auth.service';
import { EmailConfirmationService } from './email-confirmation.service';
import { JwtRefreshTokenAuthGuard } from './jwt-refesh-token-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { Public } from './public.decorator';
import { RegisterUserDto } from './register.user.dto';
import { ConfirmEmailDto } from './confirm-email.dto';
import { NoVerifiedEmail } from './no-verified-email.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @ApiOperation({ summary: 'Register new user' })
  @ApiBadRequestResponse({
    description: 'Invalid parameters',
  })
  @Public()
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto): Promise<void> {
    await this.authService.register({ ...registerUserDto, roles: ['user'] });
    await this.emailConfirmationService.sendVerificationLink(
      registerUserDto.email,
    );
  }

  @Public()
  @Post('confirm-email')
  async confirm(
    @Body() { token }: ConfirmEmailDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const email = await this.emailConfirmationService.decodeConfirmationToken(
      token,
    );
    const user = await this.emailConfirmationService.confirmEmail(email);
    return this.authService.createTokens(user);
  }

  @ApiBearerAuth()
  @NoVerifiedEmail()
  @Post('resend-confirm-email')
  async resendConfirmationLink(@Request() request: Req): Promise<void> {
    await this.emailConfirmationService.resendConfirmationLink(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      request.user!.email,
    );
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post()
  async login(
    @Body() authLoginDto: AuthLoginDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    return this.authService.login(authLoginDto);
  }

  @Public()
  @UseGuards(JwtRefreshTokenAuthGuard)
  @Post('refresh')
  async refresh(
    @Body() authRefreshDto: AuthRefreshDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const tokens = await this.authService.refresh(authRefreshDto);
    if (!tokens) {
      throw new UnauthorizedException();
    }
    return tokens;
  }

  @ApiBearerAuth()
  @NoVerifiedEmail()
  @Post('logout')
  async logout(@Request() request: Req) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await this.authService.logout(request.user!);
  }
}
