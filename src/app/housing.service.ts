import { HttpClient } from '@angular/common/http';
import { inject, Injectable, OnInit, signal } from '@angular/core';
import { collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FirebaseService } from './firebase.service';
import { HousingLocation } from './HousingLocation';
import { SorterService } from './list-sorter-heading/sorter.service';
import { Queryoptions } from './queryoptions';
import { collection, deleteDoc, doc, getDocs, orderBy, OrderByDirection, query, where } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


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

  async getLocations(queryoptions: Queryoptions | null = null) {
    
    let q = query(this.firebase.HLCollection)

    if (queryoptions?.orderBy) {
      for (let order of queryoptions.orderBy) {
        q = query(q, orderBy(order.by, order.order as OrderByDirection))
      }
    }
    
    const querySnap = await getDocs(q)
    console.log(querySnap);
    const locations = querySnap.docs.map(doc => {
      return { id: doc.id, ...doc.data() } as HousingLocation;
    })
    console.log(locations);
    this.housingListDb = locations;
    this.housingListSig.set(locations);

  }

  searchHousingLocationByName(search: string) {}

  // setLocations(locations: HousingLocation[]) {
  //   this.housingList = locations;
  // }

  search(value: string) {
    this.housingListSig.set(
      this.housingListDb.filter((housing) =>
        housing.name!.toLowerCase().includes(value.toLowerCase())
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
    this.housingListSig.set(this.housingListDb)
  }

  getHousingLocationById(id: string): Observable<HousingLocation> {
    return new Observable((observer) => {
      this.firebase.getLocationById(id).subscribe((data) => {
        observer.next(data)
        observer.complete()
      })
    })
  }

  getNewLocation(): Observable<HousingLocation> {
    return new Observable(observer => {
      observer.next(
        {
          id: '',
          name: '',
          city: '',
          address: '',
          photos: [],
          availableUnits: 0,
          wifi: false,
          laundry: false,
          coords:{lat: '', lon: ''}
        }
      )
    })
  }

  // getOrderBy() {
  //   return this.queyOptions!.orderBy?.by;
  // }

  // getNextId(): number {
  //   return this.housingList[this.housingList.length - 1].id + 1;
  // }

  editHousingLocation(data: HousingLocation) : Observable<boolean> {
    console.log(data)
    return new Observable((subscriber) => {
      this.firebase.editLocation(data).subscribe(
        () => {
          console.log("updated");

          subscriber.next(true)
          subscriber.complete()
        }
      );
    })
  }

  addHousingLocation(data: HousingLocation) {
    console.log(data);
    return new Observable((subscriber) => {
      this.firebase.addLocation(data).subscribe((newId) => {
        console.log(newId);
        // data.id = newId;
        // this.housingListDb.push(data);

        subscriber.next(true);
        subscriber.complete();
      });
    });
  }

  deleteHousingLocation(id: string) {
    console.log(id)
    const docRef = doc(this.firebase.fireStore, 'locations', id)
    deleteDoc(docRef).then(() => {
      this.housingListDb = this.housingListDb.filter(housing => housing.id != id)
      this.housingListSig.update((housings) => housings.filter(housing => housing.id != id))
    })
  }
}
