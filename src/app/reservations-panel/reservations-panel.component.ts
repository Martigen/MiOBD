import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../service/api.service';
import {NotifierService} from 'angular-notifier';
import {User} from '../model/user';
import {Hotel} from '../model/hotel';
import {Room} from '../model/room';

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
  hasHotelierRole: boolean;
  hasUserRole: boolean;
  myReservations: boolean;
  hotels: Array<Hotel>;
  hotels2: Array<Hotel>;

  ngOnInit(): void {

    this.activatedroute.queryParams.subscribe(v => {

      this.myReservations = false;
      this.hasUserRole = false;
      this.hasHotelierRole = false;

      if (v.myReservations){
        this.myReservations = true;
        this.hasUserRole = true;

        this.apiService.getUser(v.userid).subscribe(data => {
          this.user = data as User;

          this.apiService.getHaHs().subscribe(hotels => {

          this.hotels2 = hotels as Array<Hotel>;
          this.hotels = new Array<Hotel>();
          for (let i = 0; i < this.hotels2.length; i++){
            if (this.hotels2[i].Rooms.find(r => r.Reservations.find(reservation => reservation.UserId.includes(this.user._id)))){
              this.hotels.push(this.hotels2[i]);
            }
            }

          let roomsToRemove = [];
            let existReservation: boolean;
          for (let i = 0; i < this.hotels.length; i++) {
            for (let j = 0; j < this.hotels[i].Rooms.length; j++) {
              existReservation = false;
              for (let k = 0; k < this.hotels[i].Rooms[j].Reservations.length; k++) {
                if(i === 2){
                }
                if (this.hotels[i].Rooms[j].Reservations[k].UserId === this.user._id) {
                  existReservation = true;
                }
              }
              if(existReservation === false){
                roomsToRemove.push(j);
              }
            }
            roomsToRemove.reverse();
            if(roomsToRemove.length > 0) {
              for (let j = 0; j < roomsToRemove.length; j++) {
                this.hotels[i].Rooms.splice(roomsToRemove[j], 1);
              }
            }
            roomsToRemove = [];
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
          } else if (this.user.role.includes('ROLE_Hotelier')) {
            this.hotels = new Array<Hotel>();
            this.hasHotelierRole = true;
            this.apiService.getHaHs().subscribe(hotels => {
              this.hotels2 = hotels as Array<Hotel>;

              for (let i = 0; i < this.hotels2.length; i++) {
                if (this.hotels2[i].User === this.user._id){
                  this.hotels.push(this.hotels2[i]);
                }
              }
            });
          }


        });
      }

    });

  }

  CancelReservation(hotel: Hotel, room: Room, reservation){

    let hahs;
    this.apiService.getHaHs().subscribe(hotels => {
      hahs = hotels as Array<Hotel>;
      let hotelToUpdate: Hotel = new Hotel();
      let roomToUpdate: Room = new Room();
      let reservationToUpdate;
      hotelToUpdate = hahs.find(x => x._id === hotel._id);
      console.log(hotelToUpdate);
      roomToUpdate = hotelToUpdate.Rooms.find(x => x._id === room._id);
      reservationToUpdate = roomToUpdate.Reservations.find(x => x._id === reservation._id);
      reservationToUpdate.Status = 'Canceled';
      reservation.Status = 'Canceled';
      console.log(hotelToUpdate);
      this.apiService.updateHaH(hotelToUpdate._id, hotelToUpdate).subscribe(data => console.log(data));
    });

  }

  CancelReservationByHotelier(hotel: Hotel, room: Room, reservation){
    let hahs;
    this.apiService.getHaHs().subscribe(hotels => {
      hahs = hotels as Array<Hotel>;
      let hotelToUpdate: Hotel = new Hotel();
      let roomToUpdate: Room = new Room();
      let reservationToUpdate;
      hotelToUpdate = hahs.find(x => x._id === hotel._id);
      console.log(hotelToUpdate);
      roomToUpdate = hotelToUpdate.Rooms.find(x => x._id === room._id);
      reservationToUpdate = roomToUpdate.Reservations.find(x => x._id === reservation._id);
      reservationToUpdate.Status = 'Canceled by Hotelier';
      reservation.Status = 'Canceled by Hotelier';
      console.log(hotelToUpdate);
      this.apiService.updateHaH(hotelToUpdate._id, hotelToUpdate).subscribe(data => console.log(data));
    });
}

  DeleteReservation(hotel: Hotel, room, reservation){
    const index = room.Reservations.indexOf(reservation);
    room.Reservations.splice(index, 1);
    this.apiService.updateHaH(hotel._id, hotel).subscribe(data => console.log(data));
  }
}
