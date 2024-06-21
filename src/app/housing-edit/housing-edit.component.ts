import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HousingService } from '../housing.service';
import { HousingLocation } from '../HousingLocation';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-housing-edit',
  standalone: true,
  imports: [ReactiveFormsModule,RouterLink],
  template: `
    <form [formGroup]="editForm" (ngSubmit)="submit()">
    <label for="name">Name : </label>
      <input type="text" id="name" formControlName="name">
      <br/>  
    <label for="photo">Photo : </label>
      <input id="photo" type="text" formControlName="photo">
      <br/>
      <label for="city">City : </label>
      <input type="text" id="city" formControlName="city">
      <br/>
      
      <label for="state">State : </label>
      <input type="text" id="state" formControlName="state">
      <br/>
      <label for="availableUnits">Available units : </label>
      <input type="text" id="availableUnits" formControlName="availableUnits">
      <br/>
      <label for="wifi">Wifi : </label>
      <input type="checkbox" id="wifi" formControlName="wifi">
      <br/>
      <label for="laundry">Laundry : </label>
      <input type="checkbox" id="laundry" formControlName="laundry">
      <br/>
      <button class="primary" type="submit" [disabled]="!editForm.valid">submit</button>
      <button class="secondary" type="button" [routerLink]="['']">discard</button>
    </form>
  `,
  styleUrl: './housing-edit.component.css'
})
export class HousingEditComponent {
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

  constructor(
    private route: ActivatedRoute,
    private housingService: HousingService,
    private formBuilder: FormBuilder,
    private router : Router) {
      
    this.param = route.snapshot.params
    this.housingLocation = housingService.getHousingLocationById(this.param['id']) 
    this.editForm.setValue(Object(this.housingLocation)) 
    
  }

  submit() {
    console.log(this.editForm.value)
    if (this.param['id'] !== undefined) {
      this.housingService.editHousingLocation(this.editForm.value as HousingLocation)
    } else {
      this.housingService.addHousingLocation(this.editForm.value as HousingLocation)
    }
    this.router.navigateByUrl('/')
  }
}
