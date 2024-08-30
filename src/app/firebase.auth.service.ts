import { Injectable, inject, signal } from '@angular/core';
import { FirebaseService } from './firebase.service';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import * as firebaseui from 'firebaseui';
import {
  getAuth,
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  User,
  signOut,
  Unsubscribe
} from 'firebase/auth';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {
  firebase = inject(FirebaseService);
  ui = new firebaseui.auth.AuthUI(firebase.auth());
  user = signal<any | null>(null)
  falseuser = true
  auth = getAuth()
  unsubscribe : Unsubscribe | null = null
  
  constructor() {
    // this.ui.start('#firebaseui-auth-container', {
    //   signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
    //   // Other config options...
    // });

    this.unsubscribe = onAuthStateChanged(this.auth, (u) => {
      console.log('onAuthStateChanged',u);
      if (u) {
        console.log('user already logged');
        this.getUser(u).subscribe()
        // this.user.set(u);
        // console.log(this.user());
      }
      // else {
      //   this.signIn()
      // }
      if (this.unsubscribe) this.unsubscribe(); 
    });

    // createUserWithEmailAndPassword(auth, 'test5@fa.com', "machin")
    //   .then((userCredential) => {
    //     console.log('user added successfully');
    //     user = userCredential.user
    //     console.log('user : ');
    //     console.log(user);

    //     deleteUser(user!)
    //       .then(() => {
    //         console.log('user deleted');
    //       })
    //       .catch((error) => {
    //         console.log(error.code, error.message);
    //       });

    //   })
    //   .catch((error) => {
    //     const code = error.code
    //     const message = error.message
    //     console.log("error",code, message);
    //   })
  }

  signIn(email: string, password: string):Observable<any> {
    console.log('signin user');
    // this.falseuser = true
    // return
    var that = this
    return new Observable((sub) => {
        let singinObs = from(signInWithEmailAndPassword(
          this.auth,
          email,
          password
        ))
      singinObs.subscribe({
        next(userCredential) {
          console.log('auth service - user logged sucess', userCredential.user);
          that.getUser(userCredential.user).subscribe({
            next(user) {
              sub.next(user)
            },
            error(error) {
              throw error;
            }
          });
          //this.user.set(userCredential.user);
          // return userCredential;
        },
      });
        // .then((userCredential) => {
        //   console.log('auth service - user logged sucess', userCredential.user);
        //   this.getUser(userCredential.user)
        //   //this.user.set(userCredential.user);
        //   return userCredential
        // })
        // .catch((error) => {
        //   console.log('auth service - error', error.code, error.message);
        //   throw error;
        // })
        // )
    })
  }

  getUser(user: any):Observable<any> {
    return new Observable((sub) =>{
      this.firebase.getUserById(user.uid).subscribe({
        next: (userData) => {
          console.log('loggin comp get user - ok', userData);
          this.user.set({ ...user, ...userData })
          sub.next(this.user());
          // return userData;
        },
        error: (error) => {
          console.log('loggin comp get user - error', error);
          throw error;
        },
      });
      }
    )
  }

  signOut() {
    console.log('signout user');
    // this.falseuser = false
    // return
    signOut(this.auth)
      .then(rep => {
      console.log("user signedout")
        console.log(rep)
        this.user.set(null)
    }).catch(error => {
      console.log("error", error.code, error.message)
      throw(error)
    })
  }
}
