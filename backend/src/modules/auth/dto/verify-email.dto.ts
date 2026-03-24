import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
  @ApiProperty({
    description: 'Email verification token',
    example: 'abc123xyz',
  })
  @IsString()
  @IsNotEmpty()
  token!: string;
}
