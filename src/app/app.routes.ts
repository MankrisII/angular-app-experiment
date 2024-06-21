import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HousingDetailsComponent } from './housing-details/housing-details.component';
import { HousingEditComponent } from './housing-edit/housing-edit.component';

export const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    title : "Home"
  },
  {
    path: "details/:id",
    component: HousingDetailsComponent,
    title : "housing Details"
  },
  {
    path: "edit/:id",
    component: HousingEditComponent,
    title : 'Housing Edit'
  },
   {
    path: "edit",
    component: HousingEditComponent,
    title : 'Housing New'
  }
];
