import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { DetailsComponent } from './details/details.component';
import { HomeComponent } from './home/home.component';
import { AuthGuardService } from './auth-guard.service';
import { FormHaHComponent } from './form-ha-h/form-hah.component';
import {AdministrationPanelComponent} from "./administration-panel/administration-panel.component";
import {UserRegistrationPanelComponent} from "./user-registration-panel/user-registration-panel.component";
import {UserEditPanelComponent} from "./user-edit-panel/user-edit-panel.component";
import {HahDetailsComponent} from "./hah-details/hah-details.component";
import {ReservationsPanelComponent} from "./reservations-panel/reservations-panel.component";




const routes: Routes = [

  {
    path: 'search',
    component: ListComponent,
  },
  {
    path: 'administrationPanel',
    component: AdministrationPanelComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'reservationsPanel',
    component: ReservationsPanelComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'registration',
    component: UserRegistrationPanelComponent,
  },
  {
    path: 'editAccount',
    component: UserEditPanelComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'detail',
    component: DetailsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'hahDetails',
    component: HahDetailsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'formhah',
    component: FormHaHComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent
  },
  {
    path: '*',
    pathMatch: 'full',
    component: HomeComponent
  },
  {
    path: '**',
    pathMatch: 'full',
    component: HomeComponent
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
