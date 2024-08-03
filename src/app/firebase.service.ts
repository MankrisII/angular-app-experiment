import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collectionData, collection } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { Observable, from } from 'rxjs';
import { HousingLocation } from './HousingLocation';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  firebaseConfig = {
    apiKey: 'AIzaSyDPLUQ1zy4Lko2ZSaS4sl-snde2OEWA3Hk',
    authDomain: 'angular-tuto-app.firebaseapp.com',
    projectId: 'angular-tuto-app',
    storageBucket: 'angular-tuto-app.appspot.com',
    messagingSenderId: '832901011574',
    appId: '1:832901011574:web:63da21dba1fff4d3832757',
  };

  app = initializeApp(this.firebaseConfig);
  fireStore = inject(Firestore);
  collection = collection(this.fireStore, 'locations');
  
  constructor() {
    
  }

  getLocation(): Observable<HousingLocation[]> {
    return collectionData(this.collection, {
      idField: 'id',
    }) as Observable<HousingLocation[]>;
  }

  addLocation(location: HousingLocation): Observable<string> {
    const promise = addDoc(this.collection, location).then((rep) => rep.id);
    return from(promise);
  }

  addMultipleLocations(locations: HousingLocation[], id: number = 0) {
    console.log('addMultipleLocations',id);
    this.addLocation(locations[id]).subscribe(
      rep => {
        console.log('housing added', rep)
        console.log(locations.length,id+1);
        if (locations.length > id + 1) {this.addMultipleLocations(locations, id + 1)}
        else {
          this.getLocation().subscribe(
            rep => console.log(rep)
          )
        }
      }
    );
  }
}
