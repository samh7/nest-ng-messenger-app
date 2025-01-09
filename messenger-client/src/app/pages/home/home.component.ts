import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ChatHeadComponent } from "../../components/chat-head/chat-head.component";
import { MessagesService } from '../../services/messages.service';
import { single } from 'rxjs';
import { User } from '../../../shared/interfaces/user.interface';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    ChatHeadComponent
  ],
  templateUrl: './home.component.html',
  styles: ``
})
export class HomeComponent implements OnInit {

  formBuilder = inject(FormBuilder)
  authService = inject(AuthService)
  router = inject(Router)
  chatHistory = signal<string[]>([])
  receiverForm = this.formBuilder.group({
    receiver: ["", Validators.required]
  })
  user = signal<User | null>(null)
  messageService = inject(MessagesService)
  formSubmitted() {

    this.user.set(this.authService.getUserFromStorage())
    this.authService.user$.subscribe((currentUser) => {

      const receiverName = this.receiverForm.value.receiver;
      this.router.navigate(["chat", receiverName])

    })
  }

  ngOnInit(): void {

    this.user.set(this.authService.getUserFromStorage())

    // currentUserName
    if (this.user()) {
      this.messageService.getChatHistory("sila").subscribe((usernames: string[]) => {
        this.chatHistory.set(usernames)
        console.log(usernames, " usernames")
      })
    }

  }

}
