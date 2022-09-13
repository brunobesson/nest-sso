import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthLoginDto {
  @ApiProperty({ description: 'Email', example: 'john.doe@nowhere.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password', example: 'Pa$$MorD' })
  @IsNotEmpty()
  password: string;
}
