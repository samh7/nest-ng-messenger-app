import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { EventsService } from './events.service';
import { Server, Socket } from 'socket.io';
import { TypingDto } from './dto/typing.dto';

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

    console.log(name)

  }


  @SubscribeMessage('typing')
  async typing(
    @MessageBody() typingDto: TypingDto,
    @ConnectedSocket() client: Socket

  ) {

    // console.log(client.id)
    console.log(typingDto)

    this.server.emit("typing", { username: typingDto.username, isTyping: typingDto.isTyping })
  }
}
