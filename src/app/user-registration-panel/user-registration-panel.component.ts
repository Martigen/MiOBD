import { Component, OnInit } from '@angular/core';
import {User} from "../model/user";
import {ApiService} from "../service/api.service";
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';

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
  private readonly notifier: NotifierService;

  constructor(private apiService: ApiService, private router: Router,notifierService: NotifierService) { this.notifier = notifierService; }

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
                this.notifier.notify("success", "Registered Succesfully");
                this.router.navigate(['#']);

              } else {
                this.notifier.notify("error", "Passwords do not match");

              }
            } else {
              this.notifier.notify("error", "Password cannot be blank");
            }
          } else {
           this.notifier.notify("error", "Set correct email");
          }
        } else {
           this.notifier.notify("error", "This email already exist");
        }
      } else {
        this.notifier.notify("error", "Surname cannot be blank");
      }
    }else {
      this.notifier.notify("error", "Name cannot be blank ");
    }
    }



}
