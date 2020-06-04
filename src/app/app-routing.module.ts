import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { DetailsComponent } from './details/details.component';
import { HomeComponent } from './home/home.component';
import { AuthGuardService } from './auth-guard.service';
import { FormHaHComponent } from './form-ha-h/form-hah.component';
import {AdministrationPanelComponent} from "./administration-panel/administration-panel.component";




const routes: Routes = [

  {
    path: 'search',
    component: ListComponent,
  },
  {
    path: 'administrationPanel',
    component: AdministrationPanelComponent,
  },
  {
    path: 'detail',
    component: DetailsComponent,
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
