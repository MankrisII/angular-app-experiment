import { Component } from '@angular/core';

@Component({
  selector: 'app-overlay',
  standalone: true,
  imports: [],
  template: `<div id="overlay-background">
    <div id="overlay-content">
      <ng-content></ng-content>
    </div>
  </div>`,
  styles: `#overlay-background{
            position: absolute;
            z-index: 100;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, .25);
            /*text-align: center;
            vertical-align: middle;*/
          }

          #overlay-content{
            transform: translateY(-50%)translateX(-50%);
            position: absolute;
            top : 50%;
            left : 50%;
            
            display: inline-block;
          }`,
})
export class OverlayComponent {}
