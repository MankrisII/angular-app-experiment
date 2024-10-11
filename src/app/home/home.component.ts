import { Component, OnInit, inject } from '@angular/core';
import { HousingLocation } from '../HousingLocation';
import { HousingLocationGridComponent } from '../housing-location-grid/housing-location-grid.component';
import { HousingService } from '../housing.service';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HousingLocationListComponent } from '../housing-location-list/housing-location-list.component';
import { HomeCustomisationService } from './home-customisation.service';
import { NgClass, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../firebase.service';
import { SorterService } from '../list-sorter-heading/sorter.service';
import { CloseButtonComponent } from '../ui/button/close-button/close-button.component';
import { HousingLocationMapComponent } from '../housing-location-map/housing-location-map.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HousingLocationGridComponent,
    HousingLocationListComponent,
    HousingLocationMapComponent,
    RouterLink,
    RouterLinkActive,
    NgClass,
    FormsModule,
    NgStyle,
    CloseButtonComponent,
    RouterOutlet,
  ],
  styleUrl: './home.component.css',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  housingList: HousingLocation[] = [];
  searchInput: string = '';
  firebaseService = inject(FirebaseService);
  housingService = inject(HousingService);
  customisationService = inject(HomeCustomisationService);
  sorterService = inject(SorterService);

  constructor() {}

  ngOnInit(): void {
    // this.housingService.getLocations()
  }

  // order(event : Queryoptions) {
  //   // this.housingService.getHousingLocationList(event);
  //   this.housingService.sort(event)
  // }

  search(value: any) {
    // let q: Queryoptions = { filterByName: value };
    // this.housingService.getHousingLocationList(q).then((response) => {
    //   this.housingList = response;
    // });
  }

  clearSearch() {
    this.searchInput = '';
    this.housingService.clearSearch();
    // this.sorterService.clearOrder()
  }

  // searchInputChange(value:any) {
  //   console.log(value)
  // }
}
