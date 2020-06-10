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
import { AdministrationPanelComponent } from './administration-panel/administration-panel.component';
import { UserRegistrationPanelComponent } from './user-registration-panel/user-registration-panel.component';
import { UserEditPanelComponent } from './user-edit-panel/user-edit-panel.component';
import { HahDetailsComponent } from './hah-details/hah-details.component';
import { NotifierModule, NotifierOptions } from "angular-notifier";
import { SearchRememberService } from './search-remember.service';

const customNotifierOptions: NotifierOptions = {
  position: {
		horizontal: {
			position: 'right',
		},
	},
};

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    DetailsComponent,
    HomeComponent,
    NavBarComponent,
    FormHaHComponent,
    AdministrationPanelComponent,
    UserRegistrationPanelComponent,
    UserEditPanelComponent,
    HahDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatSortModule,
    BrowserAnimationsModule,
    Ng5SliderModule,
    NotifierModule.withConfig(customNotifierOptions)
 
  ],
  providers: [ApiService,SearchRememberService],
  bootstrap: [AppComponent]
})
export class AppModule { }
