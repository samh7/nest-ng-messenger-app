import { User } from './../../shared/interfaces/user.interface';
import { inject, Injectable, signal } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  router = inject(Router)
  authService = inject(AuthService)
  user = signal<User | null>(null);
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {

    this.user.set(this.authService.getUserFromStorage())
    console.log(this.user(), "nul hahahahaha")
    if (!this.user()) {
      this.router.navigate(["/login"])
      return false
    }

    this.authService.status().subscribe(user_ => {
      const user = user_ as User
      if (user.username !== this.user()?.username) {
        this.authService.clearUser()
        this.authService.deleteUserFromStorage()
        this.router.navigate(["/login"])
      }
    },
      (_) => {
        this.authService.deleteUserFromStorage()
        this.authService.clearUser()
        this.router.navigate(["/login"])
        return false
      })

    return true
  }
}
