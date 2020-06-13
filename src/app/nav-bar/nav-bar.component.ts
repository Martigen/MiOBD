import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { User } from '../model/user';
import { delay } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';
import { SearchRememberService } from '../search-remember.service';

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
  hasUserRole: boolean

  constructor(private auth: AuthService,private router: Router,notifierService: NotifierService,private rememberSearch : SearchRememberService) {
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
      this.hasUserRole = this.user.role.includes('ROLE_User');
    })

  }

  logOut() {
    this.rememberSearch.close()
    this.auth.logout();
    this.notifier.notify("success", "LogedOut Succesfully");
    this.router.navigateByUrl('/home');
  }

  SeeMyHaH(){
    this.rememberSearch.close()
    this.router.navigate(['search'], {queryParams: {userid: this.auth.getUserId()}});
  }

  NavigateToAdminPanel(){
    this.rememberSearch.close()
    this.router.navigate(['administrationPanel']);
  }

  NavigateToReservationPanel(){
    this.rememberSearch.close()
    this.router.navigate(['reservationsPanel'], {queryParams: {userid: this.auth.getUserId()}});
  }

  NavigateToMyReservationPanel(){
    this.rememberSearch.close()
    this.router.navigate(['reservationsPanel'], {queryParams: {userid: this.auth.getUserId(), myReservations: true}});
  }

  NavigateToRegistration(){
    this.router.navigate(['registration']);
  }

  EditUser(){
    this.rememberSearch.close()
    this.router.navigate(['editAccount'], {queryParams: {userid: this.auth.getUserId()}});
  }
  getRoles(){
    console.log(this.user);
      console.log(this.hasAdminRole);
  }

 NavigateToSearch(){
  this.rememberSearch.close()
  this.router.navigate(['search']);
 }
 NavigateToHome(){
  this.rememberSearch.close()
  this.router.navigate(['home']);
}

}
