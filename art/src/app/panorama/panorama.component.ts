import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';

import PanoramaViewer from './lib/PanoramaViewer';

@Component({
  selector: 'app-panorama',
  templateUrl: './panorama.component.html',
  styleUrls: ['./panorama.component.scss']
})
export class PanoramaComponent implements OnInit {
  isGengar: boolean;

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

  viewer: any;

  footerMenuShow: boolean = false;
  tourListShow: boolean = false;

  constructor() {

    const windowAny: any = window;
    this.isGengar = (typeof windowAny.gengar !== 'undefined');
  }

  ngOnInit() {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.viewer.changeSize(window.innerWidth, window.innerHeight);
  }

  ngAfterViewInit() {

    this.viewer = new PanoramaViewer({
      canvas: this.canvas.nativeElement,
      imagePath: '/assets/360/04.jpg',
      width: window.innerWidth,
      height: window.innerHeight,

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
      onLabelClick: label => console.log(label.text),
    });

    this.viewer.startAnimate();

  }

  ngOnDestroy()	{
    this.viewer.unlisten();
  }

  toggleFooterMenu() {
    this.footerMenuShow = !this.footerMenuShow;
  }

  toggleTourList() {
    this.tourListShow = !this.tourListShow;
  }

}
