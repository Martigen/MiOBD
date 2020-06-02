import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';   
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListComponent } from './list/list.component';
import { ApiService } from './service/api.service';
import { HttpClientModule } from '@angular/common/http';
import { MatSortModule } from '@angular/material/sort';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { Ng5SliderModule } from 'ng5-slider';
import { DetailsComponent } from './details/details.component';
import { HomeComponent } from './home/home.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FormHaHComponent } from './form-ha-h/form-hah.component';




@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    DetailsComponent,
    HomeComponent,
    NavBarComponent,
    FormHaHComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatSortModule,
    BrowserAnimationsModule,
    Ng5SliderModule,
 
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
