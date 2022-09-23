import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AuthRefreshDto {
  @ApiProperty({ description: 'Refresh token' })
  @IsNotEmpty()
  token: string;
}
