import { Component, EventEmitter, inject, Output,  } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LocationDetailsComponent } from '../location-details/location-details.component';
import { HousingService } from '../housing.service';
import { Queryoptions } from '../queryoptions';
import { HousinglocationCardComponent } from './housinglocation-card/housinglocation-card.component';

@Component({
  selector: 'app-housing-location-grid',
  standalone: true,
  imports: [
    RouterModule,
    LocationDetailsComponent,
    HousinglocationCardComponent,
  ],
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
        @for(housingLocation of housingService.housingListSig(); track housingLocation.id){
        <div app-housinglocation-card [housingLocation]="housingLocation"></div>
        }
      </section>
    </div>
  `,
  styleUrl: './housing-location-grid.component.css',
})
export class HousingLocationGridComponent {
  housingService = inject(HousingService);
  @Output() onOrderBy = new EventEmitter<any>();
  constructor() {}

  orderBy(event: any) {
    console.log(event.target.value);
    let param: Queryoptions = {};
    // if(event.target.value == '') this.housingService.clearOrdering()
    // else param = { order: { order: 'ASC', by: event.target.value } }
    this.onOrderBy.emit(param);
    // this.housingService.getHousingLocationList(param)
    //   .then((reponse) => {
    //     this.housingList = reponse
    // })
  }
}
