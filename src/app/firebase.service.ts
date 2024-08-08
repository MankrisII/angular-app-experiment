import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collectionData, collection, doc, deleteDoc, setDoc, updateDoc,getDoc,query,getDocs } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { Observable, from } from 'rxjs';
import { HousingLocation } from './HousingLocation';
import { getAuth, provideAuth } from '@angular/fire/auth'
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

  app = initializeApp(this.firebaseConfig);
  fireStore = inject(Firestore);
  storage = getStorage()
  storageRef = ref(this.storage)
  HLCollection = collection(this.fireStore, 'locations');
  
  constructor() {
    
  }

  getLocations(): Observable<HousingLocation[]> {
    return collectionData(this.HLCollection, {
      idField: 'id',
    }) as Observable<HousingLocation[]>;
  }

  getLocationById(id: string): Observable<any>{
    return new Observable((observer) => {
      getDoc(doc(this.fireStore, 'locations', id))
        .then((reponse) => {
          console.log('reponse',reponse)
          observer.next(reponse.data())
          observer.complete();
        })
    })
  }

  addLocation(location: HousingLocation): Observable<string> {
    const promise = addDoc(this.HLCollection, location).then((rep) => rep.id);
    return from(promise);
  }

  editLocation(location: any): Observable<void> {
    const docRef = doc(this.fireStore,'locations',location.id!)
    const promise = updateDoc(docRef,location).then(rep => rep);
    return from(promise);
  }

  async addphoto(file:File):Promise<string> {
    var imgRef = ref(this.storageRef, 'image/' + file.name)
    
    const promise = uploadBytes(imgRef, file)
      .then((snapshot) => {
        console.log('Uploaded', snapshot);
        return getDownloadURL(snapshot.ref).then(function (url) {
          console.log('File available at', url);
          
          return url
        });
      })
    console.log(promise)
    return promise
  }

  addMultipleLocations(locations: HousingLocation[], id: number = 0) {
    console.log('addMultipleLocations',id);
    this.addLocation(locations[id]).subscribe(
      rep => {
        console.log('housing added', rep)
        console.log(locations.length,id+1);
        if (locations.length > id + 1) {this.addMultipleLocations(locations, id + 1)}
        else {
          this.getLocations().subscribe(
            rep => console.log(rep)
          )
        }
      }
    );
  }

  deleteLocation(id: String): Observable<void> {
    const docRef = doc(this.fireStore, 'locations/' + id)
    const promise = deleteDoc(docRef)
    return from(promise)
  }
}
