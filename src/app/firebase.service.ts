import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collectionData,
  collection,
  doc,
  deleteDoc,
  setDoc,
  updateDoc,
  getDoc,
  query,
  getDocs,
} from '@angular/fire/firestore';
//import { initializeApp } from 'firebase/app';
// import compat version tu use firebaseUi
import firebase from 'firebase/compat/app';
// import * as firebaseui  from 'firebaseui';
import { Observable, from } from 'rxjs';
import { HousingLocation } from './HousingLocation';
import {
  connectStorageEmulator,
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';

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

  app = firebase.initializeApp(this.firebaseConfig);
  fireStore = inject(Firestore);
  storage = getStorage();
  storageRef = ref(this.storage);
  HLCollection = collection(this.fireStore, 'locations');

  constructor() {}

  getUserById(id: string): Observable<any> {
    return new Observable((observer) => {
      getDoc(doc(this.fireStore, 'users', id)).then((reponse) => {
        let snapshot: any = reponse.data();
        snapshot.id = id;
        observer.next(snapshot);
        observer.complete();
      });
    });
  }

  // getLocations(): Observable<HousingLocation[]> {
  //   return collectionData(this.HLCollection, {
  //     idField: 'id',
  //   }) as Observable<HousingLocation[]>;
  // }

  // getLocationById(id: string): Observable<any> {
  //   return new Observable((observer) => {
  //     getDoc(doc(this.fireStore, 'locations', id)).then((reponse) => {
  //       let snapshot: HousingLocation = reponse.data() as HousingLocation;
  //       snapshot.id = id;
  //       observer.next(snapshot);
  //       observer.complete();
  //     });
  //   });
  // }

  async addphoto(file: File): Promise<string> {
    var imgRef = ref(this.storageRef, 'image/' + file.name);

    const promise = uploadBytes(imgRef, file).then((snapshot) => {
      console.log('Uploaded', snapshot);
      return getDownloadURL(snapshot.ref).then(function (url) {
        console.log('File available at', url);

        return url;
      });
    });
    console.log(promise);
    return promise;
  }

  // addMultipleLocations(locations: HousingLocation[], id: number = 0) {
  //   console.log('addMultipleLocations', id);
  //   this.addLocation(locations[id]).subscribe((rep) => {
  //     console.log('housing added', rep);
  //     console.log(locations.length, id + 1);
  //     if (locations.length > id + 1) {
  //       this.addMultipleLocations(locations, id + 1);
  //     } else {
  //       this.getLocations().subscribe((rep) => console.log(rep));
  //     }
  //   });
  // }

  // TODO: delete
  // deleteLocation(id: String): Observable<void> {
  //   const docRef = doc(this.fireStore, 'locations/' + id);
  //   const promise = deleteDoc(docRef);
  //   return from(promise);
  // }
}
