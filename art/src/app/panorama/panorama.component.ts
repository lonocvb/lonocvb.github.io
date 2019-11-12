import { Component, OnInit, ElementRef, ViewChild, HostListener, ViewChildren, QueryList } from '@angular/core';

import PanoramaViewer from './lib/PanoramaViewer';
import { Router } from '@angular/router';
import { TourNavService } from '../tour-nav.service';
import { PelementDirective } from './pelement.directive';

@Component({
  selector: 'app-panorama',
  templateUrl: './panorama.component.html',
  styleUrls: ['./panorama.component.scss']
})
export class PanoramaComponent implements OnInit {
  isGengar: boolean;
  inTour: boolean;

  _sensorType: number = 1;

  get sensorType() {
    return this._sensorType;
  }
  set sensorType(val: number) {
    this._sensorType = val;
    this.viewer.setSensorType(val);
  }

  @ViewChild('panoramaCanvas', {static: false})
  canvas: ElementRef;

  @ViewChildren(PelementDirective)
  pElements: QueryList<PelementDirective>;

  viewer: any;

  footerMenuShow: boolean = false;
  tourListShow: boolean = false;

  constructor(
    private router: Router,
    private tourNav: TourNavService,
  ) {
    const windowAny: any = window;
    this.isGengar = (typeof windowAny.gengar !== 'undefined');
  }

  ngOnInit() {
    this.inTour = this.tourNav.tourIdx != -1;
    this.tourNav.tourChange.subscribe(val => this.inTour = val !=  -1);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.viewer.changeSize(window.innerWidth, window.innerHeight);
  }

  ngAfterViewInit() {

    console.log(this.pElements.map(p => p.toLabel()));

    this.viewer = new PanoramaViewer({
      canvas: this.canvas.nativeElement,
      imagePath: '/assets/360/04.jpg',
      width: window.innerWidth,
      height: window.innerHeight,
/*
      textLabels: [
        { text: '0,0', position: { lon: 0, lat: 0 }, args: { yo: 'yo' } },
        { text: '45,0', position: { lon: 45, lat: 0 }, args: { yo: 'yo' } },
        { text: '90,0', position: { lon: 90, lat: 0 }, args: { yo: 'yo' } },
        { text: '135,0', position: { lon: 135, lat: 0 }, args: { yo: 'yo' } },
        { text: '180,0', position: { lon: 180, lat: 0 }, args: { yo: 'yo' } },
        { text: '225,0', position: { lon: 225, lat: 0 }, args: { yo: 'yo' } },
        { text: '270,0', position: { lon: 270, lat: 0 }, args: { yo: 'yo' } },
        { text: '315,0', position: { lon: 315, lat: 0 }, args: { yo: 'yo' } },

        { text: '0,45', position: { lon: 0, lat: 45 }, args: { yo: 'yo' } },
        { text: '90,45', position: { lon: 90, lat: 45 }, args: { yo: 'yo' } },
        { text: '180,45', position: { lon: 180, lat: 45 }, args: { yo: 'yo' } },
        { text: '270,45', position: { lon: 270, lat: 45 }, args: { yo: 'yo' } },

        { text: '0,-45', position: { lon: 0, lat: -45 }, args: { yo: 'yo' } },
        { text: '90,-45', position: { lon: 90, lat: -45 }, args: { yo: 'yo' } },
        { text: '180,-45', position: { lon: 180, lat: -45 }, args: { yo: 'yo' } },
        { text: '270,-45', position: { lon: 270, lat: -45 }, args: { yo: 'yo' } },

        { text: 'top', position: { lon: 0, lat: 90 }, args: { yo: 'yo' } },
        { text: 'bottom', position: { lon: 0, lat: -90 }, args: { yo: 'yo' } },
      ],
      onLabelClick: label => this.router.navigate(['exhibit', label.text, 'info']),
*/
      elementLabels: this.pElements.map(p => p.toLabel()),
    });

    this.viewer.startAnimate();

  }

  ngOnDestroy()	{
    this.viewer.unlisten();
  }

  toggleFooterMenu() {
    this.footerMenuShow = !this.footerMenuShow;
  }

  showTourList() {
    this.tourListShow = true;
    this.viewer.stopAnimate();
  }

  closeAll() {
    this.tourListShow = false;
    this.viewer.startAnimate();
  }

  // TODO
  btnNavResturant() {}
  btnNavToilet() {}
  btnNavElevator() {}
  btnNavExit() {}
}
