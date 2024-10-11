import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HousingService } from '../housing.service';
import { HousingLocation } from '../HousingLocation';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { CityInputComponent } from './city-input/city-input.component';
import { FirebaseService } from '../firebase.service';
import { CloseButtonComponent } from '../ui/button/close-button/close-button.component';
import { HousingEditPhotoComponent } from './housing-edit-photo/housing-edit-photo.component';
import { HousingEditLatLonComponent } from './housing-edit-lat-lon/housing-edit-lat-lon.component';
import { AddressInputComponent } from './address-input/address-input.component';
import { AddressApiResult } from '../AddressApiResult';
import { data } from 'jquery';

@Component({
  selector: 'app-housing-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgIf,
    NgClass,
    CityInputComponent,
    AddressInputComponent,
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
  @ViewChild('address', { static: true }) address!: AddressInputComponent;

  param!: any;
  id!: string;
  housingLocation!: HousingLocation;
  editForm = this.formBuilder.group({
    photos: this.formBuilder.array<FormArray>([]),
    name: ['', Validators.required],
    city: ['', Validators.required],
    street: ['', Validators.required],
    houseNumber: [0, Validators.required],
    address: ['', Validators.required],
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
    // console.log(this.id);

    var locObs;
    if (this.id != undefined) {
      locObs = this.housingService.getHousingLocationById(this.id);
    } else {
      locObs = this.housingService.getNewLocation();
    }

    locObs.subscribe((location) => {
      this.housingLocation = location;
      console.log(location);
      if (this.housingLocation.photos)
        for (let photo of this.housingLocation.photos) {
          this.photos.addPhotoControl();
        }
      this.editForm.patchValue(Object(this.housingLocation));
    });

    this.address.addressChange.subscribe((addressData: AddressApiResult) => {
      // console.log('addressChange', addressData);
      // console.log('editformValue', this.editForm.value);
      let newValues: HousingLocation = {
        address: addressData.properties.label,
        houseNumber: Number(addressData.properties.housenumber),
        street: addressData.properties.street,
        postalCode: addressData.properties.postcode,
        city: addressData.properties.city,
      };
      // console.log('coords',this.editForm.get('coords.lat')?.value);
      newValues.coords = {
        lat: addressData.geometry.coordinates[1],
        lon: addressData.geometry.coordinates[0],
      };

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
    housingData.city_insensitive = housingData.city!.toLowerCase();
    housingData.street_insensitive = housingData.street!.toLowerCase();
    housingData.address_insensitive = housingData.address!.toLowerCase();

    var obs;
    if (this.id) {
      obs = this.housingService.editHousingLocation(this.id, housingData);
    } else {
      obs = this.housingService.addHousingLocation(housingData);
    }

    obs.subscribe({
      complete: () => {
        // TODO: navigation base on referrer
        this.router.navigateByUrl('/');
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
