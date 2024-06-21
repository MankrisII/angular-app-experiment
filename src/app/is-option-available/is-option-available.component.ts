import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-is-option-available',
  standalone: true,
  imports: [],
  template: `
   <p>{{label}} : {{value ? 'yes':'no'}}</p>
  `,
  styles: ``
})
export class IsOptionAvailableComponent {
  @Input() label!: string
  @Input() value!: boolean
}
