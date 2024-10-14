import { NgClass, NgIf, NgStyle } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  map,
  of,
} from 'rxjs';
import { AddressListItem } from '../../AddressApiResult';

@Component({
  selector: 'app-address-input',
  standalone: true,
  imports: [NgClass, NgIf, ReactiveFormsModule, NgStyle],
  templateUrl: './address-input.component.html',
  styleUrl: './address-input.component.css',
})
export class AddressInputComponent implements OnInit {
  @Input() control!: FormControl;
  @Input() placeholder: string = '';
  @Output() addressChange = new EventEmitter<any>();
  @ViewChild('list') ulList!: ElementRef;
  @HostBinding('class.homeSearch') isHomeSearch = false;

  addressesList!: AddressListItem[] | null;
  previousSelectedAddressId: number | null = null;
  selectedAddressId: number | null = null;
  http: HttpClient;
  timer: any;
  previousAddressValue: any = '';
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
    if (this.isListDisplayed && this.addressesList != null) {
      this.previousSelectedAddressId = this.selectedAddressId;

      // On Enter key press, set city input value from selected item
      if (event.code == 'Enter') {
        this.selectAddress();
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
      this.addressesList &&
      event.code == 'ArrowDown'
    ) {
      this.selectedAddressId = 0;
      this.isListDisplayed = true;
      this.updateAddressList();
      return;
    }

    clearTimeout(this.timer);
    //console.log('timer');

    // value hasn't changed
    if (this.control.value == this.previousAddressValue) return;

    // open dropdown in loading mode at first typping when field is empty
    if (!this.isListDisplayed && !this.addressesList) {
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
      this.selectedAddressId = null;

      this.previousAddressValue = this.control.value;
      // this.closeList()

      //TODO : error handling
      this.http
        .get(
          `https://api-adresse.data.gouv.fr/search/?q=${this.control.value.replace(
            / /g,
            '+'
          )}+26220+Dieulefit&type=&autocomplete=0`
        )
        .subscribe((response: any) => {
          //console.log('city keyup response = ', response);
          if ((response.features as Array<any>).length > 0) {
            let addresses: any = [];
            // decompose cities with multiple postals codes
            for (let [
              id,
              feature,
            ] of response.features.entries() as Iterable<any>) {
              //console.log('feature', feature);
              addresses.push({
                selected: false,
                data: feature,
                id: id,
              });
            }
            this.addressesList = addresses;
          } else {
            this.noResult = true;
            this.addressesList = null;
            this.selectedAddressId = null;
            this.previousSelectedAddressId = null;
          }

          this.loading = false;
        });
    }, 400);
  }

  mouveUp() {
    if (this.selectedAddressId == null || this.selectedAddressId == 0) {
      this.selectedAddressId = this.addressesList!.length - 1;
    } else {
      this.selectedAddressId--;
    }
    this.updateAddressList();
  }

  mouveDown() {
    if (
      this.selectedAddressId == null ||
      this.selectedAddressId == this.addressesList!.length - 1
    ) {
      this.selectedAddressId = 0;
    } else {
      this.selectedAddressId++;
    }
    this.updateAddressList();
  }

  addressClick(id: number) {
    //console.log('addressClick', this.addressesList![id].data.properties.label);
    //this.control?.setValue(nom);
    this.addressChange.emit(this.addressesList![id].data);
    this.closeList();
  }

  selectAddress() {
    // this.control?.setValue(this.addressesList[this.selectedAddressId!].label);
    this.addressChange.emit(this.addressesList![this.selectedAddressId!].data);
    this.closeList();
    this.previousAddressValue = this.control.value;
  }

  ngOnInit(): void {}

  updateAddressList() {
    // console.log('updateCityList')
    // change selected item
    if (this.previousSelectedAddressId != null)
      this.addressesList![this.previousSelectedAddressId!].selected = false;
    this.addressesList![this.selectedAddressId!].selected = true;

    // scroll cityList
    let selectedY = 0;
    let ul = this.ulList.nativeElement;
    // console.log(this.selectedAddressId,
    //   this.ulList.nativeElement
    // );
    let selectedHeight = (ul.children[this.selectedAddressId!] as HTMLElement)
      .offsetHeight;
    let cityListHeight = ul.offsetHeight;

    for (let i = 0; i < this.selectedAddressId!; i++) {
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
      if (this.selectedAddressId)
        this.addressesList![this.selectedAddressId!].selected = false;
      this.selectedAddressId = null;
      this.previousSelectedAddressId = null;
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
