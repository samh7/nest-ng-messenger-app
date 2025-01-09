import { Component, inject, input, OnInit, signal } from '@angular/core';
import { MessagesService } from '../../services/messages.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../../shared/interfaces/user.interface';
import { Message } from '../../../shared/interfaces/message.interface';
import { UtcToLocalTimePipe } from '../../pipes/utc-to-localtime.pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-chat-head',
  imports: [UtcToLocalTimePipe, RouterLink],
  templateUrl: './chat-head.component.html',
  styles: ``
})
export class ChatHeadComponent implements OnInit {
  receiverName = input<string | null>(null)
  lastMessageSend = signal("")
  lastMessage = signal("")
  messageService = inject(MessagesService)
  authService = inject(AuthService)
  user = signal<User | null>(null)
  route = signal("/chat/")

  name = 'sila'
  name2 = "sila"

  ngOnInit(): void {
    this.user.set(this.authService.getUserFromStorage())
    if (this.receiverName()) {
      this.route.update((route) => route + this.receiverName()!)
      this.messageService.
        getMessageBetween({
          senderUsername: this.user()!.username,
          receiverUsername: this.receiverName()!
        })
        .subscribe((messages) => {
          const last = messages[messages.length - 1]
          this.lastMessage.set(last.text)
          this.lastMessageSend.set(last.createdAt)
        })
    }
    else {
      this.messageService.
        getMessageBetween({
          senderUsername: this.user()!.username,

        })
        .subscribe((messages) => {
          const last = messages[messages.length - 1]
          this.lastMessage.set(last.text)
          this.lastMessageSend.set((last.createdAt))
        })
    }
  }


  // convertUTCDateToLocalTime(dateString: string) {
  //   try {
  //     const date = new Date(dateString);

  //     if (date) {
  //       return "Invalid Date"; // Handle invalid date strings
  //     }

  //     let hours = date.getHours();

  //     const minutes = date.getMinutes();

  //     const ampm = hours >= 12 ? 'pm' : 'am';

  //     hours = hours % 12;
  //     hours = hours ? hours : 12; // the hour '0' should be '12'

  //     const formattedTime = `${hours}.${minutes.toString().padStart(2, '0')} ${ampm}`;
  //     return formattedTime;
  //   } catch (error) {
  //     console.error("Error converting date:", error);
  //     return "Error converting date"; // Handle potential errors during date processing
  //   }
  // }
}
