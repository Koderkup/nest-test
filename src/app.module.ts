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
import { ConfigModule } from '@nestjs/config';
import { UsersController } from './users/users.controller';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    PrismaModule,
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'secret',
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  controllers: [AppController, UsersController],
  providers: [
    AppService,
    UsersService,
    PostsService,
    PrismaService,
    AuthService,
  ],
  exports: [UsersService, PostsService, AuthService],
})
export class AppModule {}
