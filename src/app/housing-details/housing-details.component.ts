import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HousingLocation } from '../HousingLocation';
import { HousingService } from '../housing.service';
import { LocationDetailsComponent } from '../location-details/location-details.component';
import { IsOptionAvailableComponent } from '../is-option-available/is-option-available.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-housing-details',
  standalone: true,
  imports: [LocationDetailsComponent,IsOptionAvailableComponent,RouterLink],
  template: `
      @if(housingLocation){
        <a class="action-link" [routerLink]="['']">Back</a>
      <section>
        <img src="{{housingLocation.photo}}"/>
        <p>{{housingLocation.name}}</p>
        <app-location-details [city]="housingLocation.city" [state]="housingLocation.state"/>
        <p>Unit available : {{housingLocation.availableUnits}}</p>
        <app-is-option-available label="Wifi available" [value]="housingLocation.wifi"/>
        <app-is-option-available label="Laundry sevice" [value]="housingLocation.laundry"/>
        <button class="primary" (click)="displayApplyForm()" type="button">Apply now</button> -
        <a class="secondary" [routerLink]="['/edit',this.params['id']]">edit</a>
      </section>
      }@else{
        <p>Error</p>
      }

  `,
  styleUrl: './housing-details.component.css'
})
export class HousingDetailsComponent {
  params 
  housingLocation: HousingLocation | undefined
  
  constructor( route: ActivatedRoute, housingService : HousingService) {
    this.params = route.snapshot.params
    this.housingLocation = housingService.getHousingLocationById(this.params['id'])
  }

  displayApplyForm() {
    
  }
  
}
