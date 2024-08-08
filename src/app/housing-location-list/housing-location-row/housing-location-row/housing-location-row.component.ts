import { Component, ElementRef, Input, OnInit, inject } from '@angular/core';
import { HousingLocation } from '../../../HousingLocation';
import { RouterLink } from '@angular/router';
import { HousingService } from '../../../housing.service';

@Component({
  selector: '[app-housing-location-row]',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './housing-location-row.component.html',
  styleUrl: '../../housing-location-list.component.css',
  host: {
    '[class.selected]': 'selected',
    '(click)' : 'selectRow($event)'
  },
})
export class HousingLocationRowComponent implements OnInit {
  @Input() housingLocation!: HousingLocation;
  housingService = inject(HousingService);
  elementRef = inject(ElementRef);
  selected = false;

  constructor() {
    console.log('cest parti');
  }

  ngOnInit(): void {}

  selectRow(event: any) {
    this.selected = !this.selected;
  }

  delete(id: string) {
    this.housingService.deleteHousingLocation(id);
  }
}
