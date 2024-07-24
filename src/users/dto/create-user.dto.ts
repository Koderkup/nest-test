import { IsString, IsEmail, IsNotEmpty, IsIn, Length} from 'class-validator';
import {
  ApiProperty,
} from '@nestjs/swagger';
export type Role = 'admin' | 'user';
export class UserCreateDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  @IsEmail({},{message: 'incorrect email'})
  readonly email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(4,16, {message: 'min 4 max 16 chars'} )
  readonly password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsIn(['admin', 'user'])
  role: Role = 'user';
}
