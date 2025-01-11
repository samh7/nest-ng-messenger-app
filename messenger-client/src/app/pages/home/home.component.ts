import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ChatHeadComponent } from "../../components/chat-head/chat-head.component";
import { MessagesService } from '../../services/messages.service';
import { User } from '../../../shared/interfaces/user.interface';
import { ChatComponentComponent } from "../../components/chat-component/chat-component.component";
import { StartChatComponent } from "../../components/start-chat/start-chat.component";
import { EventsService } from '../../services/events.service';
import { Message } from '../../../shared/interfaces/message.interface';
import { mergeAll } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [
    ReactiveFormsModule,
    ChatHeadComponent,
    StartChatComponent
  ],

  templateUrl: './home.component.html',
  styles: ``
})
export class HomeComponent implements OnInit {


  formBuilder = inject(FormBuilder)
  authService = inject(AuthService)
  router = inject(Router)
  filteredChatHistory = signal<string[]>([])
  chatHistory = signal<string[]>([])
  receiverForm = this.formBuilder.group({
    receiver: ["", Validators.required]
  })
  searchForm = this.formBuilder.group({
    searchText: ["", Validators.required]
  })
  isModalOpen = signal(false);
  user = signal<User | null>(null)
  messageService = inject(MessagesService)
  eventsService = inject(EventsService)

  openModal() {
    this.isModalOpen.set(true)
  }


  toggleModal() {
    this.isModalOpen.update((value) => !value)

  }


  search() {
    if (!this.searchForm.value.searchText) this.filteredChatHistory.set(this.chatHistory())

    this.filteredChatHistory.set(this.chatHistory().filter((value) => value.includes(this.searchForm.value.searchText!)))
  }

  formSubmitted() {

    const receiverName = this.receiverForm.value.receiver;

    this.router.navigate(["chat", receiverName])

  }

  ngOnInit(): void {

    this.user.set(this.authService.getUserFromStorage())

    // currentUserName
    if (this.user()) {
      this.messageService.getChatHistory(this.user()!.username!).subscribe((usernames: string[]) => {
        this.chatHistory.set(usernames)
        this.filteredChatHistory.set(usernames)
      })

      this.eventsService.message$.subscribe((message: Message) => {

        if (
          message.receiverUsername === this.user()!.username
          // message.senderUsername === "this.receiverName()"

        ) {
          this.messageService.getChatHistory(this.user()?.username!).subscribe((usernames: string[]) => {
            this.chatHistory.set(usernames)
            this.filteredChatHistory.set(usernames)
          })
        }
      })
    }



  }

}
