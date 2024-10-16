import { Injectable, signal } from '@angular/core';
import { SortQuery } from './SortQuery';

@Injectable({
  providedIn: 'root',
})
export class SorterService {
  sortSig = signal<SortQuery>({ order: 'asc', sortOn: 'address' });

  constructor() {}

  clearOrder() {
    this.sortSig.set({ order: '', sortOn: '' });
  }

  sort(on: string) {
    let order;
    if (this.sortSig().sortOn != on) {
      order = 'asc';
    } else {
      order = this.sortSig().order == 'asc' ? 'desc' : 'asc';
    }
    this.sortSig.set({ order: order, sortOn: on });
  }
}
