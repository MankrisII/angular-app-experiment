import { Injectable, OnInit, inject } from '@angular/core';
import { HousingLocation } from './HousingLocation';
import { Queryoptions } from './queryoptions';
import { HttpClient } from '@angular/common/http';
import { initializeApp } from 'firebase/app';
import { FirebaseService } from './firebase.service';


@Injectable({
  providedIn: 'root',
})
export class HousingService implements OnInit {
  housingList: HousingLocation[] = [];
  queyOptions: Queryoptions | null = { page: 1, perPage: 5 };
  url: string = 'http://localhost:3000/locations';
  
  constructor(private http: HttpClient) {}

  ngOnInit() {}

  searchHousingLocationByName(search: string) {}

  setLocations(locations: HousingLocation[]) {
    this.housingList = locations
  }

  async getHousingLocationList(
    options?: Queryoptions | null
  ) {
    // console.log(this.queyOptions, 'this.queryoptions')
    // console.log(options, "options params")
    options = { ...this.queyOptions, ...options };
    this.queyOptions = options;
    // console.log(this.queyOptions, 'merge options')

    // filer by name
    let h = this.housingList;
    if (options.filterByName) {
      // console.log("filter by name")
      h = h.filter(
        (h) =>
          h.name
            .toLocaleLowerCase()
            .indexOf(options.filterByName!.toLocaleLowerCase()) > -1
      );
    }

    // order
    if (options.order) {
      // console.log('ordering')
      h = h.sort((a, b) => {
        if (typeof a[options.order?.by as keyof HousingLocation] == 'string') {
          // order text value
          // console.log('string')
          if (
            String(
              a[options.order?.by as keyof HousingLocation]
            ).toUpperCase() <
            String(b[options.order?.by as keyof HousingLocation]).toUpperCase()
          ) {
            return options.order!.order == 'ASC' ? -1 : 1;
          }
          if (
            String(
              a[options.order?.by as keyof HousingLocation]
            ).toUpperCase() >
            String(b[options.order?.by as keyof HousingLocation]).toUpperCase()
          ) {
            return options.order!.order == 'ASC' ? 1 : -1;
          }
        } else if (
          typeof a[options.order?.by as keyof HousingLocation] == 'number'
        ) {
          // order numerical value
          // console.log('number')
          let r =
            Number(a[options.order?.by as keyof HousingLocation]) -
            Number(b[options.order?.by as keyof HousingLocation]);
          if (options.order?.order == 'DESC') r = r * -1;
          return r;
        }
        return 0;
      });

      // no order option = order by id
    } else {
      h = h.sort((a, b) => {
        return Number(a.id) - Number(b.id);
      });
    }
    // console.log(h,"h")
    return h;
  }

  //TODO
  clearOrdering() {
    delete this.queyOptions!.order;
  }

  async getHousingLocationById(id: number | null) {
    // if (id !== undefined) {
    //   return this.housingList.find((h) => h.id == id);
    // } else {
    //   return this.getNewLocation();
    // }
    const data = await fetch(`${this.url}/${id}`)
      .then((reponse) => {
        if (!reponse.ok)
          throw new Error(
            'Erreur : ' + reponse.status + ' - ' + reponse.statusText
          );
        return reponse.json();
      })
      .then((json) => {
        return json;
      })
      .catch((error) => {
        console.log(error);
      });

    //TODO save data for pagination

    return data ?? {};
  }

  getNewLocation(): HousingLocation {
    return {
      id: this.getNextId(),
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

  getNextId(): number {
    return this.housingList[this.housingList.length - 1].id + 1;
  }

  editHousingLocation(data: HousingLocation) {
    // casting available units valu to Number
    data.availableUnits = Number(data.availableUnits);
    let housingIndex = this.housingList.findIndex((h) => h.id == data.id);
    this.housingList[housingIndex] = data;
  }

  addHousingLocation(data: HousingLocation) {
    this.housingList.push(data);
  }

  deleteHousingLocation(id: number) {
    let index = this.housingList.findIndex((h) => h.id == id);
    this.housingList.splice(index, 1);
  }
}
