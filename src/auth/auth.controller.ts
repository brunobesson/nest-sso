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
import { JwtRefreshTokenAuthGuard } from './jwt-refesh-token-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { Public } from './public.decorator';
import { RegisterUserDto } from './register.user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register new user' })
  @ApiBadRequestResponse({
    description: 'Invalid parameters',
  })
  @Public()
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto): Promise<void> {
    await this.authService.register({ ...registerUserDto, roles: ['user'] });
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
  @Post('logout')
  async logout(@Request() request: Req) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await this.authService.logout(request.user!);
  }
}
