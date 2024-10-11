import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { HousingLocation } from '../HousingLocation';
import { HousingLocationGridComponent } from '../housing-location-grid/housing-location-grid.component';
import { HousingService } from '../housing.service';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HousingLocationListComponent } from '../housing-location-list/housing-location-list.component';
import { HomeCustomisationService } from './home-customisation.service';
import { NgClass, NgStyle } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FirebaseService } from '../firebase.service';
import { SorterService } from '../list-sorter-heading/sorter.service';
import { CloseButtonComponent } from '../ui/button/close-button/close-button.component';
import { HousingLocationMapComponent } from '../housing-location-map/housing-location-map.component';
import { AddressInputComponent } from '../housing-edit/address-input/address-input.component';
import { AddressApiResult } from '../AddressApiResult';
import { Queryoptions } from '../queryoptions';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HousingLocationGridComponent,
    HousingLocationListComponent,
    HousingLocationMapComponent,
    RouterLink,
    ReactiveFormsModule,
    RouterLinkActive,
    NgClass,
    FormsModule,
    NgStyle,
    CloseButtonComponent,
    RouterOutlet,
    AddressInputComponent,
  ],
  styleUrl: './home.component.css',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  housingList: HousingLocation[] = [];
  firebaseService = inject(FirebaseService);
  housingService = inject(HousingService);
  customisationService = inject(HomeCustomisationService);
  sorterService = inject(SorterService);
  formBuilder = inject(FormBuilder);
  @ViewChild('search', { static: true }) searchInput!: AddressInputComponent;
  searchForm = this.formBuilder.group({
    search: ['', Validators.required],
  });

  constructor() {}

  ngOnInit(): void {
    // this.housingService.getLocations()
    this.searchInput.addressChange.subscribe((address: AddressApiResult) => {
      console.log(address);

      if (!address.properties.housenumber) {
        let queryOption: Queryoptions = { ...this.housingService.queyOptions };
        queryOption.street_insensitive =
          address.properties.street.toLocaleLowerCase();

        this.housingService.getLocations(queryOption);
        this.searchForm.patchValue({ search: address.properties.street });
      }
    });
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
    this.searchForm.controls['search'].setValue('');
    this.housingService.clearSearch();
    // this.sorterService.clearOrder()
  }

  // searchInputChange(value:any) {
  //   console.log(value)
  // }
}
