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
  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {

  }

  Save(){
    const role = Array<string>();

    if(this.isHotelier){
      role.push('ROLE_Hotelier')
    }

    role.push('ROLE_User');
    this.user.role = role;
    console.log(this.user);

    this.apiService.createUser(this.user).subscribe(data => console.log(data));
    this.router.navigate(['#']);
  }

}
