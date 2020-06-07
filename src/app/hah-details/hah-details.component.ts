import { Component, OnInit } from '@angular/core';
import {ApiService} from "../service/api.service";
import { ActivatedRoute, Router } from '@angular/router';
import {Hotel} from "../model/hotel";

@Component({
  selector: 'app-hah-details',
  templateUrl: './hah-details.component.html',
  styleUrls: ['./hah-details.component.css']
})
export class HahDetailsComponent implements OnInit {

  hotel: Hotel;
  image;
  owner: string;
  avg: string = '-';
  rooms: string = '-';

  constructor(private apiService: ApiService, private activatedroute: ActivatedRoute) {
    this.activatedroute.queryParams.subscribe(h => {
      this.apiService.getHaH(h.id).subscribe(data => {
        this.hotel = data as Hotel;
        this.image = this.hotel.Images[0];

        if(this.hotel.Scores.length > 0){
          this.avg = ((this.hotel.Scores.map(s => s.Score).reduce((accumulator, currentValue) => accumulator + currentValue))
          / this.hotel.Scores.length).toString();
        }
        if(this.hotel.Rooms.length > 0){
          this.rooms = this.hotel.Rooms.length.toString();
        }
        this.apiService.getUser(this.hotel.User).subscribe(data => {
          this.owner = data.name + ' ' + data.surname;
        });
      })
    })
  }

  ngOnInit(): void {
    console.log(this.image);
  }

  loadImg(img) {
    this.image = img;
  }

}
