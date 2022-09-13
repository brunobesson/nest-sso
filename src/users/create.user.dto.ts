import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsIn } from 'class-validator';
import { RegisterUserDto } from '../auth/register.user.dto';
import { ALL_ROLES, Role } from './user.entity';

export class CreateUserDto extends RegisterUserDto {
  @ApiProperty({ isArray: true, example: 'user' })
  @IsArray()
  @ArrayNotEmpty()
  @IsIn(ALL_ROLES, { each: true })
  roles: Role[];
}
