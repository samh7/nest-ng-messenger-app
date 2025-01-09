import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Message } from 'src/messages/entities/message.entity';
import { RecentUserChats } from './entities/recent-user-chats.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Message, RecentUserChats])
  ],
  controllers: [
    UsersController],
  providers: [UsersService],
})
export class UsersModule { }
