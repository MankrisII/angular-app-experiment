import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HousingService } from '../housing.service';
import { HousingLocation } from '../HousingLocation';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { CityInputComponent } from './city-input/city-input.component';
import { FirebaseService } from '../firebase.service';
import { CloseButtonComponent } from "../ui/button/close-button/close-button.component";
import { HousingEditPhotoComponent } from './housing-edit-photo/housing-edit-photo.component';
import { HousingEditLatLonComponent } from "./housing-edit-lat-lon/housing-edit-lat-lon.component";
import { AdressInputComponent } from './adress-input/adress-input.component';
import { AdressApiResult } from '../AdressApiResult';
import { data } from 'jquery';
import { HousingFormData } from './HousingFormData';

@Component({
  selector: 'app-housing-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgIf,
    NgClass,
    CityInputComponent,
    AdressInputComponent,
    NgFor,
    CloseButtonComponent,
    CloseButtonComponent,
    HousingEditPhotoComponent,
    HousingEditLatLonComponent,
  ],
  templateUrl: './housing-edit.component.html',
  styleUrl: './housing-edit.component.css',
})
export class HousingEditComponent implements OnInit {
  route = inject(ActivatedRoute);
  housingService = inject(HousingService);
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  http = inject(HttpClient);
  firebase = inject(FirebaseService);
  photoUrl = '';
  @ViewChild('photos') photos!: HousingEditPhotoComponent;
  @ViewChild('latlong') latlong!: HousingEditLatLonComponent;
  @ViewChild('adress', { static: true }) adress!: AdressInputComponent;

  param!: any;
  id!: string;
  housingLocation!: HousingLocation;
  editForm = this.formBuilder.group({
    id: [''],
    photos: this.formBuilder.array<FormArray>([]),
    name: ['', Validators.required],
    city: ['', Validators.required],
    adress: ['', Validators.required],
    postalCode: ['', Validators.required],
    coords: this.formBuilder.group({
      lat: ['', Validators.required],
      lon: ['', Validators.required],
    }),
    availableUnits: [0, [Validators.required, Validators.pattern('[0-9]*')]],
    wifi: [false],
    laundry: [false],
  });

  fileInput = new FormControl();
  htmlFileInput!: HTMLInputElement;

  constructor() {}

  ngOnInit(): void {
    this.param = this.route.snapshot.params;
    this.id = this.param['id'];
    console.log(this.id);

    var locObs;
    if (this.id != undefined) {
      locObs = this.housingService.getHousingLocationById(this.id);
    } else {
      locObs = this.housingService.getNewLocation();
    }

    locObs.subscribe((location) => {
      this.housingLocation = location;
      //console.log(location);
      if (this.housingLocation.photos)
        for (let photo of this.housingLocation.photos) {
          this.photos.addPhotoControl();
        }
      this.editForm.patchValue(Object(this.housingLocation));
    });

    this.adress.adressChange.subscribe((adressData: AdressApiResult) => {
      console.log('adressChange', adressData);
      // console.log('editformValue', this.editForm.value);
      let newValues : HousingFormData = {
        adress: adressData.properties.name,
        postalCode: adressData.properties.postcode,
        city: adressData.properties.city,
      };
      // console.log('coords',this.editForm.get('coords.lat')?.value);
      newValues.coords = {
        lat: adressData.geometry.coordinates[1],
        lon: adressData.geometry.coordinates[0]
      }

      // console.log('newValues', newValues);
      this.editForm.patchValue(newValues);
      // console.log("editformValue",this.editForm.value)
    });
  }

  submit(event: Event) {
    console.log(event);
    console.log('submit', this.editForm.value);

    this.editForm.disable();

    const housingData = this.editForm.value as HousingLocation;
    var observer;
    if (this.id) {
      observer = this.housingService.editHousingLocation(housingData);
    } else {
      observer = this.housingService.addHousingLocation(housingData);
    }

    observer.subscribe({
      next: (reponse) => {
        this.router.navigateByUrl('/');
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
