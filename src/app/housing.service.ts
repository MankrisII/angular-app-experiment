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

  // getHousingLocationList(options?: Queryoptions | null) {
  //   // console.log(this.queyOptions, 'this.queryoptions')
  //   // console.log(options, "options params")
  //   options = { ...this.queyOptions, ...options };
  //   this.queyOptions = options;
  //   // console.log(this.queyOptions, 'merge options')

  //   // filer by name
  //   let h = this.housingListDb;
  //   if (options.filterByName) {
  //     // console.log("filter by name")
  //     h = h.filter(
  //       (h) =>
  //         h.name
  //           .toLocaleLowerCase()
  //           .indexOf(options.filterByName!.toLocaleLowerCase()) > -1
  //     );
  //   }

  //   // order
  //   if (options.order) {
  //     // console.log('ordering')
  //     h = h.sort((a, b) => {
  //       if (typeof a[options.order?.by as keyof HousingLocation] == 'string') {
  //         // order text value
  //         // console.log('string')
  //         if (
  //           String(
  //             a[options.order?.by as keyof HousingLocation]
  //           ).toUpperCase() <
  //           String(b[options.order?.by as keyof HousingLocation]).toUpperCase()
  //         ) {
  //           return options.order!.order == 'ASC' ? -1 : 1;
  //         }
  //         if (
  //           String(
  //             a[options.order?.by as keyof HousingLocation]
  //           ).toUpperCase() >
  //           String(b[options.order?.by as keyof HousingLocation]).toUpperCase()
  //         ) {
  //           return options.order!.order == 'ASC' ? 1 : -1;
  //         }
  //       } else if (
  //         typeof a[options.order?.by as keyof HousingLocation] == 'number'
  //       ) {
  //         // order numerical value
  //         // console.log('number')
  //         let r =
  //           Number(a[options.order?.by as keyof HousingLocation]) -
  //           Number(b[options.order?.by as keyof HousingLocation]);
  //         if (options.order?.order == 'DESC') r = r * -1;
  //         return r;
  //       }
  //       return 0;
  //     });

  //     // no order option = order by id
  //   } else {
  //     h = h.sort((a, b) => {
  //       return Number(a.id) - Number(b.id);
  //     });
  //   }
  //   // console.log(h,"h")
  //   return h;
  // }

  //TODO
  // clearOrdering() {
  //   delete this.queyOptions!.order;
  // }

  async getHousingLocationById(id: number | null) {
    // if (id !== undefined) {
    //   return this.housingList.find((h) => h.id == id);
    // } else {
    //   return this.getNewLocation();
    // }
    // const data = await fetch(`${this.url}/${id}`)
    //   .then((reponse) => {
    //     if (!reponse.ok)
    //       throw new Error(
    //         'Erreur : ' + reponse.status + ' - ' + reponse.statusText
    //       );
    //     return reponse.json();
    //   })
    //   .then((json) => {
    //     return json;
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
    // TODO save data for pagination
    // return data ?? {};
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
