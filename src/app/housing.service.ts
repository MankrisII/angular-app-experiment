import { HttpClient } from '@angular/common/http';
import { inject, Injectable, OnInit, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseService } from './firebase.service';
import { HousingLocation } from './HousingLocation';
import { SorterService } from './list-sorter-heading/sorter.service';
import { Queryoptions } from './queryoptions';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentSnapshot,
  getDoc,
  getDocs,
  orderBy,
  OrderByDirection,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

@Injectable({
  providedIn: 'root',
})
export class HousingService implements OnInit {
  housingListDb: HousingLocation[] = [];
  housingListSig = signal<HousingLocation[]>([]); // TODO remove this to use housinLocationsDocsSig
  housinLocationsDocsSig = signal<DocumentSnapshot[]>([]);
  queyOptions!: Queryoptions | null;
  firebase = inject(FirebaseService);
  sorterService = inject(SorterService);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // this.firebase.getLocation().subscribe(location => {
    //   this.housingList = location
    // })
  }

  async getLocations(queryoptions: Queryoptions | null = null) {
    this.queyOptions = queryoptions;
    console.log('queryoptions', queryoptions);
    let q = query(this.firebase.HLCollection);

    if (queryoptions?.orderBy) {
      for (let order of queryoptions.orderBy) {
        q = query(q, orderBy(order.by, order.order as OrderByDirection));
      }
    }

    if (queryoptions?.street_insensitive) {
      q = query(
        q,
        where('street_insensitive', '==', queryoptions.street_insensitive)
      );
    }

    if (queryoptions?.houseNumber) {
      q = query(q, where('houseNumber', '==', queryoptions.houseNumber));
    }

    const querySnap = await getDocs(q);
    console.log('docs', querySnap.docs);
    // const locations = querySnap.docs.map((doc) => {
    //   return { id: doc.id, ...doc.data() } as HousingLocation;
    // });
    // console.log(locations);
    this.housinLocationsDocsSig.set(querySnap.docs);
    // this.housingListDb = locations; // TODO remove this to use housinLocationsDocsSig
    // this.housingListSig.set(locations); // TODO remove this to use housinLocationsDocsSig
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
    // this.housingListSig.set(this.housingListDb);
    // this.sort();
    delete this.queyOptions?.houseNumber;
    delete this.queyOptions?.street_insensitive;
    this.getLocations(this.queyOptions);
  }

  sort() {
    let sortOn = this.sorterService.sortSig().sortOn;
    let order = this.sorterService.sortSig().order;
    if (sortOn == 'address') {
      this.queyOptions!.orderBy = [
        { order: order, by: 'street_insensitive' },
        { order: order, by: 'houseNumber' },
      ];
    } else {
      this.queyOptions!.orderBy = [{ order: order, by: sortOn }];
    }
    this.getLocations(this.queyOptions);
  }

  private getValueToSort(
    housingLocation: HousingLocation,
    sortOn: string
  ): any {
    return housingLocation[sortOn as keyof HousingLocation];
  }

  //TODO
  clearSort() {
    this.housingListSig.set(this.housingListDb);
  }

  getHousingLocationById(id: string): Observable<HousingLocation> {
    return new Observable((observer) => {
      getDoc(doc(this.firebase.fireStore, 'locations', id)).then((reponse) => {
        let snapshot: HousingLocation = reponse.data() as HousingLocation;
        snapshot.id = id;
        observer.next(snapshot);
        observer.complete();
      });
    });
  }

  getNewLocation(): Observable<HousingLocation> {
    return new Observable((observer) => {
      observer.next({
        // id: '',
        name: '',
        city: '',
        address: '',
        photos: [],
        availableUnits: 0,
        wifi: false,
        laundry: false,
        coords: { lat: '', lon: '' },
      });
    });
  }

  // getOrderBy() {
  //   return this.queyOptions!.orderBy?.by;
  // }

  // getNextId(): number {
  //   return this.housingList[this.housingList.length - 1].id + 1;
  // }

  editHousingLocation(id: string, data: HousingLocation): Observable<boolean> {
    // console.log(data);
    return new Observable((subscriber) => {
      const docRef = doc(this.firebase.fireStore, 'locations', id);
      const promise = updateDoc(docRef, { ...data }).then((rep) => {
        subscriber.next(true);
        subscriber.complete();
      });
    });
  }

  addHousingLocation(data: HousingLocation) {
    // console.log(data);
    return new Observable((subscriber) => {
      addDoc(this.firebase.HLCollection, data).then((rep) => {
        subscriber.next(true);
        subscriber.complete();
      });
    });
  }

  deleteHousingLocation(id: string) {
    // console.log('delete - ', id);
    const docRef = doc(this.firebase.fireStore, 'locations', id);
    deleteDoc(docRef).then(() => {
      this.getLocations(this.queyOptions);
      // // TODO remove this to use housinLocationsDocsSig
      // this.housingListDb = this.housingListDb.filter(
      //   (housing) => housing.id != id
      // );
      // // TODO remove this to use housinLocationsDocsSig
      // this.housingListSig.update((housings) =>
      //   housings.filter((housing) => housing.id != id)
      // );

      // this.housinLocationsDocsSig.update((docs) =>
      // //   this.housinLocationsDocsSig().filter((doc) => doc.id != id)
      // );
    });
  }
}
