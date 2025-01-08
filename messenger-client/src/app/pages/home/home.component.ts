import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './home.component.html',
  styles: ``
})
export class HomeComponent {

  formBuilder = inject(FormBuilder)
  authService = inject(AuthService)
  router = inject(Router)

  receiverForm = this.formBuilder.group({
    receiver: ["", Validators.required]
  })

  formSubmitted() {
    this.authService.user$.subscribe((currentUser) => {

      const receiverName = this.receiverForm.value.receiver;

      this.router.navigate(["chat", receiverName])

    })
  }

}
