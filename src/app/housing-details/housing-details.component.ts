import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HousingLocation } from '../HousingLocation';
import { HousingService } from '../housing.service';
import { LocationDetailsComponent } from '../location-details/location-details.component';
import { IsOptionAvailableComponent } from '../is-option-available/is-option-available.component';
import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-housing-details',
  standalone: true,
  imports: [LocationDetailsComponent,IsOptionAvailableComponent,RouterLink,NgFor],
  template: `
      @if(housingLocation){
        <a class="action-link" [routerLink]="['']">Back</a>
      <section>
        <div id="photo-container">
          <img *ngFor="let photo of housingLocation.photos" src="{{photo}}"/>
        </div>
        <p>{{housingLocation.name}}</p>
        <app-location-details [address]="housingLocation.address" />
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
    housingService.getHousingLocationById(this.params['id'])
      .subscribe(location => {
        this.housingLocation = location
    })
  }

  displayApplyForm() {
    
  }
  
}
