import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsIn,
  IsNotEmpty,
} from 'class-validator';
import { ALL_ROLES, Role } from './user.entity';

export class UserDto {
  @ApiProperty({ description: 'User name', example: 'John' })
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsIn(ALL_ROLES, { each: true })
  roles: Role[];
}
