import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {User} from "../model/user";
import {ApiService} from "../service/api.service";

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

  constructor(private activatedroute: ActivatedRoute, private apiService: ApiService, private router: Router) { }

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

    if (regexp.test(this.user.email)) {
      if (this.user.password.length === 0) {


        if (this.changePassword) {
          this.user.password = this.newPassword;
        } else {
          this.user.password = this.oldPassword;
        }

        this.apiService.updateUser(this.user._id, this.user).subscribe(data => console.log(data));
        window.history.back();

      } else {
        alert('Password cannot be blank ');
      }
    } else{
      alert('Set correct email');
    }
  }
}
