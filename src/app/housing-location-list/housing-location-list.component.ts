import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HousingLocation } from '../HousingLocation';
import { Input } from '@angular/core';
import { LocationDetailsComponent } from '../location-details/location-details.component';
import { IsOptionAvailableComponent } from '../is-option-available/is-option-available.component';
import { RouterLink } from '@angular/router';
import { HousingService } from '../housing.service';
import { ListSorterHeadingComponent } from '../list-sorter-heading/list-sorter-heading.component';
import { Queryoptions } from '../queryoptions';
import { SorterOptions } from '../list-sorter-heading/sorter-options';


@Component({
  selector: 'app-housing-location-list',
  standalone: true,
  imports: [
    LocationDetailsComponent,
    IsOptionAvailableComponent,
    RouterLink,
    ListSorterHeadingComponent,
  ],
  template: `
    <section class="housingList list">
      <table class="housing-location-list">
        <tr>
          <th><input type="checkbox" /></th>
          @for( col of columns;track col){
          <th class="{{ col.class }}">
            <app-list-sorter-heading [options]="col" (onSort)="this.onSort.emit($event)" />
          </th>
          }
        </tr>
        @for(housingLocation of housingList;track housingLocation){
        <tr class="housing-location-list">
          <td><input type="checkbox" /></td>
          <td class="photo"><img src="{{ housingLocation.photo }}" /></td>
          <td class="name">{{ housingLocation.name }}</td>
          <td class="city">{{ housingLocation.city }}</td>
          <td class="state">{{ housingLocation.state }}</td>
          <td class="available-units">{{ housingLocation.availableUnits }}</td>
          <td class="wifi">@if(housingLocation.wifi){yes}@else{no}</td>
          <td class="laundry">@if(housingLocation.laundry){yes}@else{no}</td>
          <td class="actions">
            <a class="actionLink" [routerLink]="['details', housingLocation.id]"
              >Details</a
            >
            -
            <a class="actionLink" [routerLink]="['edit', housingLocation.id]"
              >Edit</a
            >
            -
            <a class="actionLink" (click)="delete(housingLocation.id)"
              >Delete</a
            >
          </td>
        </tr>
        }
      </table>
    </section>
  `,
  styleUrl: './housing-location-list.component.css',
})
export class HousingLocationListComponent implements OnInit {
  @Input() housingList!: HousingLocation[];
  @Output() onSort = new EventEmitter()
  housingService = inject(HousingService);

  columns: SorterOptions[] = [
    { label: 'Photo', sortable: false, sortOn: '', class: 'photo' },
    { label: 'Name', sortable: true, sortOn: 'name', class: 'name' },
    { label: 'City', sortable: true, sortOn: 'city', class: 'city' },
    { label: 'State', sortable: true, sortOn: 'state', class: 'state' },
    {
      label: 'Unit Available',
      sortable: true,
      sortOn: 'availableUnits',
      class: 'available-unit',
    },
    { label: 'Wifi', sortable: true, sortOn: 'wifi', class: 'wifi' },
    { label: 'Laundry', sortable: true, sortOn: 'laundry', class: 'laundry' },
    { label: 'Actions', sortable: false, sortOn: '', class: 'actions' },
  ];
  constructor() {}
  ngOnInit() {}
  
  delete(id: string) {
    this.housingService.deleteHousingLocation(id);
  }
}
