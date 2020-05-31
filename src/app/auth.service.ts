import { Injectable } from '@angular/core';

import { Subject, Observable } from 'rxjs';
import {  isUndefined } from 'util';
import { Router } from '@angular/router';
import { ApiService } from './service/api.service';
import { User } from './model/user';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

 
  private isLogged = new Subject<boolean>();
  private loggedin = false;
  private role = "";
  private loggedUserData= new Subject<User>()
  constructor( private router: Router,private apiService: ApiService) {
    this.isLogged.next(false);

  }

  login(email: string, password: string) {
    this.apiService.getUserByEmailAndPassword(email,password).subscribe( v => {
      if(!isUndefined(v[0])){
      this.isLogged.next(true);
      this.loggedin = true;
      this.role = v[0].role;
      this.loggedUserData.next(v[0]);
      this.router.navigateByUrl('/search');
    }else{
      alert("Bad Email or Password!")
    }

    })
      
  }

  logout(){
    this.isLogged.next(false);
    this.loggedin = false;
    this.router.navigateByUrl('/home');
    this.role = "";
    
  }

  getLoginStatus(): Observable<Boolean>{
    return this.isLogged.asObservable();

  }
  getLoginStatus2() {
    return this.loggedin;
  }

  getRole() {
    return this.role;
  }

  getLoggedUser(){
   
    return this.loggedUserData;
  }

  isAdmin() {

    if (this.role.includes("ROLE_Admin"))
      return true;
    return false;
  }

}
