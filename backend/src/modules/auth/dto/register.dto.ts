import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RoleName } from '../../common/entities/role.entity';

export class RegisterDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'User role',
    enum: RoleName,
    example: RoleName.JOB_SEEKER,
  })
  @IsEnum(RoleName)
  @IsNotEmpty()
  role: RoleName;
}
