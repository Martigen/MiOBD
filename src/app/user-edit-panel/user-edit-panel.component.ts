import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {User} from "../model/user";
import {ApiService} from "../service/api.service";
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-user-edit-panel',
  templateUrl: './user-edit-panel.component.html',
  styleUrls: ['./user-edit-panel.component.css']
})
export class UserEditPanelComponent implements OnInit {
  user: User = new User();
  oldPassword: string;
  changePassword: boolean;
  newPassword: string;
  private readonly notifier: NotifierService;

  constructor(private activatedroute: ActivatedRoute, private apiService: ApiService, private router: Router,notifierService: NotifierService) {  this.notifier = notifierService; }

  ngOnInit(): void {
    this.newPassword = '';

    this.changePassword = false;
    this.activatedroute.queryParams.subscribe(v => {

      this.apiService.getUser(v.userid).subscribe(data => {
        this.user = data;
        this.oldPassword = this.user.password;
      });

    });
  }


  Save(){

    let regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

    if(this.user.name.length > 0) {
      if (this.user.surname.length > 0) {
        if (regexp.test(this.user.email)) {
          if (this.changePassword) {

            if (this.newPassword.length > 0) {
              this.user.password = this.newPassword;

              this.apiService.updateUser(this.user._id, this.user).subscribe(data => console.log(data));
              window.history.back();
              this.notifier.notify("success", "Saved changes!");

            } else {
             this.notifier.notify("error", "Password cannot be empty");
            }

          } else {
            this.user.password = this.oldPassword;

            this.apiService.updateUser(this.user._id, this.user).subscribe(data => console.log(data));
            window.history.back();
            this.notifier.notify("success", "Saved changes!");
          }


        } else {
           this.notifier.notify("error", "Set correct email");
        }
      } else {
        this.notifier.notify("error", "Surname cannot be empty");
      }
    } else {
     this.notifier.notify("error", "Name cannot be empty");
    }
  }
}
