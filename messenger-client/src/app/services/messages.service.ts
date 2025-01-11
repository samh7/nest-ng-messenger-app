import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SenderReceiverDto } from '../../shared/interfaces/sender-receiver';
import { Message } from '../../shared/interfaces/message.interface';
import { CreateMessageDto } from '../../shared/interfaces/create-message.interface';
import { ChatHistoryDto } from '../../shared/interfaces/chat-history';

const backend_url = "http://localhost:3000"

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  http = inject(HttpClient)
  withCredentials = {
    withCredentials: true
  }

  getMessageBetween(senderReceiverDto: SenderReceiverDto) {

    // console.log(senderReceiverDto)

    const url = backend_url + "/users/messages"
    return this.http.post<Message[]>(url, senderReceiverDto, this.withCredentials)
  }

  getChatHistory(currentUserName: string) {
    return this.http.post<string[]>(backend_url + "/users/chat-history", { currentUserName }, this.withCredentials)
  }
  sendMessageBetween(createMessageDto: CreateMessageDto) {
    const url = backend_url + "/users/messages/new"
    return this.http.post<Message>(url, createMessageDto, this.withCredentials)
  }

  saveChatHistrory(chatHistoryDto: ChatHistoryDto) {
    const url = backend_url + "/users/chat-history/update"
    return this.http.post<Message>(url, chatHistoryDto, this.withCredentials)

  }
}
