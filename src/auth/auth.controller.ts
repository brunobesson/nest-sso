import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiOperation } from '@nestjs/swagger';
import { Request as Req } from 'express';
import { AuthLoginDto } from './auth-login.dto';
import { AuthService } from './auth.service';
import { AuthUser } from './jwt.strategy';
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
  ): Promise<{ access_token: string }> {
    return this.authService.login(authLoginDto);
  }
}
