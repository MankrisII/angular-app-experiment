import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HousingService } from '../housing.service';
import { HousingLocation } from '../HousingLocation';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgClass, NgIf } from '@angular/common';
import { CityInputComponent } from './city-input/city-input.component';

@Component({
  selector: 'app-housing-edit',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink,NgIf,NgClass, CityInputComponent],
  templateUrl : './housing-edit.component.html',
  styleUrl: './housing-edit.component.css'
})
export class HousingEditComponent implements OnInit {
  route = inject(ActivatedRoute)
  housingService = inject(HousingService)
  formBuilder = inject(FormBuilder)
  router = inject(Router)
  http = inject(HttpClient)

  param
  housingLocation: HousingLocation | undefined
  editForm = this.formBuilder.group({
    id:[''],
    photo: ['', Validators.required],
    name:['',Validators.required],
    city: ['',Validators.required],
    state: ['',Validators.required],
    availableUnits: [0,[Validators.required,Validators.pattern("[0-9]*")]],
    wifi: [false],
    laundry: [false]
  })

  constructor() {
    this.param = this.route.snapshot.params
    console.log('id', this.param['id']);
    if (this.param['id'] != undefined) {
      this.housingLocation = this.housingService.getHousingLocationById(this.param['id'])
    } else {
      this.housingLocation = this.housingService.getNewLocation();
    }
    this.editForm.setValue(Object(this.housingLocation)) 
  }

  ngOnInit(): void {
   
  }

  submit() {
    console.log('submit',this.editForm.value)
    if (this.param['id'] !== undefined) {
      this.housingService.editHousingLocation(this.editForm.value as HousingLocation)
    } else {
      this.housingService.addHousingLocation(this.editForm.value as HousingLocation)
    }
    this.router.navigateByUrl('/')
  }
}
