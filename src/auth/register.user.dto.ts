import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({ description: 'User first name', example: 'John' })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'User last name', example: 'Doe' })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'User email (login)',
    example: 'john.doe@nowhere.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User password', example: 'Pa$$MorD' })
  @IsNotEmpty()
  password: string;
}
