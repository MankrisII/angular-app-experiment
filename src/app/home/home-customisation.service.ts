import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HomeCustomisationService {
  // TODO save in cookie
  display : string = "list"
  constructor() { }

  setDisplayType(type: string) {
    this.display = type
  }

  getDisplayType(): string{
    return this.display
  }
}
