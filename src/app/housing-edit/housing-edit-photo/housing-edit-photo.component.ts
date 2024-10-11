import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FirebaseService } from '../../firebase.service';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { CloseButtonComponent } from '../../ui/button/close-button/close-button.component';

@Component({
  selector: 'app-housing-edit-photo',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, NgFor, CloseButtonComponent],
  templateUrl: './housing-edit-photo.component.html',
  styleUrl: './housing-edit-photo.component.css',
})
export class HousingEditPhotoComponent implements OnInit {
  @Input() editForm!: FormGroup;
  formBuilder = inject(FormBuilder);
  firebase = inject(FirebaseService);
  photosGroup!: FormGroup;
  photosFormArray!: FormArray;
  fileInput = new FormControl();
  photoUrl = '';
  htmlFileInput!: HTMLInputElement;

  constructor() {}

  ngOnInit(): void {
    this.photosFormArray = this.editForm.get('photos') as FormArray;
    //console.log('photos',this.photosFormArray)
    this.htmlFileInput = document.getElementById(
      'photo-file-input',
    ) as HTMLInputElement;
    //console.log(this.htmlFileInput);
  }

  addPhotoControl() {
    this.photosFormArray.push(this.formBuilder.control(''));
  }

  selectFile(event: Event) {
    //console.log('selectFile');
    event.stopPropagation();
    event.preventDefault();
    (document.getElementById('photo-file-input') as HTMLInputElement).click();
  }

  fileSelected(event: Event) {
    //console.log('fileSelected');
    event.stopPropagation();
    event.preventDefault();
    const target = event.target as HTMLInputElement;
    const files = target.files;
    const file = files![0];
    //console.log(file);
    const reponse = this.firebase.addphoto(file).then((url) => {
      this.photosFormArray.push(this.formBuilder.control(url));
      //console.log(this.photosFormArray);
    });
  }

  deletePhoto(url: string) {
    let index = this.photosFormArray.value.indexOf(url);
    this.photosFormArray.removeAt(index);
  }
}
