import { IsString, IsEmail, IsNotEmpty, IsIn} from 'class-validator';
import {
  ApiProperty,
} from '@nestjs/swagger';
export type Role = 'admin' | 'user';
export class UserCreateDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsIn(['admin', 'user'])
  role: Role = 'user';
}
