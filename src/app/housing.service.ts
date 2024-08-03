import { Injectable, OnInit, signal, inject, computed } from '@angular/core';
import { HousingLocation } from './HousingLocation';
import { Queryoptions } from './queryoptions';
import { HttpClient } from '@angular/common/http';
import { FirebaseService } from './firebase.service';
import { SorterService } from './list-sorter-heading/sorter.service';


@Injectable({
  providedIn: 'root',
})
export class HousingService implements OnInit {
  housingListDb: HousingLocation[] = [];
  housingListSig = signal<HousingLocation[]>([]);
  queyOptions: Queryoptions | null = { page: 1, perPage: 5 };
  firebase = inject(FirebaseService);
  sorterService = inject(SorterService)

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // this.firebase.getLocation().subscribe(location => {
    //   this.housingList = location
    // })
  }

  init() {
    this.firebase.getLocation().subscribe((locations) => {
      this.housingListDb = locations;
      this.housingListSig.update((list) => [...list, ...locations]);
      console.log(this.housingListDb);
    });
  }

  searchHousingLocationByName(search: string) {}

  // setLocations(locations: HousingLocation[]) {
  //   this.housingList = locations;
  // }

  search(value: string) {
    this.housingListSig.set(
      this.housingListDb.filter((housing) =>
        housing.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  }

  clearSearch() {
    this.housingListSig.set(this.housingListDb)
    this.sort()
  }

  sort() {
    let sortOn = this.sorterService.sortSig().sortOn;
    let order = this.sorterService.sortSig().order;

    this.housingListSig.update((housings) =>
      housings.sort((a, b) => {
        let type = typeof this.getValueToSort(a, sortOn);
        let aValue = this.getValueToSort(a, sortOn);
        let bValue = this.getValueToSort(b, sortOn);

        switch (type) {
          case 'string':
            if (aValue.toLowerCase() < bValue.toLowerCase()) {
              return order == 'ASC' ? -1 : 1;
            }
            return order == 'ASC' ? 1 : -1;

          case 'number':
            return order == 'DESC' ? aValue - bValue : bValue - aValue;

          case 'boolean':
            if (aValue == true && bValue == true) return 0;
            if (order == 'ASC') return aValue ? 1 : -1;
            if (order == 'DESC') return aValue ? -1 : 1;
        }
        return 0;
      })
    );
  }

  private getValueToSort(
    housingLocation: HousingLocation,
    sortOn: string
  ): any {
    return housingLocation[sortOn as keyof HousingLocation];
  }

  //TODO
  clearSort() {
  }

  getHousingLocationById(id: string) {
      return this.housingListDb.find((h) => h.id == id);
  }

  getNewLocation(): HousingLocation {
    return {
      id: 'null',
      name: '',
      city: '',
      state: '',
      photo: '',
      availableUnits: 0,
      wifi: false,
      laundry: false,
    };
  }

  getOrderBy() {
    return this.queyOptions!.order?.by;
    // if(this.queyOptions.order?.by)
  }

  // getNextId(): number {
  //   return this.housingList[this.housingList.length - 1].id + 1;
  // }

  editHousingLocation(data: HousingLocation) {
    // casting available units valu to Number
    // data.availableUnits = Number(data.availableUnits);
    // let housingIndex = this.housingList.findIndex((h) => h.id == data.id);
    // this.housingList[housingIndex] = data;
  }

  addHousingLocation(data: HousingLocation) {
    // this.housingList.push(data);
  }

  deleteHousingLocation(id: string) {
    console.log(id)
    this.firebase.deleteLocation(id).subscribe(() => {
      this.housingListDb = this.housingListDb.filter(housing => housing.id != id)
      this.housingListSig.update((housings) => housings.filter(housing => housing.id != id))
    })
  }
}
