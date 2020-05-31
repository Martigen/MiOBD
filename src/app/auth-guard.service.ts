import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  private loggedIn : boolean = false;


  constructor(private auth : AuthService,private router: Router) {
    this.loggedIn = this.auth.getLoginStatus2();
    this.auth.getLoginStatus().subscribe((flag: boolean) => {
      this.loggedIn = flag;
    })
   }

   canActivate(route : ActivatedRouteSnapshot, state : RouterStateSnapshot){
    
    return this.loggedIn;
  }
}
