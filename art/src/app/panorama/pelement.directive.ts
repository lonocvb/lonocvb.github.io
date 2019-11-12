import { Directive, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[appPelement]'
})
export class PelementDirective {
  @Input() lon: number = 0;
  @Input() lat: number = 0;
  @Input() opacity: number = 1;

  constructor(
    private el: ElementRef,
  ) {
    el.nativeElement.classList.add('p-element');
    el.nativeElement.style.position = 'absolute';
  }

  ngAfterViewInit() {
    this.el.nativeElement.style.opacity = this.opacity;
    this.el.nativeElement.style.transform = `scale(${Math.pow(this.opacity, 0.33) / 2.0})`;
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
