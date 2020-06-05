import { Component, OnInit } from '@angular/core';
import {Hotel} from "../model/hotel";
import {AuthService} from "../auth.service";
import {ApiService} from "../service/api.service";
import {Room} from "../model/room";

@Component({
  selector: 'app-administration-panel',
  templateUrl: './administration-panel.component.html',
  styleUrls: ['./administration-panel.component.css']
})
export class AdministrationPanelComponent implements OnInit {

  HaH: Array<Hotel> = Array<Hotel>();
  city: string = "";
  remenberHaH: Array<any> = Array<any>();
  vip: boolean = false;
  hotel: boolean = true;
  hostel: boolean = true;
  regions: Array<string> = Array<string>();
  selectedRegions: Array<boolean> = Array<boolean>()
  myHaH = false;

  maxPrice: number = 0;
  minPrice: number = 99999;

  maxBeds: number = 0;
  minBeds: number = 999;

  constructor(private auth: AuthService, private apiService: ApiService,) { }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.myHaH = false;
    this.HaH = [];
    this.apiService.getHaHs().subscribe(data => {
      data as Array<Hotel>;

      (data as Array<Hotel>).forEach(element => {
        let tmp: number = null;
    });
      this.HaH = data as Array<Hotel>;
    })
  }


  createItem(id: string, stars: string, type: string, name: string, region: string, city: string, avgScore: number, room: Room, extras: Array<string>, user: string, views: number) {
    return {
      id: id,
      roomid: room.Number,
      user: user,
      type: type,
      name: name,
      stars: stars,
      region: region,
      city: city,
      avgScore: avgScore,
      RoomSize: room.Size,
      RoomBeds: room.NumberOfBeds,
      RoomPrice: room.Price,
      RoomVip: room.Vip,
      extras: extras,
      views: views
    };
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  AcceptHotel(id: string){
    let hotelToAccept: Hotel;

    hotelToAccept = this.HaH.find(x => x._id == id);
    hotelToAccept.Accepted = true;
    this.apiService.updateHaH(id,hotelToAccept).subscribe(data => console.log(data))
  }

}
