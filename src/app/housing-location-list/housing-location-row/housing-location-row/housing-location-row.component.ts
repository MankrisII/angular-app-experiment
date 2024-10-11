import {
  Component,
  ElementRef,
  Input,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import { HousingLocation } from '../../../HousingLocation';
import { RouterLink } from '@angular/router';
import { HousingService } from '../../../housing.service';
import { FirebaseAuthService } from '../../../firebase.auth.service';
import { DocumentSnapshot } from 'firebase/firestore';

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
  @Input()
  set housingLocation(docSnap: DocumentSnapshot) {
    this._housingLocationDoc = docSnap;
    this._housingLocationData = {
      id: docSnap.id,
      ...docSnap.data(),
    } as HousingLocation;
  }
  get housingLocation(): HousingLocation {
    return this._housingLocationDoc;
  }
  _housingLocationDoc!: DocumentSnapshot;
  _housingLocationData!: HousingLocation;

  @Input() selected: boolean = false;
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
