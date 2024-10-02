import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { HousingLocation } from '../HousingLocation';
import { Input } from '@angular/core';
import { LocationDetailsComponent } from '../location-details/location-details.component';
import { IsOptionAvailableComponent } from '../is-option-available/is-option-available.component';
import { RouterLink } from '@angular/router';
import { HousingService } from '../housing.service';
import { ListSorterHeadingComponent } from '../list-sorter-heading/list-sorter-heading.component';
import { Queryoptions } from '../queryoptions';
import { SorterOptions } from '../list-sorter-heading/sorter-options';
import { HousingLocationRowComponent } from './housing-location-row/housing-location-row/housing-location-row.component';


@Component({
  selector: 'app-housing-location-list',
  standalone: true,
  imports: [
    LocationDetailsComponent,
    IsOptionAvailableComponent,
    RouterLink,
    ListSorterHeadingComponent,
    HousingLocationRowComponent,
    NgFor,
  ],
  template: `
    <section class="housingList list">
      <table class="housing-location-list">
        <tr>
          <th><input type="checkbox" (click)="selectAllRows()" [checked]="this.allRowSelected"/></th>
          @for( col of columns;track col){
          <th class="{{ col.class }}">
            <app-list-sorter-heading
              [options]="col"
              (onSort)="this.onSort.emit($event)"
            />
          </th>
          }
        </tr>
        <tr
          *ngFor="let housingLocation of housingList"
          class="housing-location-list-row"
          app-housing-location-row
          [housingLocation]="housingLocation"
          [selected]="this.allRowSelected"
        ></tr>
      </table>
    </section>
  `,
  styleUrl: './housing-location-list.component.css',
})
export class HousingLocationListComponent implements OnInit {
  @Input() housingList!: HousingLocation[];
  @Output() onSort = new EventEmitter();
  housingService = inject(HousingService);
  allRowSelected = false

  columns: SorterOptions[] = [
    { label: 'Photo', sortable: false, sortOn: '', class: 'photo' },
    { label: 'Adress', sortable: true, sortOn: 'adress', class: 'adress' },
    { label: 'City', sortable: true, sortOn: 'city', class: 'city' },
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

  // selectRow(event: any) {
  //   console.log('selectRow', event);
  //   var target = event.target as HTMLElement;
  //   var parent = target;
  //   console.log('target', target);

  //   var count = 0;
  //   while (parent.tagName != 'TR' && count < 10) {
  //     var parent: HTMLElement = parent.parentElement as HTMLElement;
  //     console.log('parent', parent);
  //     count++;
  //   }

  //   var check = parent.getElementsByClassName(
  //     'rowCheck'
  //   )[0] as HTMLInputElement;
  //   check.checked = !check.checked;
  //   console.log('check', check);
  // }

  selectAllRows() {
    console.log("selectAllRows")
    this.allRowSelected = !this.allRowSelected
    
  }

  delete(id: string) {
    this.housingService.deleteHousingLocation(id);
  }
}
