import { NgClass, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, fromEvent ,map, of} from 'rxjs';

@Component({
  selector: 'app-city-input',
  standalone: true,
  imports: [NgClass,NgIf,ReactiveFormsModule],
  templateUrl: './city-input.component.html',
  styleUrl: './city-input.component.css'
})
export class CityInputComponent implements OnInit {
  cityList: any = null
  cityListSelectedId: number | null = null
  cityListPreviousSelectedId: number | null = null
  http: HttpClient
  @Input() control! : FormControl

  constructor(http: HttpClient) {
    this.http = http
  }

  ngOnInit(): void {
    fromEvent<KeyboardEvent>(document.getElementById('city')!, 'keyup').pipe(
      map(event => {
        if (event.code == "Enter") {
          throw 'stop event propagation'
          // console.log('stop event propagation')
          // return false
        } 
        return event
      }),
      catchError(() => of('caught error!')),
      debounceTime(500),
      map(x => this.control?.value),
      distinctUntilChanged()
    ).subscribe(nom => {
      // console.log(nom, "nom")
      
      this.closeList()
      this.http.get(`https://geo.api.gouv.fr/communes?nom=${nom}`).subscribe(response => {
        // console.log('city keyup response = ', response)
        let cities: any = []
        // decompose cities with multiple postals codes
        for (let c of response as Iterable<any>) {
          // console.log("boucle", c.codesPostaux.join(','))
          // console.log(c.codesPostaux.length)
          if (c.codesPostaux.length == 1) {
            // console.log('1 code postal')
            cities.push({ nom: c.nom, codePostal: c.codesPostaux[0],selected:false });
            
          }
          else {
            for (let cp of c.codesPostaux) {
              cities.push({ nom: c.nom, codePostal: cp ,selected:false}); 
            }
          }
        }
        // console.log('cities', cities)
        if (cities.length > 0) this.cityList = cities
        else this.closeList()
        // this.cityList = cities.length > 0 ? cities : null
      }
      )
    })

    // Listening click on document for closing autocomplete list
    fromEvent(document, 'click').subscribe(
      event => {
        console.log('document click', event.target)
        if (event.target != document.getElementById('city')) {
          this.closeList()
          
        }
      }
    )

    
    fromEvent<KeyboardEvent>(document, 'keyup').subscribe(
      event  => {
        if (event.target == document.getElementById('city') && this.cityList != null) {
          this.cityListPreviousSelectedId = this.cityListSelectedId
          console.log(event)
          // Listening keybordeEvent enter key on autocomplete list
          if (event.code == "Enter") {
            this.control?.setValue(this.cityList[this.cityListSelectedId!].nom+" "+this.cityList[this.cityListSelectedId!].codePostal)
            this.closeList()
            return
          }
          
          // listening for keyup for navigate with keyboard in autocomplete list
          if (event.code == "ArrowUp") {
            console.log('arrowup')
            if (this.cityListSelectedId == null || this.cityListSelectedId == 0) {
              this.cityListSelectedId = this.cityList.length - 1
            } else {
              this.cityListSelectedId --
            }
            this.updateCityList()
          
          } else if (event.code == 'ArrowDown') {
            console.log('arrowdown')
            if (this.cityListSelectedId == null || this.cityListSelectedId == this.cityList.length - 1) {
              this.cityListSelectedId = 0
            } else {
              this.cityListSelectedId ++
            }
            this.updateCityList()
          }
        }
      }
    )
  }

  updateCityList() {
    // console.log('updateCityList')
    // change selected item
    if(this.cityListPreviousSelectedId != null)this.cityList[this.cityListPreviousSelectedId!].selected = false
    this.cityList[this.cityListSelectedId!].selected = true

    // TODO fix : scrolling isn't accurate
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
    this.cityList = null
    this.cityListSelectedId = null
    this.cityListPreviousSelectedId = null
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


  // onCityFocusOut(event: any) {
  //   console.log("focusOut")
  //   this.cityList = null
  // }

  // change(nom:any) {
  //   console.log('change',nom)
  //   this.http.get("https://geo.api.gouv.fr/communes?nom=${nom}").subscribe(reponse => {
  //     console.log('change response =',Response)
  //     }
  //   )
  // }

}
