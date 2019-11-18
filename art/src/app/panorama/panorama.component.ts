import { Component, OnInit, ElementRef, ViewChild, HostListener, ViewChildren, QueryList, Input, ContentChildren } from '@angular/core';

import PanoramaViewer from './lib/PanoramaViewer';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { PelementDirective } from './pelement.directive';

@Component({
  selector: 'app-panorama',
  templateUrl: './panorama.component.html',
  styleUrls: ['./panorama.component.scss']
})
export class PanoramaComponent implements OnInit {

  private _imagePath: string;

  @Input()
  get imagePath() {
    return this._imagePath;
  }
  set imagePath(val: string) {
    this._imagePath = val;
    if (this.viewer) {
      this.viewer.changeTexture(this.location.prepareExternalUrl(val));
    }
  }

  @Input()
  set sensorType(val: number) {
    if (this.viewer) {
      this.viewer.setSensorType(val);
    }
  }

  @Input()
  set enable(val: boolean) {
    if (this.viewer) {
      if (val) {
        this.viewer.startAnimate();
      } else {
        this.viewer.stopAnimate();
      }
    }
  }

  @ViewChild('panoramaCanvas', { static: true })
  canvas: ElementRef;

  @ViewChildren(PelementDirective)
  pElements: QueryList<PelementDirective>;

  @ContentChildren(PelementDirective)
  pcElements: QueryList<PelementDirective>;

  viewer: any;

  constructor(
    private router: Router,
    private location: Location,
  ) {
  }

  ngOnInit() {}

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.viewer.changeSize(
      this.canvas.nativeElement.parentElement.offsetWidth,
      this.canvas.nativeElement.parentElement.offsetHeight);
  }

  ngAfterViewInit() {
    this.viewer = new PanoramaViewer({
      canvas: this.canvas.nativeElement,
      imagePath: this.location.prepareExternalUrl(this._imagePath),
      width: this.canvas.nativeElement.parentElement.offsetWidth,
      height: this.canvas.nativeElement.parentElement.offsetHeight,

      textLabels: [
        { text: 'top', position: { lon: 0, lat: 90 }, args: { yo: 'yo' } },
        { text: 'bottom', position: { lon: 0, lat: -90 }, args: { yo: 'yo' } },
      ],
      onLabelClick: label => this.router.navigate(['exhibit', label.text, 'info']),

      elementLabels: this.pElements.map(p => p.toLabel()).concat(this.pcElements.map(p => p.toLabel())),
    });

    this.viewer.startAnimate();
  }

  ngOnDestroy()	{
    this.viewer.unlisten();
  }
}
