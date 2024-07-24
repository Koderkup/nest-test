import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ValidationPipe } from '../pipes/validation.pipe';
import { ApiTags } from '@nestjs/swagger';
import { UserCreateDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/login')
  login(@Body() userDto: UserCreateDto) {
    return this.authService.login(userDto);
  }
  @UsePipes(ValidationPipe)
  @Post('/register')
  register(@Body() userDto: UserCreateDto) {
    return this.authService.register(userDto);
  }
}
