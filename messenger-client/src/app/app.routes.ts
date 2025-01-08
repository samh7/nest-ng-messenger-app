import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { HomeComponent } from './pages/home/home.component';
import { ChatComponent } from './pages/chat/chat.component';

export const routes: Routes = [

  {
    path: "login",
    component: LoginComponent
  },

  {
    path: "signup",
    component: SignupComponent
  }
  ,

  {
    path: "home",
    component: HomeComponent
  },


  {
    path: "chat/:name",
    component: ChatComponent
  }
,
  { path: '**', redirectTo: '' },
];
