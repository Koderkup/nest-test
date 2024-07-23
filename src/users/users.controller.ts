import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
  Req,
  NotFoundException,
  ForbiddenException,
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
import {JwtAuthGuard} from '../auth/jwt-auth.guard'
import {RolesGuard} from '../auth/roles.quards'
import { Roles } from 'src/auth/roles-auth.decorator';
import { UserRequest } from './request.interface';
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
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get('users')
  async getUsers(): Promise<UserModel[]> {
    return this.usersService.users({});
  }
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    type: UserResponse,
    description: 'User profile',
  })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('users/:id')
  async getUserProfile(
    @Param('id') id: string,
    @Req() request: UserRequest,
  ): Promise<UserModel> {
    const userId = parseInt(id, 10);
    const user = await this.usersService.user({ id: userId });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const requesterId = request.user?.id;
    const isAdmin = request.user?.role === 'admin';

    if (!isAdmin) {
      if (requesterId !== userId) {
        throw new ForbiddenException(
          'You do not have permission to access this user profile',
        );
      }
    }

    return user;
  }
}

