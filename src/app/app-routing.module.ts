import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { DetailsComponent } from './details/details.component';
import { HomeComponent } from './home/home.component';



const routes: Routes = [
  
  { path: 'search', 
  component: ListComponent },
  { path: 'detail', 
  component: DetailsComponent },
  {
    path: '',

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
