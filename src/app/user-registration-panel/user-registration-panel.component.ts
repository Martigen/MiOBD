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
  user: User;
  isHotelier: boolean;
  confirmPassword: string;
  users = Array<User>();
  emails;
  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.user  = new User();
    this.user.name= '';
    this.user.surname= '';
    this.user.password = '';
    this.users = [];
    this.apiService.getUsers().subscribe(data => {
        this.users = data as Array<User>;
        this.emails = this.users.map(({email}) => email);

      }
    );
  }

  Save() {
    let regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    let isExist: boolean;

    if(this.user.name.length > 0) {
      if (this.user.surname.length > 0) {
        isExist = this.emails.includes(this.user.email);
        if (!isExist) {
          if (regexp.test(this.user.email)) {
            if (this.user.password.length != 0) {
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
                alert('Passwords do not match');

              }
            } else {
              alert('Password cannot be blank ');
            }
          } else {
            alert('Set correct email');
          }
        } else {
          alert('This email already exist');
        }
      } else {
        alert('Surname cannot be blank ');
      }
    }else {
      alert('Name cannot be blank ');
    }
    }



}
