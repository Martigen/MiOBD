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
  hah:Hotel;
  HaH: Array<Hotel> = Array<Hotel>();
  constructor(private apiService: ApiService, private activatedroute: ActivatedRoute, private router: Router) {
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

    this.HaH = [];
    this.apiService.getHaHs().subscribe(data => {
      data as Array<Hotel>;

      (data as Array<Hotel>).forEach(element => {
        let tmp: number = null;
      });
      this.HaH = data as Array<Hotel>;
    })

  }

  ngOnInit(): void {
    console.log(this.image);
  }

  loadImg(img) {
    this.image = img;
  }

  DeleteComment(comment){
    let indexToRemove: number;
    indexToRemove = this.hotel.Scores.indexOf(comment);

    this.hotel.Scores.splice(indexToRemove, 1);
    this.apiService.updateHaH(this.hotel._id, this.hotel).subscribe(data => console.log(data));
  }

  editHaH(id){
    this.router.navigate(['formhah'], { queryParams: { id: id } });
  }


}
