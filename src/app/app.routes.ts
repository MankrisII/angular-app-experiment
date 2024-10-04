import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HousingDetailsComponent } from './housing-details/housing-details.component';
import { HousingEditComponent } from './housing-edit/housing-edit.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home',
  },
  {
    path: 'details/:id',
    component: HousingDetailsComponent,
    title: 'housing Details',
  },
  {
    path: 'edit/:id',
    component: HousingEditComponent,
    title: 'Housing Edit',
  },
  {
    path: 'edit',
    component: HousingEditComponent,
    title: 'Housing New',
  },
  {
    path: '**',
    component: PageNotFoundComponent,
    title: 'Page note found',
  },
];
