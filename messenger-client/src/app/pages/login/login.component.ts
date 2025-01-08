import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { LoginDto } from './dto/login.dto';
import { User } from '../../../shared/interfaces/user.interface';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styles: ``
})
export class LoginComponent {
  formBuilder = inject(FormBuilder)
  authService = inject(AuthService)
  // stateService = inject(StateService)
  // userService = inject(UserService)
  router = inject(Router)

  loginForm = this.formBuilder.group({
    username: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(4)]],
  })

  formSubmitted() {
    const loginDto: LoginDto = {
      username: this.loginForm.value.username as string,
      password: this.loginForm.value.password as string
    }

    this.authService.login(loginDto).subscribe((user: User) => {


      this.authService.setUser(user)
      this.authService.saveUserToStorage(user)
      console.log(user)

      this.router.navigate(["/home"])

    })
  }
}
