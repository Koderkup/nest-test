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
import { Post as PostModel, Prisma } from '@prisma/client';
import { PostsService } from './posts.service';
import { PostCreateDto } from './dto/create-post-dto';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiTags,
  ApiProperty,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.quards';
import { Roles } from 'src/auth/roles-auth.decorator';
import { UserRequest } from '../users/request.interface';
class PostResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  userId: number;
  @ApiProperty()
  published: boolean;
}
@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  @ApiOperation({ summary: 'Post`s creation' })
  @ApiResponse({
    status: 201,
    type: PostResponse,
    description: 'The creation of post',
  })
  @ApiBody({ type: PostCreateDto })
  @UseGuards(JwtAuthGuard)
  @Post()
  async createPost(
    @Body() postData: { title: string; content?: string; userId: number },
  ): Promise<PostModel> {
    const { title, content, userId } = postData;
    return this.postsService.createPost({
      title,
      content,
      user: {
        connect: { id: userId },
      },
    });
  }

  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({
    status: 200,
    type: [PostResponse],
    description: 'List of posts',
  })
  @Get()
  async getPosts(): Promise<PostModel[]> {
    return this.postsService.posts({});
  }
  @ApiOperation({ summary: 'Get post' })
  @ApiResponse({
    status: 200,
    type: PostResponse,
    description: 'User`s post',
  })
  @Get('/:id')
  async getPostById(@Param('id') id: string): Promise<PostModel> {
    return this.postsService.post({ id: Number(id) });
  }
  @ApiOperation({ summary: 'Get filtered posts' })
  @ApiResponse({
    status: 200,
    type: [PostResponse],
    description: 'List of filtered posts',
  })
  @Get('filtered-posts/:searchString')
  async getFilteredPosts(
    @Param('searchString') searchString: string,
  ): Promise<PostModel[]> {
    return this.postsService.posts({
      where: {
        OR: [
          {
            title: { contains: searchString },
          },
          {
            content: { contains: searchString },
          },
        ],
      },
    });
  }
  @ApiOperation({ summary: 'Delete post' })
  @ApiResponse({
    status: 200,
    type: PostResponse,
    description: 'Deleted post',
  })
  @Roles('admin', 'user')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deletePost(
    @Param('id') id: string,
    @Req() request: UserRequest,
  ): Promise<PostModel> {
    const post = await this.postsService.post({ id: Number(id) });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    const requesterId = request.user?.id;
    const isAdmin = request.user?.role === 'admin';

    if (!isAdmin && post.userId !== requesterId) {
      throw new ForbiddenException('Вам не разрешено удалять этот пост');
    }

    return this.postsService.deletePost({ id: Number(id) });
  }
  @ApiOperation({ summary: 'Edit post' })
  @ApiResponse({
    status: 200,
    type: PostResponse,
    description: 'Edit post',
  })
  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async updatePost(
    @Param('id') id: string,
    @Body() updateData: Prisma.PostUpdateInput,
    @Req() request: UserRequest,
  ): Promise<PostModel> {
    const postId = parseInt(id, 10);
    const post = await this.postsService.post({ id: postId });
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }
    const requesterId = request.user?.id;
    if (requesterId !== post.userId) {
      throw new ForbiddenException(
        'Вам не разрешено редактировать пост этого пользователя',
      );
    }
    return this.postsService.updatePost({
      data: updateData,
      where: { id: postId },
    });
  }
}
