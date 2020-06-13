import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../service/api.service';
import {NotifierService} from 'angular-notifier';
import {User} from '../model/user';
import {Hotel} from '../model/hotel';

@Component({
  selector: 'app-reservations-panel',
  templateUrl: './reservations-panel.component.html',
  styleUrls: ['./reservations-panel.component.css']
})
export class ReservationsPanelComponent implements OnInit {
  private readonly notifier: NotifierService;

  constructor(private activatedroute: ActivatedRoute, private apiService: ApiService, private router: Router, notifierService: NotifierService) {
    this.notifier = notifierService;
  }

  user: User;
  hotels: Array<Hotel>;

  ngOnInit(): void {

    this.activatedroute.queryParams.subscribe(v => {

      this.apiService.getUser(v.userid).subscribe(data => {
        this.user = data as User;

        if (this.user.role.includes('ROLE_Admin')) {

          this.apiService.getHaHs().subscribe(hotels => {
            this.hotels = hotels as Array<Hotel>;
            console.log(this.hotels);
          });

        }

      });
    });

  }
}
