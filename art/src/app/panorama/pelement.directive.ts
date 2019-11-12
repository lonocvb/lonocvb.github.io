import { Directive, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[appPelement]'
})
export class PelementDirective {
  @Input() lon: number = 0;
  @Input() lat: number = 0;

  constructor(
    private el: ElementRef,
  ) {
    el.nativeElement.classList.add('p-element');
    el.nativeElement.style.position = 'absolute';
  }

  toLabel() {
    return {
      position: {
        lon: this.lon,
        lat: this.lat,
      },
      element: this.el.nativeElement,
    }
  }
}
