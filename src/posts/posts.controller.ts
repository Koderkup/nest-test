import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { Post as PostModel } from '@prisma/client';
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
  @ApiOperation({ summary: 'Post creation' })
  @ApiResponse({
    status: 201,
    type: PostResponse,
    description: 'The registered user',
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


  //   @Get('post/:id')
  //   async getPostById(@Param('id') id: string): Promise<PostModel> {
  //     return this.postsService.post({ id: Number(id) });
  //   }
  //   @Get('feed')
  //   async getPublishedPosts(): Promise<PostModel[]> {
  //     return this.postsService.posts({});
  //   }
  //   @Get('filtered-posts/:searchString')
  //   async getFilteredPosts(
  //     @Param('searchString') searchString: string,
  //   ): Promise<PostModel[]> {
  //     return this.postsService.posts({
  //       where: {
  //         OR: [
  //           {
  //             title: { contains: searchString },
  //           },
  //           {
  //             content: { contains: searchString },
  //           },
  //         ],
  //       },
  //     });
  //   }
  
  //   @Delete('post/:id')
  //   async deletePost(@Param('id') id: string): Promise<PostModel> {
  //     return this.postsService.deletePost({ id: Number(id) });
  //   }
}
