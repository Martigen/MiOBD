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

  private id;
  private isLogged = new Subject<boolean>();
  private loggedin = false;
  private role = "";
  private loggedUserData= new Subject<User>()
  constructor( private router: Router,private apiService: ApiService) {
    this.isLogged.next(false);

  }

  login(email: string, password: string) {
    this.apiService.getUserByEmailAndPassword(email,password).subscribe( v => {
      if(!isUndefined(v)){
      this.isLogged.next(true);
      this.loggedin = true;
      this.role = v.role;
      this.id = v._id;
      this.loggedUserData.next(v);
      this.router.navigateByUrl('/search');
    
    }
    }
    )

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

  getUserId(){
    return this.id;
  }


  isAdmin() {

    if (this.role.includes("ROLE_Admin"))
      return true;
    return false;
  }

}
