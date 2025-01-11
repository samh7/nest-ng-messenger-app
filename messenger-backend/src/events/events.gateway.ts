import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { EventsService } from './events.service';
import { Server, Socket } from 'socket.io';
import { TypingDto } from './dto/typing.dto';
import { NewMessageDto } from './dto/new-message.dto';
import { Message } from 'src/messages/entities/message.entity';

// @UsePipes(validationPipe)
@WebSocketGateway({
  cors: {
    origin: '*',
  }
})
export class EventsGateway {

  @WebSocketServer()
  server: Server



  @SubscribeMessage('join')
  joinRoom(
    @MessageBody("name") name: string,
    @ConnectedSocket() client: Socket
  ) {
  }


  @SubscribeMessage('typing')
  async typing(
    @MessageBody() typingDto: TypingDto,
    @ConnectedSocket() client: Socket

  ) {
    this.server.emit("typing", typingDto)
  }

  @SubscribeMessage('message')
  async newMessage(
    @MessageBody() messageDto: Message,
    @ConnectedSocket() client: Socket

  ) {

    this.server.emit("message", messageDto)
  }
}
