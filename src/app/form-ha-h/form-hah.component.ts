import { Component, OnInit } from '@angular/core';
import { Hotel } from '../model/hotel';
import { Address } from '../model/address';
import { Room } from '../model/room';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../service/api.service';
import { AuthService } from '../auth.service';
import {Score} from "../model/score";
import { element } from 'protractor';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-form-hah',
  templateUrl: './form-hah.component.html',
  styleUrls: ['./form-hah.component.css']
})
export class FormHaHComponent implements OnInit {

  HaH =
    {
      User: '',
      Type: '',
      Name: '',
      Stars: '',
      Region: '',
      Accepted: false,
      Address: { City: '', Street: '' },
      Scores: Array<Score>(),
      Rooms: Array<Room>(),
      Extras: Array<string>(),
      Images: Array<string>(),
      Views: 0
    }
    loaded = false;
    id;
    private readonly notifier: NotifierService;

  constructor(private auth: AuthService,private apiService: ApiService, private router: Router, private activatedroute: ActivatedRoute,notifierService: NotifierService) {

    this.notifier = notifierService;
    this.activatedroute.queryParams.subscribe(v => {
      
     

      if(v.id ){
        this.apiService.getHaH(v.id).subscribe(data => {

          if(this.auth.getUserId() != data.User && !this.auth.isAdmin)
            this.router.navigate(['search']);
          this.HaH = data;
          this.id = data._id;
          this.loaded = true;
        });
      }else{
        this.addRoom();
        this.addExtras();
        this.addImage();
        this.HaH.User = this.auth.getUserId();
        this.loaded = false;
      }

    });




  }

  ngOnInit(): void {
  }

  addRoom() {
    this.HaH.Rooms.push({
      Number: null,
      Size: null,
      NumberOfBeds: null,
      Price: null,
      Vip: false,
      Visible : true,
      Reservations : []
    })
    this.notifier.notify("info", "Added Room");
  }

  deleteRoom(nr : number) {
    this.HaH.Rooms.splice(nr,1);
    this.notifier.notify("warning", "Deleted Room");
  }

  addExtras() {
    this.HaH.Extras.push('');
    this.notifier.notify("info", "Added Extra");
  }

  deleteExtras(nr:number) {
    this.HaH.Extras.splice(nr,1);
    this.notifier.notify("warning", "Deleted Extra");
  }

  addImage() {
    this.HaH.Images.push('');
    this.notifier.notify("info", "Added Image");
  }
  deleteImage(nr:number) {
    this.HaH.Images.splice(nr,1);
    this.notifier.notify("warning", "Deleted Image");
  }

  create() {
   if(!this.chechHaH()){
     this.apiService.createHaH(this.HaH).subscribe(data => console.log(data))
     this.router.navigate(['search'], {queryParams: {userid: this.auth.getUserId()}});
     this.notifier.notify("success", "Created Succesfully");
    }

  }
  update(){

    if(!this.chechHaH()){
    this.apiService.updateHaH(this.id,this.HaH).subscribe(data => console.log(data))
    this.notifier.notify("success", "Updated Succesfully");
    window.history.back()
  }
  }

  delete(){
    if (!confirm('Do you want to delete this Hotel or Hostel Permanently? '))
    return;
    this.apiService.deleteHaH(this.id).subscribe(data => console.log(data));
    this.router.navigate(['search'], {queryParams: {userid: this.auth.getUserId()}});
    this.notifier.notify("success", "Deleted Succesfully");
  }

  chechHaH(){
    let error = false;
    if (this.HaH.Name == "" || this.HaH.Stars == "" || this.HaH.Address.City == "" || this.HaH.Address.Street == "" || this.HaH.Region == "" 
    || this.HaH.Region == "" || this.HaH.Rooms.length == 0 || this.HaH.Extras.length == 0 || this.HaH.Images.length == 0 || this.HaH.Type == "") {
      this.notifier.notify("error", "Fill all empty spaces!");
      error = true;
      return error;
    }
  
if(parseInt(this.HaH.Stars) < 1 || parseInt(this.HaH.Stars) > 5){
  this.notifier.notify("error", "Stars mus be between 1 and 5");
   error = true;
    return error;
    }

   
      this.HaH.Rooms.forEach(element => {
        if (element.Number == null || element.NumberOfBeds == null || element.Price == null || element.Size == null) { 
          this.notifier.notify("error", "Fill empty spaces in Rooms!");
          error = true;
          return
        }
      });
      this.HaH.Extras.forEach(element => {
        if (element == "") {
          this.notifier.notify("error", "Fill empty spaces in Extras!");
          error = true;
          return error;
        }
      });


      this.HaH.Images.forEach(element => {
        if (element == "") {
          this.notifier.notify("error", "Fill empty spaces in Images!");
          error = true;
          return error;
        }
      });

      this.HaH.Stars = this.HaH.Stars.toString();
    return error;

   

    }



    starsHotel(){
        this.HaH.Stars = ""
        document.getElementById("stars").hidden = false;
    }

    starsHostel(){
      this.HaH.Stars = "-"
      document.getElementById("stars").hidden = true;
    }

}
