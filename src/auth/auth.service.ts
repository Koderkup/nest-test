import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserCreateDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User as UserModel, Prisma } from '@prisma/client';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async login(userDto: UserCreateDto) {}

  async register(userDto: UserCreateDto) {
    const existingUser = await this.usersService.getUserByEmail(userDto.email);
    if (existingUser) {
      throw new HttpException(
        'User is already exists with such email',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.usersService.createUser({
      ...userDto,
      password: hashPassword,
    });
    return this.generateToken(user);
  }

  async generateToken(user: UserModel) {
    const payload = { email: user.email, id: user.id, role: user.role };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
