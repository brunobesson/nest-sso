import { Body, Controller, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOperation } from '@nestjs/swagger';
import { AuthLoginDto } from './auth-login.dto';
import { AuthService } from './auth.service';
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
  @Post()
  async login(
    @Body() authLoginDto: AuthLoginDto,
  ): Promise<{ access_token: string }> {
    return this.authService.login(authLoginDto);
  }
}
