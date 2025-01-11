import { Component, inject, OnInit, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessagesService } from '../../services/messages.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../../shared/interfaces/user.interface';
import { ChatHistoryDto } from '../../../shared/interfaces/chat-history';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-start-chat',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './start-chat.component.html',
  styles: ``
})
export class StartChatComponent implements OnInit {

  isModalOpen = false;
  isModalClosed = output()
  formBuilder = inject(FormBuilder)
  nameForm = this.formBuilder.group({
    name: ['', Validators.required],
  })
  messageService = inject(MessagesService)
  authService = inject(AuthService)
  user = signal<User | null>(null)
  router = inject(Router)

  ngOnInit(): void {
    this.user.set(this.authService.getUserFromStorage())
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  async onSubmit() {
    if (this.nameForm.valid) {
      const name = this.nameForm.get('name')?.value;

      await this.saveChatHistory(name!)

      this.router.navigate(["chat", name!])

      this.isModalClosed.emit();
    }
  }

  async saveChatHistory(username: string) {

    const chatHistoryDto: ChatHistoryDto = {
      currentUsername: this.user()?.username!,
      newsUsername: username
    }

    await firstValueFrom(this.messageService.saveChatHistrory(chatHistoryDto))


  }
}

