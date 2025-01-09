import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { RecentUserChats } from 'src/users/entities/recent-user-chats.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, User, RecentUserChats])
  ],
  controllers: [MessagesController],
  providers: [MessagesService, UsersService],
})
export class MessagesModule { }
