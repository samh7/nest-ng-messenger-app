import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, LoginDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserReceiverDto } from './dto/user-receiver.dto';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';
import { ChatHistorydDto } from './dto/chat-history.dto';
import { UpdatetChatHistorydDto } from './dto/update-chat-history.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }


  @Post("login")
  login(@Body() LoginDto: LoginDto) {
    return this.usersService.login(LoginDto);
  }
  @Get("isUser/:username")
  userExists(
    @Param('username') username: string
  ) {
    return this.usersService.findOne(username);
  }


  @Post("messages")
  findAllMessagesBetween(
    @Body() userReceiverDto: UserReceiverDto
  ) {
    return this.usersService.findAllMessagesBetween(userReceiverDto);
  }


  @Post("messages/new")
  sendMessagesBetween(
    @Body() createMessageDto: CreateMessageDto
  ) {
    console.log(createMessageDto)

    return this.usersService.sendMessagesBetween(createMessageDto);
  }


  @Get("chat-history/:username")
  CreateChatHitsory(
    @Param('username') username: string
  ) {
    return this.usersService.createChatHistory(username);
  }


  @Post("chat-history/update")
  addToChatHitsory(
    @Body() updatetChatHistorydDto: UpdatetChatHistorydDto

  ) {
    return this.usersService.addToChatHitsory(updatetChatHistorydDto);
  }


  @Post("chat-history")
  findChatHitsory(
    @Body() chatHistorydDto: ChatHistorydDto

  ) {
    return this.usersService.findChatHitsory(chatHistorydDto);
  }


  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.usersService.findOne(username);
  }

  @Patch(':username')
  update(@Param('username') username: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(username, updateUserDto);
  }

  @Delete(':username')
  remove(@Param('username') username: string) {
    return this.usersService.remove(username);
  }
}
