import { Component, OnInit, ɵAPP_ID_RANDOM_PROVIDER } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Hotel } from '../model/hotel';
import { Room } from '../model/room';
import { element } from 'protractor';
import { Sort } from '@angular/material/sort';
import { Options, LabelType } from 'ng5-slider';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { User } from "../model/user";
import { DatePipe } from '@angular/common';
import { SearchRememberService } from '../search-remember.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  providers: [DatePipe]
})
export class ListComponent implements OnInit {

  HaH: Array<any> = Array<any>();
  city: Array<any> = Array<any>();
  from: Array<any> = Array<any>();
  to: Array<any> = Array<any>();
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
          return value.toString();
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
          return '<b>Max:</b>' + value + '★';
        default:
          return value.toString();
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
          return value.toString();
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
          return value.toString();
      }
    }
  };

  private readonly notifier: NotifierService;

  constructor(private auth: AuthService, private apiService: ApiService, private router: Router, private activatedroute: ActivatedRoute, private datePipe: DatePipe, private rememberSearch: SearchRememberService, notifierService: NotifierService) {


    this.notifier = notifierService;

  }

  ngOnInit(): void {

    this.city[0] = "";
    this.from[0] = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    this.to[0] = this.datePipe.transform(new Date().setDate(new Date().getDate() + 1), 'yyyy-MM-dd')


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

  setNewCeil(options: Options, newCeil: number): Options {
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
        if (element.Scores.length > 0) {
          const sum = element.Scores.map(a => a.Score).reduce(function (a, b) {
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
          if (item.Size > this.maxSize)
            this.maxSize = item.Size;
          if (element.Scores.length > this.maxComments)
            this.maxComments = element.Scores.length;

          if (element.Accepted) {
            this.HaH.push(this.createItem(element._id, element.Stars, element.Type, element.Name, element.Region, element.Address.City, tmp, item, element.Extras, element.User, element.Views, element.Scores.length, element.Images[0]))
          }


        });
      });
      this.HaH.forEach(element => {
        this.remenberHaH.push(element)
      });

      this.HaH.sort((a, b) => this.compare(a.views, b.views, false))
      this.optionsPrice = this.setNewCeil(this.optionsPrice, this.maxPrice)
      this.optionsBeds = this.setNewCeil(this.optionsBeds, this.maxBeds)
      this.optionsSizes = this.setNewCeil(this.optionsSizes, this.maxSize)
      this.optionsComments = this.setNewCeil(this.optionsComments, this.maxComments)


      for (let i = 0; i < this.to.length; i++) {
        for (let index = 0; index < this.HaH.length; index++) {
          for (let j = 0; j < this.HaH[index].reservations.length; j++) {
            if (this.HaH[index].reservations[j].To >= this.from[i] && this.HaH[index].reservations[j].To <= this.to[i]) {
              this.HaH.splice(index, 1)
              index--;
              break;
            } else if (this.HaH[index].reservations[j].From >= this.from[i] && this.HaH[index].reservations[j].From <= this.to[i]) {
              this.HaH.splice(index, 1)
              index--;
              break;
            }
          }
        }
      }

      if (this.rememberSearch.check()) {
        this.HaH = this.rememberSearch.get();
        this.city = this.rememberSearch.getCity();
        this.from = this.rememberSearch.getFrom();
        this.to = this.rememberSearch.getTo();

      } else {

        this.rememberSearch.set(this.HaH)
        this.rememberSearch.setCFT(this.city, this.from, this.to)
      }
    })


    this.auth.getLoggedUser().subscribe((ele) => {
      let user: User;
      user = ele;
      this.hasUserRole = user.role.includes('ROLE_User');
      this.hasHotelierRole = user.role.includes('ROLE_Hotelier');
    })



  }

  createItem(id: string, stars: string, type: string, name: string, region: string, city: string, avgScore: number, room: Room, extras: Array<string>, user: string, views: number, commentCount, img) {
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
      RoomVisible: room.Visible,
      extras: extras,
      views: views,
      commentCount: commentCount,
      image: img,
      reservations: room.Reservations
    };
  }

  SearchButton() {

    let notifiOnce = true;



    for (let i = 0; i < this.to.length; i++) {
      if (this.to[i] < this.from[i]) {
        if (notifiOnce)
          this.notifier.notify("error", "date To cannot be greater than date From!")
        notifiOnce = false;
        return
      }
      if (this.city[i] != '')
  for (let index = 0; index < this.city.length; index++) {

    if(i != index)
    if (this.city[i] == this.city[index]) {
      if (notifiOnce)
        this.notifier.notify("error", "City can't be the same!")
      notifiOnce = false;
      return
    }
    
  }
         
        
    }

    if (this.city.length > 1) {
      this.city.forEach(v => {
        if (v == "") {
          if (notifiOnce)
            this.notifier.notify("error", "City cannot be empty!")
          notifiOnce = false;
          return
        }
      })
    }
    if (!notifiOnce)
      return
    this.notifier.notify("info", "Searched!");

    this.HaH = []

    if (this.city[0] != "") {
      this.city.forEach(element => {
        this.remenberHaH.filter(val => val.city == element).forEach(e => this.HaH.push(e))
      });
    } else {
      this.remenberHaH.forEach(element => {
        this.HaH.push(element)
      });
    }

    for (let i = 0; i < this.to.length; i++) {
      for (let index = 0; index < this.HaH.length; index++) {
        for (let j = 0; j < this.HaH[index].reservations.length; j++) {
          if (this.HaH[index].reservations[j].To >= this.from[i] && this.HaH[index].reservations[j].To <= this.to[i]) {
            this.HaH.splice(index, 1)
            index--;
            break;
          } else if (this.HaH[index].reservations[j].From >= this.from[i] && this.HaH[index].reservations[j].From <= this.to[i]) {
            this.HaH.splice(index, 1)
            index--;
            break;
          }
        }
      }
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

    if (!this.myHaH) {
      this.rememberSearch.set(this.HaH)
      this.rememberSearch.setCFT(this.city, this.from, this.to)
    }

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

  add() {
    this.city.push("")
    this.from.push(this.to[this.to.length - 1]);
    this.to.push(this.datePipe.transform(new Date().setDate(new Date(this.from[this.from.length - 1]).getDate() + 1), 'yyyy-MM-dd'))
  }

  remove() {
    if (this.city.length > 1) {
      this.city.pop()
      this.from.pop()
      this.to.pop()
    }
  }

}




