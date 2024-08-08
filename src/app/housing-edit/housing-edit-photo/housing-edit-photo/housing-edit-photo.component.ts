import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FirebaseService } from '../../../firebase.service';
import { FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-housing-edit-photo',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, NgFor],
  templateUrl: './housing-edit-photo.component.html',
  styleUrl: './housing-edit-photo.component.css',
})
export class HousingEditPhotoComponent implements OnInit {
  @Input() photosArray!: FormArray;
  firebase = inject(FirebaseService);
  fileInput = new FormControl();
  photoUrl = '';
  htmlFileInput!: HTMLInputElement;

  ngOnInit(): void {
    this.htmlFileInput = document.getElementById(
      'photo-file-input'
    ) as HTMLInputElement;
    console.log(this.htmlFileInput);
  }

  selectFile(event: Event) {
    console.log('selectFile');
    event.stopPropagation();
    event.preventDefault();
    console.log(this.htmlFileInput.click());
  }

  fileSelected(event: Event) {
    console.log('fileSelected');
    event.stopPropagation();
    event.preventDefault();
    const target = event.target as HTMLInputElement;
    const files = target.files;
    const file = files![0];
    console.log(file);
    const reponse = this.firebase.addphoto(file).then((url) => {
      this.photoUrl = url;
      // this.editForm.get('photo')?.value
    });
  }
}
