import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Hotel } from '../model/hotel';
import { ActivatedRoute, Router } from '@angular/router';
import { element } from 'protractor';
import { Room } from '../model/room';
import { Address } from '../model/address';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  hah: Hotel;
  room;
  image;
  myHaH = false;

  constructor(private apiService: ApiService, private activatedroute: ActivatedRoute, private auth: AuthService, private router: Router) {
    this.activatedroute.queryParams.subscribe(v => {
      this.apiService.getHaH(v.id).subscribe(data => {
        this.hah = data as Hotel;
        let tmp: number = null;
        if(data.Scores.length > 0)
         tmp = data.Scores.reduce((a: number, b: number) => a + b) / data.Scores.length;
        let tmproom = data.Rooms.filter(e => e.Number == v.roomid)

        this.room = this.createItem(data._id, data.Stars, data.Type, data.Name, data.Region, data.Address, tmp, tmproom[0], data.Extras, data.Images)
        this.image = data.Images[0];

        if (this.hah.User != this.auth.getUserId()) {
          this.apiService.addView(v.id).subscribe(data => { console.log(data) })
          this.myHaH = false;
        }
        else {
          this.myHaH = true;
        }

      })
     
    

    });






  }

  createItem(id: string, stars: string, type: string, name: string, region: string, addres: Address, avgScore: number, room: Room, extras: Array<string>, images: Array<string>) {
    return {
      id: id,
      roomid: room.Number,
      type: type,
      name: name,
      stars: stars,
      region: region,
      city: addres.City,
      street: addres.Street,
      avgScore: avgScore,
      RoomSize: room.Size,
      RoomBeds: room.NumberOfBeds,
      RoomPrice: room.Price,
      RoomVip: room.Vip,
      extras: extras,
      images: images,
    };
  }


  loadImg(img) {
    this.image = img;
  }

  ngOnInit(): void {
  }

  editHaH(id, roomid){
    this.router.navigate(['formhah'], { queryParams: { id: id, roomid: roomid } });
  }

}
