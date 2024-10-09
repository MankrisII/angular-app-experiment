import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HousingDetailsComponent } from './housing-details/housing-details.component';
import { HousingEditComponent } from './housing-edit/housing-edit.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HousingLocationGridComponent } from './housing-location-grid/housing-location-grid.component';
import { HousingLocationListComponent } from './housing-location-list/housing-location-list.component';
import { HousingLocationMapComponent } from './housing-location-map/housing-location-map.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home',
    children: [
      {
        path: 'grid',
        component: HousingLocationGridComponent,
        title: 'grid',
      },
      {
        path: 'list',
        component: HousingLocationListComponent,
        title: 'list',
      },
      {
        path: 'map',
        component: HousingLocationMapComponent,
      },
      {
        path: '',
        redirectTo: '/list',
        pathMatch: 'full',
      },
    ],
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
