import { NgClass } from '@angular/common';
import { Component, EventEmitter, OnInit, input } from '@angular/core';
import { Input, Output } from '@angular/core';


@Component({
  selector: 'app-list-sorter-heading',
  standalone: true,
  imports: [NgClass],
  template: `
    <a (click)="sort()"
    [ngClass]="[_orderedBy == by ? 'active' : '',order]"
    >{{label}}</a>
  `,
  styleUrl: './list-sorter-heading.component.css'
})
export class ListSorterHeadingComponent{
  @Input() label!: string
  @Input() by! :string
  @Output() ordering = new EventEmitter<any>() 
  order: string = "DESC"
  _orderedBy : String | undefined = ''
  currentClasses = {}
  constructor() {
    
  }
  @Input() set orderedBy(value: string | undefined) {
    this._orderedBy = value
    if(value != this.by) this.order = "DESC"
  }
  
  sort() {
    this.order = this.order == 'ASC' ? 'DESC' : 'ASC'
    this.ordering.emit({ order: { order: this.order, by: this.by } })
  }
   
}
