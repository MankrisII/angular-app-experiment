import { Component } from '@angular/core';

@Component({
  selector: 'app-close-button',
  standalone: true,
  imports: [],
  template: `<a class="closeButton"></a>`,
  styles: `
    .closeButton {
      display: block;
      position: relative;
      background-color: var(--secondary-color);
      border-radius: 100px;
      width: 20px;
      height: 20px;
      /* top: 8px;
              right: 94px; */
      color: rgb(86, 78, 194);
      cursor: pointer;
      text-decoration: none;
    }

    .closeButton::after,
    .closeButton::before {
      content: '';
      display: block;
      position: absolute;
    }

    .closeButton::after {
      border-bottom: 2px solid var(--primary-color);
      width: 12px;
      height: 2px;
      rotate: 45deg;
      left: 5px;
      top: 7px;
    }

    .closeButton::before {
      border-left: 2px solid var(--primary-color);
      width: 2px;
      height: 12px;
      rotate: -135deg;
      left: 7px;
      top: 3px;
    }
  `,
})
export class CloseButtonComponent {}
