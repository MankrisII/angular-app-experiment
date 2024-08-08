import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app'
import { provideFirestore, getFirestore} from '@angular/fire/firestore'

import { routes } from './app.routes';
import { getAuth, provideAuth } from '@angular/fire/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDPLUQ1zy4Lko2ZSaS4sl-snde2OEWA3Hk',
  authDomain: 'angular-tuto-app.firebaseapp.com',
  projectId: 'angular-tuto-app',
  storageBucket: 'angular-tuto-app.appspot.com',
  messagingSenderId: '832901011574',
  appId: '1:832901011574:web:63da21dba1fff4d3832757',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth())
  ]
};
