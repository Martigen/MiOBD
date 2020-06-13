import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../service/api.service';
import {NotifierService} from 'angular-notifier';
import {User} from '../model/user';
import {Hotel} from '../model/hotel';
import {reservation} from "../model/reservation";

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
  hasAdminRole: boolean;
  hotels: Array<Hotel>;
  hotels2: Array<Hotel>;
  ngOnInit(): void {

    this.activatedroute.queryParams.subscribe(v => {

      if (v.myReservations){
        this.apiService.getUser(v.userid).subscribe(data => {
          this.user = data as User;

          this.apiService.getHaHs().subscribe(hotels => {

          this.hotels2 = hotels as Array<Hotel>;
          this.hotels = new Array<Hotel>();

          for(let i = 0; i < this.hotels2.length; i++){
            if(this.hotels2[i].Rooms.find(r => r.Reservations.find(reservation => reservation.UserId.includes(this.user._id)))){
              this.hotels.push(this.hotels2[i]);
            }
            }

            for(let i = 0; i < this.hotels.length; i++) {
              for (let j = 0; j < this.hotels[i].Rooms.length; j++) {
                for (let k = 0; k < this.hotels[i].Rooms[j].Reservations.length; k++) {
                  if(this.hotels[i].Rooms[j].Reservations[k].UserId !== this.user._id){
                    this.hotels[i].Rooms[j].Reservations.splice(k, 1);
                  }
                }
              }
            }

        });

        });
      }
      else{

        this.apiService.getUser(v.userid).subscribe(data => {
          this.user = data as User;

          if (this.user.role.includes('ROLE_Admin')) {
            this.hasAdminRole = true;
            this.apiService.getHaHs().subscribe(hotels => {
              this.hotels = hotels as Array<Hotel>;
            });
          }


        });
      }

    });

  }

  CancelReservation(hotel: Hotel, r){
    r.Status = 'Canceled';
    this.apiService.updateHaH(hotel._id, hotel).subscribe(data => console.log(data));
  }

  DeleteReservation(hotel: Hotel, room, reservation){
    const index = room.Reservations.indexOf(reservation);
    room.Reservations.splice(index, 1);
    this.apiService.updateHaH(hotel._id, hotel).subscribe(data => console.log(data));
  }
}