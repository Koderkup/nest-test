import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PrismaModule } from '../prisma.module';
import { PostsController } from './posts.controller';
@Module({
  imports: [PrismaModule],
  providers: [PostsService],
  exports: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
