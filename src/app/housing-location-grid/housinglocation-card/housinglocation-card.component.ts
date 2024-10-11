import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HousingLocation } from '../../HousingLocation';
import { LocationDetailsComponent } from '../../location-details/location-details.component';
import { DocumentSnapshot } from 'firebase/firestore';

@Component({
  selector: '[app-housinglocation-card]',
  standalone: true,
  imports: [RouterModule, LocationDetailsComponent],
  host: {
    class: 'housing-location-card',
  },
  template: `
    <img
      class="housing-photo"
      src="{{
        housinLocationData.photos && housinLocationData.photos[0]
          ? housinLocationData.photos[0]
          : 'assets/3926921.png'
      }}"
    />
    <div class="details">
      <!-- <h2>{{ housingLocation.name }}</h2> -->
      <!-- <app-location-details [address]="housingLocation.address" /> -->
      <div class="address">
        {{ housinLocationData.houseNumber }} {{ housinLocationData.street }}
      </div>
      <!-- <a class="primary-link" [routerLink]="['details',housingLocation.id]">See details</a>   -->
      <div class="actions">
        <a
          class="edit-btn secondary"
          [routerLink]="['/edit', housingLocation.id]"
          >Edit</a
        >
      </div>
    </div>
  `,
  styleUrl: './housinglocation-card.component.css',
})
export class HousinglocationCardComponent {
  @Input()
  set housingLocation(value: DocumentSnapshot) {
    this._housingLocation = value;
    this.housinLocationData = {
      id: value.id,
      ...value.data(),
    } as HousingLocation;
  }

  get housingLocation(): DocumentSnapshot {
    return this._housingLocation;
  }

  _housingLocation!: DocumentSnapshot;
  housinLocationData!: HousingLocation;
}
