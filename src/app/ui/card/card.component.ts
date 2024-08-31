import { Component, EventEmitter, Output, output } from '@angular/core';
import { CloseButtonComponent } from "../button/close-button/close-button.component";

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CloseButtonComponent, CloseButtonComponent],
  template: `<div id="card">
    <app-close-button (click)="handleclose()"></app-close-button>
    <ng-content select=".title"></ng-content>
    <ng-content select=".content"></ng-content>
  </div>`,
  styles: `#card{
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.25);
          }

          app-close-button{
            position: absolute;
            top: 5px;
            right: 5px;
          }`,
})
export class CardComponent {
  @Output() clickClose = new EventEmitter();

  handleclose() {
    console.log('handleclose');
    this.clickClose.emit();
  }
}
