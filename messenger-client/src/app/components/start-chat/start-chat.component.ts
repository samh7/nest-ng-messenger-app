import { Component, inject, OnInit, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessagesService } from '../../services/messages.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../../shared/interfaces/user.interface';
import { Router } from '@angular/router';

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

  onSubmit() {
    if (this.nameForm.valid) {


      if (this.nameForm.value.name === this.user()?.username) return
      const name = this.nameForm.value.name;

      this.authService.receiverUserExists(name!).subscribe((user: User | null) => {
        if (user?.username !== name!) {
          alert("User not found!")
          return
        }
        else{
          this.router.navigate(["chat", name!])

          this.isModalClosed.emit();
        }
      })


    }
  }


}

