import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { User } from '../model/user';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  LoggedIn = false;
  email='a@a.a';
  pass='a';
  user: User;

  constructor(private auth: AuthService,private router: Router) {
    this.auth.getLoginStatus().subscribe((status : boolean) =>this.LoggedIn=status);
   }

  ngOnInit(): void {
  }

  login() {
    this.auth.login(this.email, this.pass);
    this.auth.getLoggedUser().subscribe((ele) =>this.user=ele);
    
  }

  logOut() {
    this.auth.logout();
    this.router.navigateByUrl('/home');
  }

  SeeMyHaH(){
    this.router.navigate(['search'], {queryParams: {userid: this.auth.getUserId()}});
  }

  NavigateToAdminPanel(){
    this.router.navigate(['administrationPanel']);
  }

  NavigateToRegistration(){
    this.router.navigate(['registration']);
  }

  EditUser(){
    this.router.navigate(['editAccount'], {queryParams: {userid: this.auth.getUserId()}});
  }

}
