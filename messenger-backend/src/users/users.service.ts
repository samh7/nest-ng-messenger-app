import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, LoginDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Not, Repository, IsNull } from 'typeorm';
import { compare, hash } from 'bcryptjs';
import { plainToClass, plainToInstance } from 'class-transformer';
import { UserReceiverDto } from './dto/user-receiver.dto';
import { Message } from 'src/messages/entities/message.entity';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';
import { extractUsernamesReceiver, extractUsernamesSender, filterChatHistory, sortMessages } from '../shared/utils';
import { RecentUserChats } from './entities/recent-user-chats.entity';
import { ChatHistorydDto } from './dto/chat-history.dto';
import { UpdatetChatHistorydDto } from './dto/update-chat-history.dto';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,


    @InjectRepository(RecentUserChats)
    private readonly chatHistoryRepository: Repository<RecentUserChats>
  ) { }



  async create(createUserDto: CreateUserDto) {

    // createUserDto.email = createUserDto.email.trim()
    // createUserDto.username = createUserDto.username.trim()
    // createUserDto.password = createUserDto.password.trim()
    try {
      const hashedPassword = await hash(createUserDto.password, 10);

      const newUser: CreateUserDto = {
        ...createUserDto,
        password: hashedPassword
      };

      const savedUser = plainToClass(
        User,
        await this.userRepository.save(newUser)
      );

      if (!savedUser) throw new HttpException('User creation failed', HttpStatus.INTERNAL_SERVER_ERROR);

      const { password, ...userWithoutPassword } = savedUser;

      return userWithoutPassword;

    }
    catch (error) {
      if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      }

      throw error;
    }

  }

  async login(loginDto: LoginDto) {
    const canUserLogIn = await this.userRepository.findOne({ where: { username: loginDto.username } });

    const compareHashes = await compare(loginDto.password, canUserLogIn.password);

    console.log(compareHashes, " hashres")

    if (!compareHashes) throw new HttpException("User Not Authneticated", HttpStatus.UNAUTHORIZED);

    return plainToClass(User, canUserLogIn);

  }
  


  async findAllMessagesBetween(userReceiverDto: UserReceiverDto) {


    const senderExists = await this.findOne(userReceiverDto.senderUsername);

    if (!senderExists) throw new HttpException('User not found', HttpStatus.INTERNAL_SERVER_ERROR);


    let receiverExists;



    if (userReceiverDto.receiverUsername) {

      receiverExists = await this.findOne(userReceiverDto.receiverUsername);


      if (!receiverExists) throw new HttpException('User not found', HttpStatus.INTERNAL_SERVER_ERROR);


      const fetchedMessages1 = await this.messageRepository.find({
        where: {
          receiverUsername: senderExists.username,
          senderUsername: userReceiverDto.receiverUsername

        }
      })

      const fetchedMessages2 = await this.messageRepository.find({
        where: {
          receiverUsername: userReceiverDto.receiverUsername,
          senderUsername: senderExists.username

        }
      })

      const fetchedMessages = fetchedMessages1.concat(fetchedMessages2)

      return sortMessages(fetchedMessages);

    }
    else {


      const fetchedMessages = await this.messageRepository.find({
        where: {
          receiverUsername: senderExists.username,
          senderUsername: senderExists.username

        }
      })

      return sortMessages(fetchedMessages);

    }
  }

  async sendMessagesBetween(createMessageDto: CreateMessageDto) {




    const senderExists = await this.findOne(createMessageDto.senderUsername);

    if (!senderExists) throw new HttpException('User not found', HttpStatus.INTERNAL_SERVER_ERROR);


    let receiverExists;

    if (createMessageDto.receiverUsername) {

      receiverExists = await this.findOne(createMessageDto.receiverUsername);

      if (!receiverExists) throw new HttpException('User not found', HttpStatus.INTERNAL_SERVER_ERROR);

    }
    else {

      receiverExists = senderExists

    }

    const newMessage = new Message();
    newMessage.receiverUsername = receiverExists.username;
    newMessage.senderUsername = senderExists.username;
    newMessage.text = createMessageDto.text;

    const savedMessage = await this.messageRepository.save(newMessage);

    return savedMessage;
  }


  async findChatHitsory(chatHistorydDto: ChatHistorydDto) {

    try {

      // const fetchedHistory = await this.chatHistoryRepository.findOne({
      //   where:
      //   {
      //     currentUserName: chatHistorydDto.currentUserName
      //   }
      // })

      // return filterChatHistory(fetchedHistory.userNames)

      const fetcheMessagesSender = await this.messageRepository.find({

        where: {
          senderUsername: chatHistorydDto.currentUserName,
          receiverUsername: Not(chatHistorydDto.currentUserName) && Not(IsNull())
        }

      })

      const fetcheMessagesReceiver = await this.messageRepository.find({

        where: {
          senderUsername:  Not(chatHistorydDto.currentUserName) && Not(IsNull()),
          receiverUsername: chatHistorydDto.currentUserName
        }

      })



      const receiveUsernames = extractUsernamesSender(fetcheMessagesReceiver)
      const senderUsernames = extractUsernamesReceiver(fetcheMessagesSender)

      const usernames = receiveUsernames.concat(senderUsernames)


      return filterChatHistory(usernames)

    }
    catch (error) {
      throw new HttpException('Failed to retrieve chat history', HttpStatus.INTERNAL_SERVER_ERROR);

    }
  }

  async createChatHistory(username: string) {

    const userExists = plainToClass(User, await this.findOne(username))

    if (!userExists) throw new HttpException('User not found', HttpStatus.BAD_REQUEST);

    const fetchedHistrory = await this.chatHistoryRepository.findOne({
      where: {
        currentUserName: username
      }
    })

    if (fetchedHistrory) throw new HttpException('User has chat history already', HttpStatus.INTERNAL_SERVER_ERROR);

    const newChatHistory = new RecentUserChats()
    newChatHistory.userNames = []
    newChatHistory.currentUserName = username

    this.chatHistoryRepository.save(newChatHistory)

    return []

  }

  async addToChatHitsory(updatetChatHistorydDto: UpdatetChatHistorydDto) {

    try {

      const userExists = plainToClass(User, await this.findOne(updatetChatHistorydDto.currentUsername))

      if (!userExists) throw new HttpException('User not found', HttpStatus.BAD_REQUEST);

      const fetchedHistrory = await this.chatHistoryRepository.findOne({
        where: {
          currentUserName: updatetChatHistorydDto.currentUsername
        }
      })

      fetchedHistrory.userNames.push(updatetChatHistorydDto.newsUsername)
      return await this.chatHistoryRepository.save(fetchedHistrory)
    }
    catch (error) {
      throw new HttpException('Failed to retrieve chat history', HttpStatus.INTERNAL_SERVER_ERROR);

    }
  }

  async findAll() {

    try {
      return plainToInstance(User, await this.userRepository.find());
    } catch (error) {
      throw new HttpException('Failed to retrieve users', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



  async findOne(username: string) {

    try {

      if (!username) throw new NotFoundException();

      return plainToClass(User, await this.userRepository.findOne({ where: { username } }));

    } catch (error) {

      throw new HttpException('User not found', HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }



  async update(username: string, updateUserDto: UpdateUserDto) {

    try {

      const user = await this.findOne(username);

      const updatedUser = Object.assign(user, updateUserDto);

      return plainToClass(User, await this.userRepository.save(updatedUser));

    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
        throw new HttpException('Duplicate entry', HttpStatus.CONFLICT);
      }

      throw error;
    }
  }



  async remove(username: string) {
    try {
      const user = await this.findOne(username);

      await this.userRepository.remove(user);
    } catch (error) {

      if (error.code === 'ER_ROW_IS_REFERENCED' || error.code === '23503') {
        throw new HttpException('User cannot be deleted due to existing references', HttpStatus.BAD_REQUEST);
      }

      throw error;
    }
  }
}
