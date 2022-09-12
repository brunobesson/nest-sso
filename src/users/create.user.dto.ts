import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsIn,
  IsNotEmpty,
} from 'class-validator';
import { ALL_ROLES, Role } from './user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsIn(ALL_ROLES, { each: true })
  roles: Role[];
}
