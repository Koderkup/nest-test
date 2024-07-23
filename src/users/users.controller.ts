import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserCreateDto } from './dto/create-user.dto';
import { User as UserModel, Prisma } from '@prisma/client';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiTags,
  ApiProperty,
} from '@nestjs/swagger';
class UserResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

@ApiTags('Users')
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({
    status: 201,
    type: UserResponse,
    description: 'The registered user',
  })
  @ApiBody({ type: UserCreateDto })
  @Post('register')
  async registerUser(@Body() userCreateDto: UserCreateDto): Promise<UserModel> {
    return this.usersService.createUser(userCreateDto);
  }
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    type: [UserResponse],
    description: 'List of users',
  })
  @Get('users')
  async getUsers(): Promise<UserModel[]> {
    return this.usersService.users({});
  }
}
