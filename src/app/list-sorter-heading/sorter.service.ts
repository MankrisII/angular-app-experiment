import { Injectable, signal } from '@angular/core';
import { SortQuery } from './SortQuery';

@Injectable({
  providedIn: 'root',
})
export class SorterService {
  sortSig = signal<SortQuery>({ order: '', sortOn: '' });

  constructor() {}

  clearOrder() {
    this.sortSig.set({ order: '', sortOn: '' });
  }
}
