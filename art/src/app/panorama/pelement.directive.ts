import { Directive, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[appPelement]'
})
export class PelementDirective {
  @Input() lon: number = 0;
  @Input() lat: number = 0;
  @Input() opacity: number = 1;
  @Input() rb: boolean = false;

  constructor(
    private el: ElementRef,
  ) {
    el.nativeElement.classList.add('p-element');
    el.nativeElement.style.position = 'absolute';
  }

  ngAfterViewInit() {
    if (this.opacity != 1) {
      this.el.nativeElement.style.opacity = this.opacity;
      this.el.nativeElement.style.transform = `scale(${Math.pow(this.opacity, 0.33) / 2.0})`;
    }
    this.el.nativeElement.style.marginTop = `${- this.el.nativeElement.offsetHeight}px`;
    if (this.rb) {
      this.el.nativeElement.style.marginLeft = `${- this.el.nativeElement.offsetWidth}px`;
    }
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
