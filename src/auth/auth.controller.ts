import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/users/create.user.dto';
import { AuthLoginDto } from './auth-login.dto';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(
    @Body() createUserDto: Omit<CreateUserDto, 'roles'>,
  ): Promise<void> {
    await this.authService.register({ ...createUserDto, roles: ['user'] });
  }

  @Public()
  @Post()
  async login(
    @Body() authLoginDto: AuthLoginDto,
  ): Promise<{ access_token: string }> {
    return this.authService.login(authLoginDto);
  }
}
