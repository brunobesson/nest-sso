import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { CreateUserDto } from './create.user.dto';
import { UserDto } from './user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@ApiBearerAuth()
@Controller('users')
@Roles('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  private toUserDto = (data: User): UserDto => {
    const { firstName, lastName, email, roles } = data;
    return { firstName, lastName, email, roles };
  };

  @ApiOperation({ description: 'Retrieve all users' })
  @Get()
  async findAll(): Promise<UserDto[]> {
    return (await this.usersService.findAll()).map((user) =>
      this.toUserDto(user),
    );
  }

  @Get(':id')
  async find(@Param('id') id: number): Promise<UserDto> {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.toUserDto(user);
  }

  @Post()
  async create(@Body() userDto: CreateUserDto): Promise<UserDto> {
    const { email } = userDto;
    const userInDb = await this.usersService.findByEmail(email);
    if (userInDb) {
      throw new BadRequestException('User already exists');
    }
    const user = await this.usersService.create(userDto);
    return this.toUserDto(user);
  }
}
