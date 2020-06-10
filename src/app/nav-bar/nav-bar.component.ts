import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { User } from '../model/user';
import { delay } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  private readonly notifier: NotifierService;
  LoggedIn = false;
  email='a@a.a';
  pass='a';
  user: User;
  hasHotelierRole: boolean;
  hasAdminRole: boolean;

  constructor(private auth: AuthService,private router: Router,notifierService: NotifierService) {
    this.notifier = notifierService;
    this.auth.getLoginStatus().subscribe((status : boolean) =>this.LoggedIn=status);
   }

  ngOnInit(): void {
  }

  login() {
    this.auth.login(this.email, this.pass);
    this.auth.getLoggedUser().subscribe((ele) => {
      this.notifier.notify("success", "LogedIn Succesfully");
      this.user=ele;
      this.hasAdminRole = this.user.role.includes('ROLE_Admin');
      this.hasHotelierRole = this.user.role.includes('ROLE_Hotelier');
    })

  }

  logOut() {
    this.auth.logout();
    this.notifier.notify("success", "LogedOut Succesfully");
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
  getRoles(){
    console.log(this.user);
      console.log(this.hasAdminRole);
  }

}
