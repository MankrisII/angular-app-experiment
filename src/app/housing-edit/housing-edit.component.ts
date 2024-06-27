import { Component, OnInit } from '@angular/core';
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
  param
  housingLocation: HousingLocation | undefined
  editForm = this.formBuilder.group({
    id:[0],
    photo: ['', Validators.required],
    name:['',Validators.required],
    city: ['',Validators.required],
    state: ['',Validators.required],
    availableUnits: [0,[Validators.required,Validators.pattern("[0-9]*")]],
    wifi: [false],
    laundry: [false]
  })
  
  http: HttpClient
  

  constructor(
    private route: ActivatedRoute,
    private housingService: HousingService,
    private formBuilder: FormBuilder,
    private router: Router,
    http:HttpClient) {
    
    this.http = http
    this.param = route.snapshot.params
    this.housingLocation = housingService.getHousingLocationById(this.param['id']) 
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
