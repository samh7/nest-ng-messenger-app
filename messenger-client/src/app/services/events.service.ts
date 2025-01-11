import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { TypingDto } from '../../shared/interfaces/typing-dto';
import { Message } from '../../shared/interfaces/message.interface';

const SOCKET_URL = 'http://localhost:3000';


@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private socket: Socket;

  private typingSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  public typing$ = this.typingSubject.asObservable();

  private joinsSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  public joins$ = this.typingSubject.asObservable();

  private messageSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  public message$ = this.messageSubject.asObservable();

  constructor() {

    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
    });

    this.socket.on('typing', (data: TypingDto) => {
      this.typingSubject.next(data)
    });

    this.socket.on('join', (data: any) => {
      this.joinsSubject.next(data)
    });

    this.socket.on('message', (data: Message) => {
      this.messageSubject.next(data)
    })
  }

  typing(typingDto: TypingDto): void {
    this.socket.emit('typing', typingDto);
  }

  newMesage(message: Message): void {
    this.socket.emit('message', message);
  }

}
