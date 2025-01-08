import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, LoginDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { compare, hash } from 'bcryptjs';
import { plainToClass, plainToInstance } from 'class-transformer';
import { UserReceiverDto } from './dto/user-receiver.dto';
import { Message } from 'src/messages/entities/message.entity';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';
import { sortMessages } from '../shared/utils';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>
  ) { }



  async create(createUserDto: CreateUserDto) {

    try {
      const hashedPassword = await hash(createUserDto.password, 10)

      const newUser: CreateUserDto = {
        ...createUserDto,
        password: hashedPassword
      }

      const savedUser = plainToClass(
        User,
        await this.userRepository.save(newUser)
      )

      if (!savedUser) throw new HttpException('User creation failed', HttpStatus.INTERNAL_SERVER_ERROR);

      const { password, ...userWithoutPassword } = savedUser;

      return userWithoutPassword;

    }
    catch (error) {
      if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      }

      throw error
    }

  }

  async login(loginDto: LoginDto) {
    const canUserLogIn = await this.userRepository.findOne({ where: { username: loginDto.username } })
    const compareHashes = compare(canUserLogIn.password, loginDto.password)

    if (!compareHashes) throw new HttpException("User Not Authneticated", HttpStatus.UNAUTHORIZED)

    return plainToClass(User, canUserLogIn)

  }


  async findAllMessagesBetween(userReceiverDto: UserReceiverDto) {

    const receiverExists = this.findOne(userReceiverDto.receiverUsername)

    if (!receiverExists) throw new HttpException('User not found', HttpStatus.INTERNAL_SERVER_ERROR);

    const senderExists = this.findOne(userReceiverDto.senderUsername)

    if (!senderExists) throw new HttpException('User not found', HttpStatus.INTERNAL_SERVER_ERROR);


    const fetchedMessages = await this.messageRepository
      .createQueryBuilder("message")
      .where('message.senderUsername = :username ', { username: userReceiverDto.senderUsername })
      .orWhere('message.receiverUsername = :username ', { username: userReceiverDto.receiverUsername })
      .getMany()

    return sortMessages(fetchedMessages)
  }

  async sendMessagesBetween(createMessageDto: CreateMessageDto) {




    const receiverExists = await this.findOne(createMessageDto.receiverUsername)

    if (!receiverExists) throw new HttpException('User not found', HttpStatus.INTERNAL_SERVER_ERROR);

    const senderExists = await this.findOne(createMessageDto.senderUsername)

    if (!senderExists) throw new HttpException('User not found', HttpStatus.INTERNAL_SERVER_ERROR);


    const newMessage = new Message()
    newMessage.receiverUsername = receiverExists.username
    newMessage.senderUsername = senderExists.username
    newMessage.text = createMessageDto.text

    const savedMessage = await this.messageRepository.save(newMessage);

    return savedMessage
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
      const user = await this.findOne(username)

      await this.userRepository.remove(user);
    } catch (error) {

      if (error.code === 'ER_ROW_IS_REFERENCED' || error.code === '23503') {
        throw new HttpException('User cannot be deleted due to existing references', HttpStatus.BAD_REQUEST);
      }

      throw error;
    }
  }
}
