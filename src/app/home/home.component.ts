import { Component,OnInit,effect,inject } from '@angular/core';
import { HousingLocation } from '../HousingLocation';
import { HousingLocationGridComponent } from '../housing-location-grid/housing-location-grid.component';
import { HousingService } from '../housing.service';
import { RouterLink } from '@angular/router';
import { HousingLocationListComponent } from '../housing-location-list/housing-location-list.component';
import { HomeCustomisationService } from './home-customisation.service';
import { NgClass, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Queryoptions } from '../queryoptions';
import { FirebaseService } from '../firebase.service';
import { SorterService } from '../list-sorter-heading/sorter.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HousingLocationGridComponent,
    HousingLocationListComponent,
    RouterLink,
    NgClass,
    FormsModule,
    NgStyle,
  ],
  styleUrl: './home.component.css',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit{
  housingList: HousingLocation[] = [];
  displayType: string;
  searchInput: string = '';
  firebaseService = inject(FirebaseService);
  housingService = inject(HousingService);
  customisationService = inject(HomeCustomisationService);
  sorterService = inject(SorterService)
  
  constructor() {
    this.displayType = this.customisationService.getDisplayType();
  }

  ngOnInit(): void {
    this.housingService.getLocations()
  }

  display(type: string) {
    console.log(type, 'display');
    this.displayType = type;
    this.customisationService.setDisplayType(type);
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
    this.housingService.clearSearch()
    // this.sorterService.clearOrder()
  }

  // searchInputChange(value:any) {
  //   console.log(value)
  // }
}

