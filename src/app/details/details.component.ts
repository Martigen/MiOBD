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
import { NotifierService } from 'angular-notifier';
import { SearchRememberService } from '../search-remember.service';


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
  rate: number;
  description: string;
  from:string;
  to:string;

  hasAdminRole: boolean;
  hasUserRole: boolean;
  private readonly notifier: NotifierService;

  constructor(private apiService: ApiService, private activatedroute: ActivatedRoute, private auth: AuthService, private router: Router,notifierService: NotifierService,private rememberSearch : SearchRememberService) {
    this.notifier = notifierService;
    this.rate = 5;
    this.description = '';
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

        
        if(this.rememberSearch.check()){
         let tmpCity = this.rememberSearch.getCity();
         let tmpFrom = this.rememberSearch.getFrom();
         let tmpTo = this.rememberSearch.getTo();

     
          if(tmpCity[0] == ""){
            this.to = tmpTo[0];
            this.from = tmpFrom[0];
          }else

         for (let i = 0; i < tmpCity.length; i++) {
           if(tmpCity[i] == data.Address.City){
             this.to = tmpTo[i];
             this.from = tmpFrom[i];
           }         
         }

         for (let index = 0; index < this.hah.Rooms.length; index++) {
          for (let j = 0; j < this.hah.Rooms[index].Reservations.length; j++) {
            if (this.hah.Rooms[index].Reservations[j].To >= this.from && this.hah.Rooms[index].Reservations[j].To <= this.to) {
              this.hah.Rooms.splice(index, 1)
              index--;
              break;
            } else if (this.hah.Rooms[index].Reservations[j].From >= this.from && this.hah.Rooms[index].Reservations[j].From <= this.to) {
              this.hah.Rooms.splice(index, 1)
              index--;
              break;
            }
          }
        }


        }

        if (this.hah.User != this.auth.getUserId()) {
          this.apiService.addView(v.id).subscribe(data => { console.log(data) })
          this.myHaH = false;
        }
        else {
          this.myHaH = true;
        }
      });

      let userId: string;
      this.user = new User();
      userId = this.auth.getUserId();
      this.apiService.getUser(userId).subscribe(data => {
        this.user.name = data.name;
        this.user.surname = data.surname;
        this.hasAdminRole = data.role.includes('ROLE_Admin');
        this.hasUserRole = data.role.includes('ROLE_User');
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
      RoomVisible: room.Visible,
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
    this.score = new Score();


    date = new Date();
    this.score.Date = date.getHours().toString().length === 1 ? '0' + date.getHours().toString() : + date.getHours().toString() +
      ':' +
      (date.getMinutes().toString().length === 1 ?  '0' + date.getMinutes().toString() :  date.getMinutes().toString())
      + '  ' +
      (date.getDate().toString().length === 1 ? '0' + date.getDate().toString() : date.getDate().toString())
      +'-' +
      (date.getMonth().toString().length === 1 ? '0' + date.getMonth().toString() : date.getMonth().toString()) +
      '-' + date.getFullYear();


    this.score.Name = this.user.name;
    this.score.Surname = this.user.surname;

    arrayToRevert = [];
    arrayToRevert.push(this.score);
    arrayToRevert = arrayToRevert.concat(this.hah.Scores);

    this.score.Score = this.rate; 
    this.score.Description = this.description;
    this.hah.Scores.push(this.score);

    this.hah.Scores = arrayToRevert;

    this.apiService.updateHaH(this.hah._id, this.hah).subscribe(data => console.log(data));

    this.notifier.notify("success", "Score Added!");
}

  DeleteComment(comment){
    let indexToRemove: number;
    indexToRemove = this.hah.Scores.indexOf(comment);

    this.hah.Scores.splice(indexToRemove, 1);

    this.apiService.updateHaH(this.hah._id, this.hah).subscribe(data => console.log(data));

     this.notifier.notify("success", "Score Deleted!");
  }

  seeDetails(id, roomid) {
    this.router.navigate(['detail'], { queryParams: { id: id, roomid: roomid } });
    this.notifier.notify("info", "Details Loaded");
  }

  reserve(){

    this.apiService.reserve(this.room.id,this.room.roomid,this.from,this.to).subscribe(data => { console.log(data) })

    console.log(this.from)
    console.log(this.to)
  }

}
