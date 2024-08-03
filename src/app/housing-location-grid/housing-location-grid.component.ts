import { Component, EventEmitter, Input, OnInit, Output,  } from '@angular/core';
import { HousingLocation } from '../HousingLocation';
import { RouterModule } from '@angular/router';
import { LocationDetailsComponent } from '../location-details/location-details.component';
import { HousingService } from '../housing.service';
import { Queryoptions } from '../queryoptions';

@Component({
  selector: 'app-housing-location-grid',
  standalone: true,
  imports: [RouterModule, LocationDetailsComponent],
  template: `
  <div>
    <div class="orderBy">
      <select name="orderBy" ngModel (change)="orderBy($event)">
        <option value="">Order by</option>
        <option value="name">Name</option>
        <option value="city">City</option>
        <option value="state">State</option>
        <option value="availableUnits">Available Units</option>
      </select>
    </div>
    <section class="grid">
      @for(housingLocation  of housingList; track housingList){
      <div class="housing-location-card" [routerLink]="['details',housingLocation.id]">
        <img  class="housing-photo" src="{{housingLocation.photo}}"/>
        <div class="details">
          <h2>{{housingLocation.name}}</h2>
          <app-location-details [city]="housingLocation.city" [state]="housingLocation.state"/>
          <!-- <a class="primary-link" [routerLink]="['details',housingLocation.id]">See details</a>   -->
          <a class="edit-btn secondary" [routerLink]="['edit',housingLocation.id]">Edit</a>
        </div>
      </div>
      }
    </section>
  </div>
  `,
  styleUrl: './housing-location-grid.component.css'
})
export class HousingLocationGridComponent{
  @Input() housingList!: HousingLocation[]
  @Output() onOrderBy = new EventEmitter<any>()
  constructor(private housingService: HousingService) {
    
  }

  orderBy(event:any) {
    console.log(event.target.value)
    let param :Queryoptions = {}
    // if(event.target.value == '') this.housingService.clearOrdering()
    // else param = { order: { order: 'ASC', by: event.target.value } }
    this.onOrderBy.emit(param)
    // this.housingService.getHousingLocationList(param)
    //   .then((reponse) => {
    //     this.housingList = reponse
    // })
  }

}
