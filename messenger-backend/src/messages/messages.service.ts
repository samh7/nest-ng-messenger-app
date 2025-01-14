import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MessagesService {

  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly usersService: UsersService

  ) { }

  async create(createMessageDto: CreateMessageDto) {

    let receiverExists, senderExists;




    try {
      senderExists = await this.usersService.findOne(createMessageDto.senderUsername)
      if (!senderExists) throw new NotFoundException()
    }
    catch (_error) {
      throw new HttpException('Receiver user not found', HttpStatus.BAD_REQUEST);
    }


    if (createMessageDto.receiverUsername) {
      try {

        receiverExists = await this.usersService.findOne(createMessageDto.receiverUsername)
        if (!receiverExists) throw new NotFoundException()

      }
      catch (_error) {
        throw new HttpException('Receiver user not found', HttpStatus.BAD_REQUEST);
      }
    }
    else {
      receiverExists = senderExists
    }


    const savedMessage = await this.messageRepository.save(createMessageDto)

    if (!savedMessage) throw new HttpException('Message creation failed', HttpStatus.INTERNAL_SERVER_ERROR);;

    return createMessageDto

  }

  async findAll() {

    try {

      return await this.messageRepository.find({})

    } catch (error) {
      throw new HttpException('Failed to retrieve messages', HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  async findOne(id: string) {
    try {

      return await this.messageRepository.findOne({ where: { id } })

    } catch (error) {
      throw new HttpException('Failed to retrieve messages', HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  async update(id: string, updateMessageDto: UpdateMessageDto) {

    const message = await this.findOne(id);

    message.text = updateMessageDto.text

    return plainToClass(Message, await this.messageRepository.save(message));


  }

  async remove(id: string) {

    try {

      const message = await this.findOne(id)

      await this.messageRepository.remove(message);

      return { id }

    } catch (error) {

      if (error.code === 'ER_ROW_IS_REFERENCED' || error.code === '23503') {
        throw new HttpException('Message cannot be deleted due to existing references', HttpStatus.BAD_REQUEST);
      }

      throw error;
    }
  }
}
