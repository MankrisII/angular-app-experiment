import { NgClass, NgIf, NgStyle } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, fromEvent ,map, of} from 'rxjs';

@Component({
  selector: 'app-city-input',
  standalone: true,
  imports: [NgClass,NgIf,ReactiveFormsModule,NgStyle],
  templateUrl: './city-input.component.html',
  styleUrl: './city-input.component.css'
})
export class CityInputComponent implements OnInit {
  cityList: any = null
  selectedCityId: number | null = null
  previousSelectedCityId: number | null = null
  cityInputElement : HTMLElement | null = null
  http: HttpClient
  @Input() control!: FormControl
  timer: any
  previousCityValue: any = ''
  isListDisplayed:boolean = false
  loading: boolean = false
  noResult : boolean = false

  constructor(http: HttpClient) {
    this.http = http
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
    if (this.isListDisplayed && this.cityList != null) {
      this.previousSelectedCityId = this.selectedCityId;

      // On Enter key press, set city input value from selected item
      if (event.code == 'Enter') {
        this.selectCity()
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
    if (!this.isListDisplayed && this.cityList && event.code == 'ArrowDown') {
      this.selectedCityId = 0;
      this.isListDisplayed = true;
      this.updateCityList();
      return;
    }

    clearTimeout(this.timer);
    console.log('timer');

    // value hasn't changed
    if (this.control.value == this.previousCityValue) return;

    // open dropdown in loading mode at first typping when field is empty
    if (!this.isListDisplayed && !this.cityList) {
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
      this.selectedCityId = null;

      this.previousCityValue = this.control.value;
      // this.closeList()

      this.http
        .get(`https://geo.api.gouv.fr/communes?nom=${this.control.value}`)
        .subscribe((response) => {
         
          console.log('city keyup response = ', response)
          if ((response as Array<any>).length > 0) {
            let cities: any = [];
            // decompose cities with multiple postals codes
            for (let city of response as Iterable<any>) {
              if (city.codesPostaux.length == 1) {
                cities.push({
                  nom: city.nom,
                  codePostal: city.codesPostaux[0],
                  selected: false,
                });
              } else {
                for (let cp of city.codesPostaux) {
                  cities.push({ nom: city.nom, codePostal: cp, selected: false });
                }
              }
            }
            this.cityList = cities;

          } else {
            this.noResult = true;
            this.cityList = null;
            this.selectedCityId = null;
            this.previousSelectedCityId = null;
          }

          this.loading = false;
        });
    }, 400);
  }

  mouveUp() {
   if (this.selectedCityId == null || this.selectedCityId == 0) {
     this.selectedCityId = this.cityList.length - 1;
   } else {
     this.selectedCityId--;
   }
   this.updateCityList(); 
  }

  mouveDown() {
    if (
      this.selectedCityId == null ||
      this.selectedCityId == this.cityList.length - 1
    ) {
      this.selectedCityId = 0;
    } else {
      this.selectedCityId++;
    }
    this.updateCityList();
  }

  selectCity() {
    this.control?.setValue(
      this.cityList[this.selectedCityId!].nom +
        ' ' +
        this.cityList[this.selectedCityId!].codePostal
    );
    this.closeList();
    this.previousCityValue = this.control.value;
  }

  ngOnInit(): void {
  }

  updateCityList() {
    // console.log('updateCityList')
    // change selected item
    if(this.previousSelectedCityId != null)this.cityList[this.previousSelectedCityId!].selected = false
    this.cityList[this.selectedCityId!].selected = true

    // scroll cityList
    let selectedY = 0
    let selectedHeight = (document.getElementById('city-list')?.children[this.selectedCityId!] as HTMLElement).offsetHeight
    let cityListHeight = (document.getElementById('city-list') as HTMLElement).offsetHeight
    // console.log('selectedHeight', selectedHeight)
    // console.log('cityListHeight',cityListHeight)
    
    for (let i = 0; i < this.selectedCityId! ; i++) {
      selectedY += (document.getElementById('city-list')?.children[i]as HTMLElement).offsetHeight
    }

    // console.log('selectedY', selectedY)
    if (selectedY - selectedHeight - (document.getElementById('city-list') as HTMLElement).scrollTop < 0) {
      // scroll up
      document.getElementById('city-list')?.scroll(0, selectedY)
    } else if (selectedY + selectedHeight - (document.getElementById('city-list') as HTMLElement).scrollTop > cityListHeight) {
      // scroll down
      document.getElementById('city-list')?.scroll(0, selectedY - cityListHeight + selectedHeight)
    }
    // console.log("this.cityListSelectedId",this.cityListSelectedId)
  }

  closeList() {
    console.log('closelist')
    if(this.selectedCityId) this.cityList[this.selectedCityId!].selected = false
    this.selectedCityId = null
    this.previousSelectedCityId = null
    this.isListDisplayed = false
    this.loading = false
    this.noResult = false
  }
  
  cityClick(nom:string) {
    console.log('cityClick',nom)
    this.control?.setValue(nom)
    this.closeList()
  }

  onCityKeyUp(event:any) {
    console.log('keyUp',event,)
    console.log('keyUp city value =',this.control?.value)
  }

}
