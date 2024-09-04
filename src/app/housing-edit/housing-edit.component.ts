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
import { HousingEditLatLongComponent } from "./housing-edit-lat-long/housing-edit-lat-long.component";

@Component({
  selector: 'app-housing-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgIf,
    NgClass,
    CityInputComponent,
    NgFor,
    CloseButtonComponent,
    CloseButtonComponent,
    HousingEditPhotoComponent,
    HousingEditLatLongComponent
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
  @ViewChild('photos') photos! : HousingEditPhotoComponent;

  param! : any;
  id! : string;
  housingLocation! : HousingLocation ;
  editForm = this.formBuilder.group({
    id: [''],
    photos:  this.formBuilder.array<FormArray>([]),
    name: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    availableUnits: [0, [Validators.required, Validators.pattern('[0-9]*')]],
    wifi: [false],
    laundry: [false],
  });
  
  fileInput = new FormControl();
  htmlFileInput! : HTMLInputElement;

  constructor() {
  }
  
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
      console.log(location);
      if (this.housingLocation.photos)
        for (let photo of this.housingLocation.photos) {
          this.photos.addPhotoControl();
        }
      this.editForm.setValue(Object(this.housingLocation));
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
