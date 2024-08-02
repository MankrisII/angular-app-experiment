import { Component,OnInit,inject } from '@angular/core';
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
  template: `
    <div id="form-container">
      <form
        id="searchForm"
        #searchForm="ngForm"
        (ngSubmit)="search(searchInput)"
      >
        <input
          type="text"
          name="searchInput"
          [(ngModel)]="searchInput"
          placeholder="Search by housing name"
        />
        <!-- two way databindig example with formControl -->
        <!-- <p>{{searchInput}}</p> -->
        <button class="primary primary-right" type="submit">Search</button>
        <a
          class="actionLink clearSearchButton"
          (click)="clearSearch()"
          [ngStyle]="{ display: searchInput != '' ? 'inline' : 'none' }"
        ></a>
        <!-- <a class="actionLink clearSearchButton" (click)="clearSearch()" ></a> -->
      </form>
    </div>
    <a id="add-location-button" class="primary" [routerLink]="['edit']"
      >Add location</a
    >
    <div style="float: right;">
      <a
        class="primary primary-left"
        [ngClass]="displayType == 'list' ? 'inactiv' : ''"
        (click)="display('list')"
        >list</a
      >
      <a
        class="primary primary-right"
        [ngClass]="displayType == 'grid' ? 'inactiv' : ''"
        (click)="display('grid')"
        >grid</a
      >
    </div>
    @if(this.customisationService.getDisplayType() == "grid"){
    <app-housing-location-grid [housingList]="housingList" />
    }@else {
    <app-housing-location-list [housingList]="housingList" />
    }
  `,
})
export class HomeComponent implements OnInit{
  housingList: HousingLocation[] = [];
  displayType: string;
  searchInput: string = '';
  firebaseService = inject(FirebaseService);
  housingService = inject(HousingService);
  customisationService = inject(HomeCustomisationService);

  constructor() {
    this.displayType = this.customisationService.getDisplayType();
  }

  ngOnInit(): void {
    this.firebaseService.getLocation().subscribe((locations) => {
      
      this.housingService.setLocations(locations);
      this.housingList = locations
      console.log(this.housingList);
    });
  }

  display(type: string) {
    console.log(type, 'display');
    this.displayType = type;
    this.customisationService.setDisplayType(type);
  }

  search(value: any) {
    let q: Queryoptions = { filterByName: value };

    this.housingService.getHousingLocationList(q).then((response) => {
      this.housingList = response;
    });
  }

  clearSearch() {
    this.searchInput = '';
    this.search('');
  }

  // searchInputChange(value:any) {
  //   console.log(value)
  // }
}

