import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { Message } from 'src/messages/entities/message.entity';
import { RecentUserChats } from 'src/users/entities/recent-user-chats.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Message, RecentUserChats]), // Import TypeOrmModule.forFeature with the User entity
    UsersModule
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, UsersService],
})
export class AuthModule { }

