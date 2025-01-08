import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SenderReceiverDto } from '../../shared/interfaces/sender-receiver';
import { Message } from '../../shared/interfaces/message.interface';
import { CreateMessageDto } from '../../shared/interfaces/create-message.interface';

const backend_url = "http://localhost:3000"

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  http = inject(HttpClient)

  getMessageBetween(senderReceiverDto: SenderReceiverDto) {
    const url = backend_url + "/users/messages"
    return this.http.post<Message[]>(url, senderReceiverDto)
  }

  sendMessageBetween(createMessageDto: CreateMessageDto) {
    const url = backend_url + "/users/messages/new"
    return this.http.post<Message>(url, createMessageDto)
  }
}
