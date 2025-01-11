import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { HomeComponent } from './pages/home/home.component';
import { ChatComponent } from './pages/chat/chat.component';
import { StartChatComponent } from './components/start-chat/start-chat.component';
import { AuthGuardService } from './guards/auth.guard';

export const routes: Routes = [

  {
    path: "",
    component: HomeComponent
    , canActivate: [AuthGuardService]


  },

  {
    path: "home",
    redirectTo: "",
    pathMatch: "full"

  },

  {
    path: "login",
    component: LoginComponent,
  },

  {
    path: "signup",
    component: SignupComponent

  }
  ,



  {
    path: "chat/:name",
    component: ChatComponent
    , canActivate: [AuthGuardService]

  }
  , {
    path: "chat",
    component: ChatComponent
    , canActivate: [AuthGuardService]

  },
  {
    path: "start-chat",
    component: StartChatComponent
    , canActivate: [AuthGuardService]

  },
  { path: '**', redirectTo: "/", pathMatch: "full"},
];
