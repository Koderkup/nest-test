import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PrismaModule } from '../prisma.module';
@Module({
  imports: [PrismaModule],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
