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
import { Observable, from, map, switchMap } from 'rxjs';
import { UserData } from './UserData';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {
  firebase = inject(FirebaseService);
  ui = new firebaseui.auth.AuthUI(firebase.auth());
  userLogged = signal<boolean>(false);
  user: User | null = null
  userData : UserData | null = null
  auth = getAuth();

  constructor() {

     let unsubscribe = onAuthStateChanged(this.auth, (userCredential) => {
      // console.log('onAuthStateChanged',u);
      if (userCredential) {
        // console.log('user already logged');
        this.getUser(userCredential).subscribe();
        // console.log(this.user());
      }
      if (unsubscribe) unsubscribe();
    });
  }

  signIn(email: string, password: string): Observable<User> {
    // console.log('signin user');
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((userCredential) => this.getUser(userCredential.user))
    );

    // before refactoring
    //
    // var that = this
    // return new Observable((sub) => {
    //   let singinObs = from(signInWithEmailAndPassword(this.auth, email,password))
    //   singinObs.subscribe({
    //     next(userCredential) {
    //       // console.log('auth service - user logged sucess', userCredential.user);
    //       that.getUser(userCredential.user).subscribe({
    //         next : (user) => sub.next(user),
    //         error: (error) => { throw error }
    //       });
    //     },
    //   });
    // })
  }

  getUser(user: User): Observable<User> {
    return new Observable((subscriber) => {
      this.firebase.getUserById(user.uid).subscribe({
        next: (userData) => {
          // console.log('loggin comp get user - ok', userData);
          this.user = user
          this.userData = userData
          this.userLogged.set(true)
          subscriber.next(user);
        },
        error: (error) => {
          // console.log('loggin comp get user - error', error);
          throw error;
        },
      });
    });
  }

  signOut() {
    // console.log('signout user');
    signOut(this.auth)
      .then((rep) => {
        // console.log("user signedout")
        console.log(rep);
        this.user = null;
        this.userData = null
        this.userLogged.set(false)
      })
      .catch((error) => {
        // console.log("error", error.code, error.message)
        throw error;
      });
  }
}
