import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Hotel } from '../model/hotel';
import { ActivatedRoute, Router } from '@angular/router';
import { element } from 'protractor';
import { Room } from '../model/room';
import { Address } from '../model/address';
import { AuthService } from '../auth.service';
import {Score} from "../model/score";
import {User} from "../model/user";


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
  score: Score;
  user: User;


  constructor(private apiService: ApiService, private activatedroute: ActivatedRoute, private auth: AuthService, private router: Router) {
    this.activatedroute.queryParams.subscribe(v => {
      this.apiService.getHaH(v.id).subscribe(data => {
        this.hah = data as Hotel;
        let tmp: number = null;
        if(data.Scores.length > 0){
          const sum = data.Scores.map(a => a.Score).reduce(function (a,b) {
            return a + b;
          });
          tmp = sum / data.Scores.length;
        }
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
        this.hah.Scores.reverse();
      })

      let userId: string;
      this.user = new User();
      userId = this.auth.getUserId();
      this.apiService.getUser(userId).subscribe(data => {
        this.user.name = data.name;
        this.user.surname = data.surname;
      });

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
      avgScore: avgScore === null ? avgScore : avgScore.toFixed(2),
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
    this.score = new  Score();
    this.score.Score = 5;
    this.score.Description = '';
  }

  editHaH(id, roomid){
    this.router.navigate(['formhah'], { queryParams: { id: id, roomid: roomid } });
  }

  Rate(){
    let arrayToRevert: Array<Score> = new Array<Score>();
    let date: Date;

    date = new Date();
    this.score.Date = date.getHours().toString() + ':' + date.getMinutes() + '  ' +
      date.getDay().toString() +'-' + date.getMonth().toString() + '-' + date.getFullYear();

    
    this.score.Name = this.user.name;
    this.score.Surname = this.user.surname;

    arrayToRevert.push(this.score);
    arrayToRevert = arrayToRevert.concat(this.hah.Scores);


    this.hah.Scores.push(this.score);
    this.apiService.updateHaH(this.hah._id, this.hah).subscribe(data => console.log(data));

    this.hah.Scores = arrayToRevert;
}

}
