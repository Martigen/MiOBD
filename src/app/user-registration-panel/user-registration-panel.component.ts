import { Component, OnInit } from '@angular/core';
import {User} from "../model/user";
import {ApiService} from "../service/api.service";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-registration-panel',
  templateUrl: './user-registration-panel.component.html',
  styleUrls: ['./user-registration-panel.component.css']
})
export class UserRegistrationPanelComponent implements OnInit {
  user: User = new User();
  isHotelier: boolean;
  confirmPassword: string;

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {

  }

  Save() {
    let regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

    if (regexp.test(this.user.email)) {
      if (this.user.password.length === 0) {
        if (this.confirmPassword === this.user.password) {

          const role = Array<string>();
          if (this.isHotelier) {
            role.push('ROLE_Hotelier')
          }
          role.push('ROLE_User');
          this.user.role = role;

          this.apiService.createUser(this.user).subscribe(data => console.log(data));
          this.router.navigate(['#']);

        } else {
          alert('Password cannot be blank ');
        }
      } else {
        alert('Passwords do not match');
      }
    } else{
      alert('Set correct email');
    }
  }

}
