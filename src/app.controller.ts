import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users/users.service';
import { PostsService } from './posts/posts.service';
import { User as UserModel, Post as PostModel } from '@prisma/client';
import { UserCreateDto } from './user/user.dto';
import { AppService } from './app.service';
@Controller()
export class AppController {
  constructor(
    private readonly userService: UsersService,
    private readonly postsService: PostsService,
    private readonly appService: AppService
  ) {}

  @Get('/')
  getHello(): string {
    return this.appService.getHello();
  }


  @Get('post/:id')
  async getPostById(@Param('id') id: string): Promise<PostModel> {
    return this.postsService.post({ id: Number(id) });
  }

  @Get('feed')
  async getPublishedPosts(): Promise<PostModel[]> {
    return this.postsService.posts({});
  }

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

  @Post('post')
  async createDraft(
    @Body() postData: { title: string; content?: string; authorEmail: string },
  ): Promise<PostModel> {
    const { title, content, authorEmail } = postData;
    return this.postsService.createPost({
      title,
      content,
      user: {
        connect: { email: authorEmail },
      },
    });
  }

  @Post('auth/register')
  async registerUser(@Body() userCreateDto: UserCreateDto): Promise<UserModel> {
    return this.userService.createUser(userCreateDto);
  }

  @Put('publish/:id')
  async publishPost(@Param('id') id: string): Promise<PostModel> {
    return this.postsService.updatePost({
      where: { id: Number(id) },
      data: { published: true },
    });
  }

  @Delete('post/:id')
  async deletePost(@Param('id') id: string): Promise<PostModel> {
    return this.postsService.deletePost({ id: Number(id) });
  }
}
