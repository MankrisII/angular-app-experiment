import { Injectable } from '@angular/core';
import { HousingLocation } from './HousingLocation';
import { Queryoptions } from './queryoptions';

@Injectable({
  providedIn: 'root'
})
export class HousingService {
  housingList: HousingLocation[] = [{
    "id": 0,
    "name": "Acme Fresh Start Housing",
    "city": "Chicago",
    "state": "IL",
    "photo": "/assets/bernard-hermant-CLKGGwIBTaY-unsplash.jpg",
    "availableUnits": 4,
    "wifi": true,
    "laundry": true
  },
  {
    "id": 1,
    "name": "A113 Transitional Housing",
    "city": "Santa Monica",
    "state": "CA",
    "photo": "/assets/brandon-griggs-wR11KBaB86U-unsplash.jpg",
    "availableUnits": 0,
    "wifi": false,
    "laundry": true
  },
  {
    "id": 2,
    "name": "Warm Beds Housing Support",
    "city": "Juneau",
    "state": "AK",
    "photo": "/assets/i-do-nothing-but-love-lAyXdl1-Wmc-unsplash.jpg",
    "availableUnits": 1,
    "wifi": false,
    "laundry": false
  },
  {
    "id": 3,
    "name": "Homesteady Housing",
    "city": "Chicago",
    "state": "IL",
    "photo": "/assets/ian-macdonald-W8z6aiwfi1E-unsplash.jpg",
    "availableUnits": 1,
    "wifi": true,
    "laundry": false
  },
  {
    "id": 4,
    "name": "Happy Homes Group",
    "city": "Gary",
    "state": "IN",
    "photo": "/assets/krzysztof-hepner-978RAXoXnH4-unsplash.jpg",
    "availableUnits": 1,
    "wifi": true,
    "laundry": false
  },
  {
    "id": 5,
    "name": "Hopeful Apartment Group",
    "state": "CA",
    "photo": "/assets/r-architecture-JvQ0Q5IkeMM-unsplash.jpg",
    "city": "Oakland",
    "availableUnits": 2,
    "wifi": true,
    "laundry": true
  },
  {
    "id": 6,
    "name": "Seriously Safe Towns",
    "city": "Oakland",
    "state": "CA",
    "photo": "/assets/phil-hearing-IYfp2Ixe9nM-unsplash.jpg",
    "availableUnits": 5,
    "wifi": true,
    "laundry": true
  },
  {
    "id": 7,
    "name": "Hopeful Housing Solutions",
    "city": "Oakland",
    "state": "CA",
    "photo": "/assets/r-architecture-GGupkreKwxA-unsplash.jpg",
    "availableUnits": 2,
    "wifi": true,
    "laundry": true
  },
  {
    "id": 8,
    "name": "Seriously Safe Towns",
    "city": "Oakland",
    "state": "CA",
    "photo": "/assets/saru-robert-9rP3mxf8qWI-unsplash.jpg",
    "availableUnits": 10,
    "wifi": false,
    "laundry": false
  },
  {
    "id": 9,
    "name": "Capital Safe Towns",
    "city": "Portland",
    "state": "OR",
    "photo": "/assets/webaliser-_TPTXZd9mOo-unsplash.jpg",
    "availableUnits": 6,
    "wifi": true,
    "laundry": true
    }]
  queyOptions: Queryoptions = {}
  
  constructor() { }

  getHousingLocationList() {
    let h = this.housingList
    return h
  }

  searchHousingLocationByName(search: string) {
    
  }

  getHousingLocationListByQuery(options: Queryoptions) {
    // console.log(this.queyOptions, 'this.queryoptions')
    // console.log(options, "options params")
    options = { ...this.queyOptions, ...options }
    this.queyOptions = options
    // console.log(this.queyOptions, 'merge options')
    
    // filer by name
    let h = this.housingList
    if (options.filterByName) {
      // console.log("filter by name")
      h = h.filter(h => h.name.toLocaleLowerCase().indexOf(options.filterByName!.toLocaleLowerCase()) > -1)
    }

    // order
    if (options.order) {
      // console.log('ordering')
      h = h.sort((a, b) => {
        if (typeof a[options.order?.by as keyof HousingLocation] == "string") { // order text value
          // console.log('string')
          if (String(a[options.order?.by as keyof HousingLocation]).toUpperCase() < String(b[options.order?.by as keyof HousingLocation]).toUpperCase()) { return options.order!.order == 'ASC' ? -1 : 1 }
          if (String(a[options.order?.by as keyof HousingLocation]).toUpperCase() > String(b[options.order?.by as keyof HousingLocation]).toUpperCase()) { return options.order!.order == 'ASC' ? 1 : -1 }
        
        } else if (typeof a[options.order?.by as keyof HousingLocation] == "number") { // order numerical value
          // console.log('number')
          let r = Number(a[options.order?.by as keyof HousingLocation]) - Number(b[options.order?.by as keyof HousingLocation])
          if(options.order?.order == 'DESC') r = r * -1
          return r
        }
        return 0
      })
    
      // no order option = order by id
    } else {
      h = h.sort((a, b) => {
        return Number(a.id) - Number(b.id)
      })
    }
    // console.log(h,"h")
    return h
  }
  
  clearOrdering() {
    delete(this.queyOptions.order)
  }

  getHousingLocationById(id: number | null) {
    if (id !== undefined) {
      return this.housingList.find(h => h.id == id)
    } else {
      return this.getNewLocation()
    }
    
  }
  getNewLocation(): HousingLocation {
    return {
      id: this.getNextId(),
      name: '',
      city: '',
      state: '',
      photo: '',
      availableUnits: 0,
      wifi: false,
      laundry: false
    }
  }

  getOrderBy() {
    return this.queyOptions.order?.by
    // if(this.queyOptions.order?.by)
  }

  getNextId(): number{
    return this.housingList[this.housingList.length - 1].id + 1
  }


  editHousingLocation(data: HousingLocation) {
    // casting available units valu to Number
    data.availableUnits = Number(data.availableUnits)
    let housingIndex = this.housingList.findIndex((h) => h.id == data.id)
    this.housingList[housingIndex] = data
  }

  addHousingLocation(data: HousingLocation) {
    this.housingList.push(data)
  }

  deleteHousingLocation(id: number) {
    let index = this.housingList.findIndex((h) => h.id == id)
    this.housingList.splice(index, 1)
  }

}
