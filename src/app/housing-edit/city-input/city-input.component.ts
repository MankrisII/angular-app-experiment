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
  cityListSelectedId: number | null = null
  cityListPreviousSelectedId: number | null = null
  cityInputElement : HTMLElement | null = null
  http: HttpClient
  @Input() control!: FormControl
  timer: any
  previousCityValue: any = ''
  displayList:boolean = false
  loading: boolean = false
  noResult : boolean = false

  constructor(http: HttpClient) {
    this.http = http
  }

  ngOnInit(): void {

    this.cityInputElement = document.getElementById('city')
    

    this.cityInputElement?.addEventListener('keyup', (event) => {
      console.log('listener', event)
      
      // close city list on Escape Key press
      if (event.code == "Escape") {
        this.closeList()
        return
      }

      if ( this.displayList && this.cityList != null) {
        this.cityListPreviousSelectedId = this.cityListSelectedId

        // On Enter key press, set city input value from selected item
        if (event.code == "Enter") {
          this.control?.setValue(this.cityList[this.cityListSelectedId!].nom+" "+this.cityList[this.cityListSelectedId!].codePostal)
          this.closeList()
          this.previousCityValue = this.control.value
          return
        }
        
        // listening for keyup to navigate with keyboard in autocomplete city list
        if (event.code == "ArrowUp") {
          console.log('arrowup')
          if (this.cityListSelectedId == null || this.cityListSelectedId == 0) {
            this.cityListSelectedId = this.cityList.length - 1
          } else {
            this.cityListSelectedId --
          }
          this.updateCityList()
          return
        
        } else if (event.code == 'ArrowDown') {
          console.log('arrowdown')
          if (this.cityListSelectedId == null || this.cityListSelectedId == this.cityList.length - 1) {
            this.cityListSelectedId = 0
          } else {
            this.cityListSelectedId ++
          }
          this.updateCityList()
          return
        }
      }

      if (!this.displayList && this.cityList && event.code == 'ArrowDown') {
        this.cityListSelectedId = 0
        this.displayList = true
        this.updateCityList()
        return
      }
    
      clearTimeout(this.timer)
      console.log('timer')
      
      if (this.control.value == this.previousCityValue) return
      
      if (!this.displayList && !this.cityList) {
        this.displayList = true
        this.loading = true
        this.noResult = false
      }

      // request goe.api.gouv to get city
      // execution delayed after the last key pressed
      this.timer = setTimeout(() => {
        // do nothing if city.value is still the same
        
        this.displayList = true
        this.loading = true
        this.noResult = false

        this.previousCityValue = this.control.value
        // this.closeList()

        this.http.get(`https://geo.api.gouv.fr/communes?nom=${this.control.value}`).subscribe(response => {
          // console.log('city keyup response = ', response)
          let cities: any = []
          // decompose cities with multiple postals codes
          for (let c of response as Iterable<any>) {
            // console.log("boucle", c.codesPostaux.join(','))
            // console.log(c.codesPostaux.length)
            if (c.codesPostaux.length == 1) {
              // console.log('1 code postal')
              cities.push({ nom: c.nom, codePostal: c.codesPostaux[0],selected:false });
              
            }else {
              for (let cp of c.codesPostaux) {
                cities.push({ nom: c.nom, codePostal: cp ,selected:false}); 
              }
            }
          }
          // console.log('cities', cities)
          this.loading = false
          if (cities.length > 0) {
            this.cityList = cities
            
          } else {
            this.noResult = true
            // this.closeList()
            this.cityList = null
            this.cityListSelectedId = null
            this.cityListPreviousSelectedId = null
          }
        }
        )
      },400)
    })

    this.cityInputElement?.addEventListener('focusout', (event) => {
      // console.log('focus out')
      this.closeList()
    })

  }

  updateCityList() {
    // console.log('updateCityList')
    // change selected item
    if(this.cityListPreviousSelectedId != null)this.cityList[this.cityListPreviousSelectedId!].selected = false
    this.cityList[this.cityListSelectedId!].selected = true

    // scroll cityList
    let selectedY = 0
    let selectedHeight = (document.getElementById('city-list')?.children[this.cityListSelectedId!] as HTMLElement).offsetHeight
    let cityListHeight = (document.getElementById('city-list') as HTMLElement).offsetHeight
    // console.log('selectedHeight', selectedHeight)
    // console.log('cityListHeight',cityListHeight)
    
    for (let i = 0; i < this.cityListSelectedId! ; i++) {
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
    if(this.cityListSelectedId) this.cityList[this.cityListSelectedId!].selected = false
    this.cityListSelectedId = null
    this.cityListPreviousSelectedId = null
    this.displayList = false
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
