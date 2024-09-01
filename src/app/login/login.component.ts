import { Component, Signal, computed, inject } from '@angular/core';
import { FirebaseAuthService } from '../firebase.auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { OverlayComponent } from '../ui/overlay/overlay.component';
import { CardComponent } from '../ui/card/card.component';
import { NgClass } from '@angular/common';
import { error } from 'jquery';
import { FirebaseService } from '../firebase.service';
import { Router } from '@angular/router';

@Component({
  // Comment plus récent
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, OverlayComponent, CardComponent, NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
  
export class LoginComponent {
  firebaseAuth = inject(FirebaseAuthService);
  firebase = inject(FirebaseService)
  formbuilder = inject(FormBuilder);
  loginForm = this.formbuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });
  loading : boolean = false
  isLogginFormDisplayed: Boolean = false;
  errorMessage: string = '';
  router = inject(Router)

  constructor() {
    
  }

  displayLogginForm() {
    this.isLogginFormDisplayed = true;
    let body = (
      document.getElementsByTagName('body')[0] as HTMLElement
    ).style.setProperty('overflow', 'hidden');
  }
  
  signin() {
    console.log('singin form submited');
    this.loading = true
    this.firebaseAuth
      .signIn(
        this.loginForm.controls['email'].value!,
        this.loginForm.controls['password'].value!
      )
      .subscribe({
        next: (user) => {
          console.log('login comp - ok', user);
          this.close()
          this.loading = false
        },
        error: (error) => {
          console.log('login comp - error', error);
          this.loading = false
          this.errorMessage = 'invalid email or password';
        },
      });
  }

  signout() {
    this.firebaseAuth.signOut();
    this.router.navigateByUrl("")
  }


  close() {
    console.log('close')
    this.isLogginFormDisplayed = false;
    this.errorMessage = ''
    let body = (
      document.getElementsByTagName('body')[0] as HTMLElement
    ).style.setProperty('overflow', 'scroll');
  }
}
