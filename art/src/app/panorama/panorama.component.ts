import { Component, OnInit, ElementRef, ViewChild, HostListener, ViewChildren, QueryList, Input, ContentChildren } from '@angular/core';

import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { PelementDirective } from './pelement.directive';
import { TourNavService } from '../tour-nav.service';

import PanoramaViewer from './lib/PanoramaViewer';
import PanoramaCameraControl from './lib/PanoramaCameraControl';
import SensorSource from './lib/SensorSource';
import SensorSourceType from './lib/SensorSourceType';

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

  sensorSource: SensorSource;

  @Input()
  set sensorType(val) {
    this.sensorSource.setType(val);
  }
  get sensorType() {
    return this.sensorSource.getType();
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

  @ViewChild('panramaMain', { static: true })
  mainElement: ElementRef;

  @ViewChild('panoramaCanvas', { static: true })
  canvas: ElementRef;

  @ViewChildren(PelementDirective)
  pElements: QueryList<PelementDirective>;

  @ContentChildren(PelementDirective)
  pcElements: QueryList<PelementDirective>;

  viewer: any;

  constructor(
    private tourNav: TourNavService,
    private router: Router,
    private location: Location,
  ) {
    if (this.tourNav.cameraControl) {
      this.sensorSource = this.tourNav.cameraControl.getSource();
    } else {
      this.sensorSource = new SensorSource(SensorSourceType.MANUAL);
      this.tourNav.cameraControl = new PanoramaCameraControl(this.sensorSource);
    }
  }

  ngOnInit() {}

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.viewer.changeSize(
      this.mainElement.nativeElement.offsetWidth,
      this.mainElement.nativeElement.offsetHeight);
  }

  ngAfterViewInit() {
    this.sensorSource.listen(this.mainElement.nativeElement);

    this.viewer = new PanoramaViewer({
      canvas: this.canvas.nativeElement,
      imagePath: this.location.prepareExternalUrl(this._imagePath),
      width: this.mainElement.nativeElement.offsetWidth,
      height: this.mainElement.nativeElement.offsetHeight,

      cameraControl: this.tourNav.cameraControl,
/*
      textLabels: [
        { text: 'top', position: { lon: 0, lat: 90 }, args: { yo: 'yo' } },
        { text: 'bottom', position: { lon: 0, lat: -90 }, args: { yo: 'yo' } },
      ],
      onLabelClick: label => this.router.navigate(['exhibit', label.text, 'info']),
*/
      elementLabels: this.pElements.map(p => p.toLabel()).concat(this.pcElements.map(p => p.toLabel())),
    });

    this.viewer.startAnimate();
  }

  ngOnDestroy() {
    this.sensorSource.unlisten();
  }

}
