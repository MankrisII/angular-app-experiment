import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HousingLocation } from '../../HousingLocation';
import { LocationDetailsComponent } from '../../location-details/location-details.component';

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
          housingLocation.photos && housingLocation.photos[0]
            ? housingLocation.photos[0]
            : 'assets/3926921.png'
        }}"
      />
      <div class="details">
        <h2>{{ housingLocation.name }}</h2>
        <app-location-details [address]="housingLocation.address" />
        <!-- <a class="primary-link" [routerLink]="['details',housingLocation.id]">See details</a>   -->
        <a
          class="edit-btn secondary"
          [routerLink]="['edit', housingLocation.id]"
          >Edit</a
        >
      </div>
  `,
  styleUrl: './housinglocation-card.component.css',
})
export class HousinglocationCardComponent {
  @Input() housingLocation!: HousingLocation
}
