import { Component, OnInit, ɵAPP_ID_RANDOM_PROVIDER } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Hotel } from '../model/hotel';
import { Room } from '../model/room';
import { element } from 'protractor';
import { Sort } from '@angular/material/sort';
import { Options, LabelType } from 'ng5-slider';
import { Router } from '@angular/router';

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
  selectedRegions: Array<boolean> = Array<boolean>()
  maxPrice: number = 0;
  minPrice: number = 99999;

  maxBeds: number = 0;
  minBeds: number = 999;

  optionsPrice: Options = {
    floor: 100,
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


  constructor(private apiService: ApiService,private router: Router) {
    this.apiService.getHaHs().subscribe(data => {
      data as Array<Hotel>;

      (data as Array<Hotel>).forEach(element => {
        let tmp: number = element.Scores.reduce((a: number, b: number) => a + b) / element.Scores.length;

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
          
          this.HaH.push(this.createItem(element._id,element.Type, element.Name, element.Region, element.Address.City, tmp, item, element.Extras))
        });
      });

      this.remenberHaH = this.HaH;
    
    })


  }

  ngOnInit(): void {
  }

  createItem(id: string,type: string, name: string, region: string, city: string, avgScore: number, room: Room, extras: Array<string>) {
    return {
      id:id,
      roomid: room.Number,
      type: type,
      name: name,
      region: region,
      city: city,
      avgScore: avgScore,
      RoomSize: room.Size,
      RoomBeds: room.NumberOfBeds,
      RoomPrice: room.Price,
      RoomVip: room.Vip,
      extras: extras,
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
     if(!this.selectedRegions[index])
      this.HaH = this.HaH.filter(element => element.region != this.regions[index])
    }
     
    
   

    this.HaH = this.HaH.filter(element => element.RoomPrice >= this.minPrice && element.RoomPrice <= this.maxPrice)
    this.HaH = this.HaH.filter(element => element.RoomBeds >= this.minBeds && element.RoomBeds <= this.maxBeds)
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
        case 'RoomSize': return this.compare(a.RoomSize, b.RoomSize, isAsc);
        case 'RoomVip': return this.compare(a.RoomVip, b.RoomVip, isAsc);
        case 'RoomPrice': return this.compare(a.RoomPrice, b.RoomPrice, isAsc);
        case 'extras': return this.compare(a.extras.length, b.extras.length, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  seeDetails(id,roomid) {
    this.router.navigate(['detail'], {queryParams: {id: id,roomid: roomid}});
  }
  

}




