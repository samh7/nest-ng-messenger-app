import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SignupDto } from '../pages/signup/dto/sign-up.dto';
import { User } from '../../shared/interfaces/user.interface';
import { BehaviorSubject } from 'rxjs';
import { LoginDto } from '../pages/login/dto/login.dto';


const backend_url = "http://localhost:3000"

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  localStorageKey = "messenger_app"

  userSubject = new BehaviorSubject<User | null>(null)
  user$ = this.userSubject.asObservable()

  withCredentials = {
    withCredentials: true
  }

  http = inject(HttpClient)



  status() {
    return this.http.get(backend_url + "/auth/status", this.withCredentials)
  }

  receiverUserExists(username: string) {
    return this.http.get<User | null>(backend_url + `/users/isUser/${username}`, this.withCredentials)
  }

  signup(signupDto: SignupDto) {
    return this.http.post<User>(backend_url + "/auth/signup", signupDto, this.withCredentials)
  }

  login(loginDto: LoginDto) {

    return this.http.post<User>(backend_url + "/auth/login", loginDto, this.withCredentials)

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
