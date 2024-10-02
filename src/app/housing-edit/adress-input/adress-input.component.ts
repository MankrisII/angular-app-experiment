import { NgClass, NgIf, NgStyle } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, fromEvent ,map, of} from 'rxjs';
import { AdressListItem } from '../../AdressApiResult';

@Component({
  selector: 'app-adress-input',
  standalone: true,
  imports: [NgClass, NgIf, ReactiveFormsModule, NgStyle],
  templateUrl: './adress-input.component.html',
  styleUrl: './adress-input.component.css',
})
export class AdressInputComponent implements OnInit {
  @Input() control!: FormControl;
  @Output() adressChange = new EventEmitter<any>();
  @ViewChild('list') ulList!: ElementRef;

  adressesList!: AdressListItem[] | null;
  previousSelectedAdressId: number | null = null;
  selectedAdressId: number | null = null;
  http: HttpClient;
  timer: any;
  previousAdressValue: any = '';
  isListDisplayed: boolean = false;
  loading: boolean = false;
  noResult: boolean = false;
  closeTimeOut: any;

  constructor(http: HttpClient) {
    this.http = http;
  }

  keyup(event: KeyboardEvent) {
    //console.log('keyup', event);
    //console.log('event code', event.code);

    // close city list on Escape Key press
    if (event.code == 'Escape') {
      this.closeList();
      return;
    }

    // city list is open
    if (this.isListDisplayed && this.adressesList != null) {
      this.previousSelectedAdressId = this.selectedAdressId;

      // On Enter key press, set city input value from selected item
      if (event.code == 'Enter') {
        this.selectAdress();
        return;
      }

      // listening for keyup to navigate with keyboard in autocomplete city list
      if (event.code == 'ArrowUp') {
        //console.log('arrowup');
        this.mouveUp();
        return;
      }

      if (event.code == 'ArrowDown') {
        //console.log('arrowdown');
        this.mouveDown();
        return;
      }
    }

    // open dropdown at previous state
    if (
      !this.isListDisplayed &&
      this.adressesList &&
      event.code == 'ArrowDown'
    ) {
      this.selectedAdressId = 0;
      this.isListDisplayed = true;
      this.updateAdressList();
      return;
    }

    clearTimeout(this.timer);
    //console.log('timer');

    // value hasn't changed
    if (this.control.value == this.previousAdressValue) return;

    // open dropdown in loading mode at first typping when field is empty
    if (!this.isListDisplayed && !this.adressesList) {
      this.isListDisplayed = true;
      this.loading = true;
      this.noResult = false;
    }

    // request goe.api.gouv to get city
    // execution delayed after the last key pressed
    this.timer = setTimeout(() => {
      // do nothing if city.value is still the same

      this.isListDisplayed = true;
      this.loading = true;
      this.noResult = false;
      this.selectedAdressId = null;

      this.previousAdressValue = this.control.value;
      // this.closeList()

      this.http
        .get(
          `https://api-adresse.data.gouv.fr/search/?q=${this.control.value.replace(
            / /g,
            '+'
          )}&type=&autocomplete=0`
        )
        .subscribe((response: any) => {
          //console.log('city keyup response = ', response);
          if ((response.features as Array<any>).length > 0) {
            let adresses: any = [];
            // decompose cities with multiple postals codes
            for (let [id,feature] of response.features.entries() as Iterable<any>) {
              //console.log('feature', feature);
              adresses.push({
                selected: false,
                data: feature,
                id:id
              });
            }
            this.adressesList = adresses;
          } else {
            this.noResult = true;
            this.adressesList = null;
            this.selectedAdressId = null;
            this.previousSelectedAdressId = null;
          }

          this.loading = false;
        });
    }, 400);
  }

  mouveUp() {
    if (this.selectedAdressId == null || this.selectedAdressId == 0) {
      this.selectedAdressId = this.adressesList!.length - 1;
    } else {
      this.selectedAdressId--;
    }
    this.updateAdressList();
  }

  mouveDown() {
    if (
      this.selectedAdressId == null ||
      this.selectedAdressId == this.adressesList!.length - 1
    ) {
      this.selectedAdressId = 0;
    } else {
      this.selectedAdressId++;
    }
    this.updateAdressList();
  }

  adressClick(id: number) {
    //console.log('adressClick', this.adressesList![id].data.properties.label);
    //this.control?.setValue(nom);
    this.adressChange.emit(this.adressesList![id].data);
    this.closeList();
  }

  selectAdress() {
    // this.control?.setValue(this.adressesList[this.selectedAdressId!].label);
    this.adressChange.emit(this.adressesList![this.selectedAdressId!].data);
    this.closeList();
    this.previousAdressValue = this.control.value;
  }

  ngOnInit(): void {}

  updateAdressList() {
    // console.log('updateCityList')
    // change selected item
    if (this.previousSelectedAdressId != null)
      this.adressesList![this.previousSelectedAdressId!].selected = false;
    this.adressesList![this.selectedAdressId!].selected = true;

    // scroll cityList
    let selectedY = 0;
    let ul = this.ulList.nativeElement;
    // console.log(this.selectedAdressId,
    //   this.ulList.nativeElement
    // );
    let selectedHeight = (ul.children[this.selectedAdressId!] as HTMLElement)
      .offsetHeight;
    let cityListHeight = ul.offsetHeight;

    for (let i = 0; i < this.selectedAdressId!; i++) {
      selectedY += (ul.children[i] as HTMLElement).offsetHeight;
    }

    if (selectedY - selectedHeight - ul.scrollTop < 0) {
      // scroll up
      ul.scroll(0, selectedY);
    } else if (selectedY + selectedHeight - ul.scrollTop > cityListHeight) {
      // scroll down
      ul.scroll(0, selectedY - cityListHeight + selectedHeight);
    }
  }

  closeList() {
    //console.log('closelist');
    if (this.closeTimeOut) clearTimeout(this.closeTimeOut);
    this.closeTimeOut = setTimeout(() => {
      if (this.selectedAdressId)
        this.adressesList![this.selectedAdressId!].selected = false;
      this.selectedAdressId = null;
      this.previousSelectedAdressId = null;
      this.isListDisplayed = false;
      this.loading = false;
      this.noResult = false;
    }, 100);
  }

  onCityKeyUp(event: any) {
    //console.log('keyUp', event);
    //console.log('keyUp city value =', this.control?.value);
  }
}
