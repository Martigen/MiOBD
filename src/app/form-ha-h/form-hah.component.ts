import { Component, OnInit } from '@angular/core';
import { Hotel } from '../model/hotel';
import { Address } from '../model/address';
import { Room } from '../model/room';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../service/api.service';
import { AuthService } from '../auth.service';

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
      Address: { City: '', Street: '' },
      Scores: [],
      Rooms: Array<Room>(),
      Extras: Array<string>(),
      Images: Array<string>(),
      Views: 0
    }
    loaded = false;
    id;


  constructor(private auth: AuthService,private apiService: ApiService, private router: Router, private activatedroute: ActivatedRoute) {


    this.activatedroute.queryParams.subscribe(v => {
      
     

      if(v.id ){
        this.apiService.getHaH(v.id).subscribe(data => {

          if(this.auth.getUserId() != data.User)
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
      Vip: false
    })
  }

  deleteRoom() {
    this.HaH.Rooms.pop();
  }

  addExtras() {
    this.HaH.Extras.push('');
  }

  deleteExtras() {
    this.HaH.Extras.pop();
  }

  addImage() {
    this.HaH.Images.push('');
  }
  deleteImage() {
    this.HaH.Images.pop();
  }

  create() {

   if(!this.chechHaH()){
     this.apiService.createHaH(this.HaH).subscribe(data => console.log(data))
     this.router.navigate(['search'], {queryParams: {userid: this.auth.getUserId()}});
   
    }else{
      alert("error");
     }

  }
  update(){

    if(!this.chechHaH()){
    this.apiService.updateHaH(this.id,this.HaH).subscribe(data => console.log(data))
    window.history.back()
  }else{
    alert("error");
   }
  }

  delete(){
    if (!confirm('Do you want to delete this Hotel or Hostel Permanently? '))
    return;
    this.apiService.deleteHaH(this.id)
  }

  chechHaH(){
    let error = false;
    if (this.HaH.Name == "" || this.HaH.Stars == "" || this.HaH.Address.City == "" || this.HaH.Address.Street == "" || this.HaH.Region == "" 
    || this.HaH.Region == "" || this.HaH.Rooms.length == 0 || this.HaH.Extras.length == 0 || this.HaH.Images.length == 0 || this.HaH.Type == "") {
      error = true;
      return error;
    }
      this.HaH.Rooms.forEach(element => {
        if (element.Number == null || element.NumberOfBeds == null || element.Price == null || element.Size == null) { 
          error = true;
          return
        }
      });
      this.HaH.Extras.forEach(element => {
        if (element == "") {
          error = true;
          return error;
        }
      });


      this.HaH.Images.forEach(element => {
        if (element == "") {
          error = true;
          return error;
        }
      });

    return error;

   
    }

}
