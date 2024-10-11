import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-location-details',
  standalone: true,
  imports: [],
  template: ` <p>{{ address }}</p> `,
  styles: `
    p {
      padding-left: 20px;
      position: relative;
    }
    p:before {
      content: url('/assets/location-pin.svg');
      position: absolute;
      top: -5px;
      left: -5px;
    }
  `,
})
export class LocationDetailsComponent {
  @Input() address!: string | undefined;
}
