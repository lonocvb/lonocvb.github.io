import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appFloatTop]'
})
export class FloatTopDirective {

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {
  }

  static float(elements: Array<FloatTopDirective>) {

    const histHeight = {};
    for (let e of elements) {
      const n = e.el.nativeElement;
      e.renderer.setStyle(n, 'margin-top', `0px`);

      const key = n.offsetLeft;
      const head = n.offsetTop;
      const lastTail = (typeof histHeight[key] !== 'undefined') ? histHeight[key] : head;
      const offset = head - lastTail;

      histHeight[key] = lastTail + n.clientHeight;

      e.renderer.setStyle(n, 'margin-top', `${-offset}px`);
    }

  }

}
