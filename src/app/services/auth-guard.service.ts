import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(private authService: AuthenticationService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
    console.log(state.url)
    if (this.authService.isAuthenticated()) {
      if (state.url == '/login' || state.url == '/register' || state.url == '/') {
        this.router.navigateByUrl('/tabs/tab/t1');
        return false;
      }else{
        return true;
      }
    } else {
      if (state.url == '/login' || state.url == '/register' || state.url == '/') {
        return true;
      }else{
        this.router.navigateByUrl('/login');
        return false;
      }
    }

  }
}
