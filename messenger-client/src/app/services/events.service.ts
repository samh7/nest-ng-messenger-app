import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { TypingDto } from '../../shared/interfaces/typing-dto';
import { Message } from '../../shared/interfaces/message.interface';

const SOCKET_URL = 'http://localhost:3000';


@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private socket: Socket;

  private typingSubject!: BehaviorSubject<TypingDto>
  public typing$!: Observable<TypingDto>

  // private joinsSubject!: BehaviorSubject<any>
  // public joins$!: Observable<any>

  private messageSubject!: BehaviorSubject<Message>
  public message$!: Observable<Message>

  constructor() {

    this.typingSubject = new BehaviorSubject(Object());
    this.typing$ = this.typingSubject.asObservable();

    // this.joinsSubject = new BehaviorSubject(null);
    // this.joins$ = this.typingSubject.asObservable();


    this.messageSubject = new BehaviorSubject<Message>(Object());
    this.message$ = this.messageSubject.asObservable();


    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
    });

    this.socket.on('typing', (data: TypingDto) => {
      this.typingSubject.next(data)
    });

    // this.socket.on('join', (data: any) => {
    //   this.joinsSubject.next(data)
    // });

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
