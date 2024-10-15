import { NgClass } from '@angular/common';
import { Component, EventEmitter, OnInit, inject, input } from '@angular/core';
import { Input, Output } from '@angular/core';
import { SorterOptions } from './sorter-options';
import { SorterService } from './sorter.service';

@Component({
  selector: 'app-list-sorter-heading',
  standalone: true,
  imports: [NgClass],
  template: `
    <a
      (click)="sort()"
      [ngClass]="[
        this.options.sortable &&
        this.sorterService.sortSig().sortOn == this.options.sortOn
          ? 'active'
          : '',
        this.options.sortable ? this.sorterService.sortSig().order : '',
        this.options.sortable ? 'sortable' : ''
      ]"
      >{{ this.options.label }}</a
    >
  `,
  styleUrl: './list-sorter-heading.component.css',
})
export class ListSorterHeadingComponent {
  @Input() options!: SorterOptions;
  @Output() onSort = new EventEmitter();
  sorterService = inject(SorterService);

  constructor() {}

  sort() {
    this.sorterService.sortSig.update((query) => {
      return {
        order: query.order == 'asc' ? 'desc' : 'asc',
        sortOn: this.options.sortOn,
      };
    });
    this.onSort.emit(this.sorterService.sortSig());
  }
}
