import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SignupDto } from '../pages/signup/dto/sign-up.dto';
import { User } from '../../shared/interfaces/user.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginDto } from '../pages/login/dto/login.dto';


const backend_url = "http://localhost:3000"

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  localStorageKey = "messenger_app"

  userSubject = new BehaviorSubject<any>(null)
  user$ = this.userSubject.asObservable()

  http = inject(HttpClient)

  signup(signupDto: SignupDto) {
    return this.http.post<User>(backend_url + "/users", signupDto)
  }

  login(loginDto: LoginDto) {

    return this.http.post<User>(backend_url + "/users/login", loginDto)

  }

  setUser(user: User) {
    this.userSubject.next(user)
  }

  clearUser() {
    this.userSubject.next(null)
  }

  saveUserToStorage(user: User) {
    localStorage.setItem(this.localStorageKey, JSON.stringify(user))
  }

  getUserFromStorage() {
    const user = localStorage.getItem(this.localStorageKey)
    return user ? JSON.parse(user) as User : null
  }

  deleteUserFromStorage() {
    localStorage.removeItem(this.localStorageKey)
  }

}
