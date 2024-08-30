import { Component, ElementRef, Input, OnInit, computed, inject } from '@angular/core';
import { HousingLocation } from '../../../HousingLocation';
import { RouterLink } from '@angular/router';
import { HousingService } from '../../../housing.service';
import { FirebaseAuthService } from '../../../firebase.auth.service';

@Component({
  selector: '[app-housing-location-row]',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './housing-location-row.component.html',
  styleUrl: '../../housing-location-list.component.css',
  host: {
    '[class.selected]': 'selected',
    '(click)': 'selectRow($event)',
  },
})

  // TODO
  // row actions button listen on
  // firebaseAutComponent.user signal to display or hide
  // that cause reload hoising list the number of the item
  
export class HousingLocationRowComponent implements OnInit {
  @Input() housingLocation!: HousingLocation;
  @Input() selected:boolean = false;
  housingService = inject(HousingService);
  elementRef = inject(ElementRef);
  fireaseAuth = inject(FirebaseAuthService);
  

  constructor() {
    //console.log('cest parti');
  }

  ngOnInit(): void {}

  selectRow(event: any) {
    this.selected = !this.selected;
  }

  delete(id: string) {
    this.housingService.deleteHousingLocation(id);
  }
}
