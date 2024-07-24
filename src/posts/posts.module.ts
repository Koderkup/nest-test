import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PrismaModule } from '../prisma.module';
import { PostsController } from './posts.controller';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'secret',
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  providers: [PostsService],
  exports: [PostsService, JwtModule],
  controllers: [PostsController],
})
export class PostsModule {}
