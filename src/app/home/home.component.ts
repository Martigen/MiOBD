import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css',"./assets/css/flaticon.css","./assets/css/slicknav.css","./assets/css/animate.min.css","./assets/css/magnific-popup.css","./assets/css/fontawesome-all.min.css","./assets/css/themify-icons.css","./assets/css/slick.css","./assets/css/nice-select.css","./assets/css/style.css"]
})


          
export class HomeComponent implements OnInit {

  city:string = "";

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  search(){
 this.router.navigate(['search'], {queryParams: {city: this.city}});
  }

}
