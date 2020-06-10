import { Injectable } from '@angular/core';
import { Hotel } from './model/hotel';

@Injectable({
  providedIn: 'root'
})
export class SearchRememberService {

  value: Array<Hotel>
  czy = false; 

  city: Array<string>
  from: Array<string>
  to: Array<string>
  constructor() { }


  setCFT(c,f,t){
    this.city = c;
    this.to = t;
    this.from = f;
  }


  getCity(){
    return this.city;
  }

  getFrom(){
    return this.from;
  }

  getTo(){
    return this.to;
  }

  set(val){
    this.value = val;
    this.czy = true;
  }

  get(){
    return this.value
  }

  close(){
    this.czy = false;
    this.value = [];
    this.city = [];
    this.to = [];
    this.from = [];
  }

  check(){
    return this.czy;
  }
}
