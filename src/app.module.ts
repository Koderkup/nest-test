import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { PostsService } from './posts/posts.service';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [AuthModule, UsersModule, PostsModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService, UsersService, PostsService, PrismaService],
  exports: [UsersService, PostsService],
})
export class AppModule {}
