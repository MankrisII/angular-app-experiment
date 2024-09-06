import { NgClass, NgIf, NgStyle } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, fromEvent ,map, of} from 'rxjs';

@Component({
  selector: 'app-adress-input',
  standalone: true,
  imports: [NgClass,NgIf,ReactiveFormsModule,NgStyle],
  templateUrl: './adress-input.component.html',
  styleUrl: './adress-input.component.css'
})
export class AdressInputComponent implements OnInit {
  adressesList: any = null;
  selectedAdressId: number | null = null;
  previousSelectedAdressId: number | null = null;
  http: HttpClient;
  @Input() control!: FormControl;
  timer: any;
  previousAdressValue: any = '';
  isListDisplayed: boolean = false;
  loading: boolean = false;
  noResult: boolean = false;
  @ViewChild('list') ulList!: ElementRef;

  constructor(http: HttpClient) {
    this.http = http;
  }

  keyup(event:KeyboardEvent) {
    console.log('keyup', event);
    console.log('event code', event.code);
   
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
        this.selectAdress()
        return;
      }

      // listening for keyup to navigate with keyboard in autocomplete city list
      if (event.code == 'ArrowUp') {
        console.log('arrowup');
        this.mouveUp()
        return;
      }
        
      if (event.code == 'ArrowDown') {
        console.log('arrowdown');
        this.mouveDown()
        return;
      }
    }

    // open dropdown at previous state
    if (!this.isListDisplayed && this.adressesList && event.code == 'ArrowDown') {
      this.selectedAdressId = 0;
      this.isListDisplayed = true;
      this.updateAdressList();
      return;
    }

    clearTimeout(this.timer);
    console.log('timer');

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
        .get(`https://api-adresse.data.gouv.fr/search/?q=${this.control.value.replace(/ /g, '+')}&type=&autocomplete=0`)
        .subscribe((response : any) => {
          console.log('city keyup response = ', response);
          if ((response.features as Array<any>).length > 0) {
            let adresses: any = [];
            // decompose cities with multiple postals codes
            for (let rep of response.features as Iterable<any>) {
              console.log('rep',rep)
              adresses.push({
                label: rep.properties.label,
                selected: false,
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
     this.selectedAdressId = this.adressesList.length - 1;
   } else {
     this.selectedAdressId--;
   }
   this.updateAdressList(); 
  }

  mouveDown() {
    if (
      this.selectedAdressId == null ||
      this.selectedAdressId == this.adressesList.length - 1
    ) {
      this.selectedAdressId = 0;
    } else {
      this.selectedAdressId++;
    }
    this.updateAdressList();
  }

  selectAdress() {
    this.control?.setValue(this.adressesList[this.selectedAdressId!].label);
    this.closeList();
    this.previousAdressValue = this.control.value;
  }

  ngOnInit(): void {
  }

  updateAdressList() {
    // console.log('updateCityList')
    // change selected item
    if(this.previousSelectedAdressId != null)this.adressesList[this.previousSelectedAdressId!].selected = false
    this.adressesList[this.selectedAdressId!].selected = true

    // scroll cityList
    let selectedY = 0
    let ul = this.ulList.nativeElement
    // console.log(this.selectedAdressId,
    //   this.ulList.nativeElement
    // );
    let selectedHeight = (ul.children[this.selectedAdressId!] as HTMLElement).offsetHeight
    let cityListHeight = ul.offsetHeight
    
    for (let i = 0; i < this.selectedAdressId! ; i++) {
      selectedY += (ul.children[i]as HTMLElement).offsetHeight
    }

    if (selectedY - selectedHeight - ul.scrollTop < 0) {
      // scroll up
      ul.scroll(0, selectedY)
    } else if (selectedY + selectedHeight - ul.scrollTop > cityListHeight) {
      // scroll down
      ul.scroll(0, selectedY - cityListHeight + selectedHeight)
    }
  }

  closeList() {
    console.log('closelist')
    setTimeout(() => {
      if (this.selectedAdressId) this.adressesList[this.selectedAdressId!].selected = false
      this.selectedAdressId = null
      this.previousSelectedAdressId = null
      this.isListDisplayed = false
      this.loading = false
      this.noResult = false
    }, 100)
  }
  
  adressClick(nom:string) {
    console.log('cityClick',nom)
    this.control?.setValue(nom)
    this.closeList()
  }

  onCityKeyUp(event:any) {
    console.log('keyUp',event,)
    console.log('keyUp city value =',this.control?.value)
  }

}
