import { Component, OnInit, ɵAPP_ID_RANDOM_PROVIDER } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Hotel } from '../model/hotel';
import { Room } from '../model/room';
import { element } from 'protractor';
import { Sort } from '@angular/material/sort';
import { Options, LabelType } from 'ng5-slider';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import {User} from "../model/user";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  HaH: Array<any> = Array<any>();
  city: string = "";
  remenberHaH: Array<any> = Array<any>();
  vip: boolean = false;
  hotel: boolean = true;
  hostel: boolean = true;
  regions: Array<string> = Array<string>();
  selectedRegions: Array<boolean> = Array<boolean>();
  myHaH = false;

  maxPrice: number = 0;
  minPrice: number = 99999;

  maxBeds: number = 0;
  minBeds: number = 999;

  maxScore: number = 0;
  minScore: number = 5;

  maxStars: number = 0;
  minStars: number = 100;

  maxComments: number = 0;
  minComments: number = 0;

  maxSize: number = 0;
  minSize: number = 0;

  hasUserRole: boolean;
  hasHotelierRole: boolean;

  optionsPrice: Options = {
    floor: 0,
    ceil: 1000,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return '<b>Min price:</b> $' + value;
        case LabelType.High:
          return '<b>Max price:</b> $' + value;
        default:
          return '$' + value;
      }
    }
  };


  optionsBeds: Options = {
    floor: 1,
    ceil: 10,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return '<b>Min Beds:</b> ' + value;
        case LabelType.High:
          return '<b>Max Beds:</b> ' + value;
        default:
          return value.toString();
      }
    }
  };

  optionsScore: Options = {
    floor: 0,
    ceil: 5,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return '<b>Min score:</b>' + value;
        case LabelType.High:
          return '<b>Max score:</b>' + value;
        default:
          return  value.toString();
      }
    }
  };

  optionsStars: Options = {
    floor: 0,
    ceil: 5,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return '<b>Min:</b>' + value + '★';
        case LabelType.High:
          return '<b>Max:</b>' + value+ '★';
        default:
          return  value.toString();
      }
    }
  };

  optionsComments: Options = {
    floor: 0,
    ceil: 20,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return '<b>Min Comments:</b>' + value;
        case LabelType.High:
          return '<b>Max Comments:</b>' + value;
        default:
          return  value.toString();
      }
    }
  };

  optionsSizes: Options = {
    floor: 1,
    ceil: 50,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return '<b>Min Size:</b>' + value;
        case LabelType.High:
          return '<b>Max Size:</b>' + value;
        default:
          return  value.toString();
      }
    }
  };



  constructor(private auth: AuthService, private apiService: ApiService, private router: Router, private activatedroute: ActivatedRoute) {




  }

  ngOnInit(): void {


    this.activatedroute.queryParams.subscribe(v => {
      this.load();

      if (v.city) {
        this.city = v.city;
        setTimeout(() => { this.SearchButton(); }, 100);
      }
      else if (v.userid) {
        this.myHaH = true;

        if (!this.auth.getLoginStatus2()) {
          this.router.navigate(['home']);
        }
        setTimeout(() => {
          this.remenberHaH = this.remenberHaH.filter(val => val.user == v.userid);
          this.HaH = this.remenberHaH.filter(val => val.user == v.userid);
        }, 100);

      }
    });
  }

  setNewCeil(options:Options,newCeil: number): Options {
    const newOptions: Options = Object.assign({}, options);
    newOptions.ceil = newCeil;
    return newOptions;
  }


  load() {
    this.myHaH = false;
    this.HaH = [];
    this.apiService.getHaHs().subscribe(data => {
      data as Array<Hotel>;

      (data as Array<Hotel>).forEach(element => {
        let tmp: number = null;
        if (element.Scores.length > 0){
          const sum = element.Scores.map(a => a.Score).reduce(function (a,b) {
            return a + b;
          });
          tmp = sum / element.Scores.length;
        }

        element.Rooms.forEach(item => {
          if (item.Price > this.maxPrice)
            this.maxPrice = item.Price;
          else if (item.Price < this.minPrice)
            this.minPrice = item.Price;
          if (item.NumberOfBeds > this.maxBeds)
            this.maxBeds = item.NumberOfBeds;
          if (!this.regions.includes(element.Region)) {
            this.regions.push(element.Region);
            this.selectedRegions.push(true);
          }
          if(item.Size > this.maxSize)
          this.maxSize = item.Size;
          if(element.Scores.length> this.maxComments)
          this.maxComments = element.Scores.length;

            if (element.Accepted) {
              this.HaH.push(this.createItem(element._id, element.Stars, element.Type, element.Name, element.Region, element.Address.City, tmp, item, element.Extras, element.User, element.Views, element.Scores.length))
            }

         
        });
      });
      this.remenberHaH = this.HaH;
      this.HaH.sort((a, b) => this.compare(a.views, b.views, false))
      this.optionsPrice = this.setNewCeil(this.optionsPrice,this.maxPrice)
      this.optionsBeds = this.setNewCeil(this.optionsBeds,this.maxBeds)
      this.optionsSizes = this.setNewCeil(this.optionsSizes,this.maxSize)
      this.optionsComments = this.setNewCeil(this.optionsComments,this.maxComments)
    })

    this.auth.getLoggedUser().subscribe((ele) => {
      let user: User;
      user =ele;
      this.hasUserRole = user.role.includes('ROLE_User');
      this.hasHotelierRole = user.role.includes('ROLE_Hotelier');
    })

  }

  createItem(id: string, stars: string, type: string, name: string, region: string, city: string, avgScore: number, room: Room, extras: Array<string>, user: string, views: number, commentCount) {
    return {
      id: id,
      roomid: room.Number,
      user: user,
      type: type,
      name: name,
      stars: stars,
      region: region,
      city: city,
      avgScore: avgScore === null ? avgScore : avgScore.toFixed(2),
      RoomSize: room.Size,
      RoomBeds: room.NumberOfBeds,
      RoomPrice: room.Price,
      RoomVip: room.Vip,
      extras: extras,
      views: views,
      commentCount: commentCount
    };
  }

  SearchButton() {


    this.HaH = [];
    this.remenberHaH.forEach(element => {
      this.HaH.push(element)
    });

    if (this.city != "") {
      this.HaH = this.remenberHaH.filter(val => val.city == this.city);
    }
    if (!this.hotel || !this.hostel) {
      if (this.hotel)
        this.HaH = this.HaH.filter(element => element.type == "Hotel")
      if (this.hostel)
        this.HaH = this.HaH.filter(element => element.type == "Hostel")
    }

    for (let index = 0; index < this.regions.length; index++) {
      if (!this.selectedRegions[index])
        this.HaH = this.HaH.filter(element => element.region != this.regions[index])
    }



    this.HaH = this.HaH.filter(element => element.RoomPrice >= this.minPrice && element.RoomPrice <= this.maxPrice)
    this.HaH = this.HaH.filter(element => element.RoomBeds >= this.minBeds && element.RoomBeds <= this.maxBeds)
    this.HaH = this.HaH.filter(element => element.RoomSize >= this.minSize && element.RoomSize <= this.maxSize);
    this.HaH = this.HaH.filter(element => element.stars >= this.minStars && element.stars <= this.maxStars || this.minStars == 0 && element.stars == '-');
    this.HaH = this.HaH.filter(element => element.avgScore >= this.minScore && element.avgScore <= this.maxScore);
    this.HaH = this.HaH.filter(element => element.commentCount >= this.minComments && element.commentCount <= this.maxComments);
    if (this.vip)
      this.HaH = this.HaH.filter(element => element.RoomVip);


  }

  sortData(sort: Sort) {
    const data = this.HaH.slice();
    if (!sort.active || sort.direction === '') {
      this.HaH = data;
      return;
    }

    this.HaH = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return this.compare(a.name, b.name, isAsc);
        case 'city': return this.compare(a.city, b.city, isAsc);
        case 'region': return this.compare(a.region, b.region, isAsc);
        case 'avgScore': return this.compare(a.avgScore, b.avgScore, isAsc);
        case 'RoomBeeds': return this.compare(a.RoomBeeds, b.RoomBeeds, isAsc);
        case 'commentCount': return this.compare(a.commentCount, b.commentCount, isAsc);
        case 'RoomSize': return this.compare(a.RoomSize, b.RoomSize, isAsc);
        case 'RoomVip': return this.compare(a.RoomVip, b.RoomVip, isAsc);
        case 'RoomPrice': return this.compare(a.RoomPrice, b.RoomPrice, isAsc);
        case 'extras': return this.compare(a.extras.length, b.extras.length, isAsc);
        case 'stars': return this.compare(a.stars, b.stars, isAsc);
        case 'views': return this.compare(a.views, b.views, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  seeDetails(id, roomid) {
    this.router.navigate(['detail'], { queryParams: { id: id, roomid: roomid } });
  }
  editHaH(id, roomid) {
    this.router.navigate(['formhah'], { queryParams: { id: id, roomid: roomid } });
  }

}




