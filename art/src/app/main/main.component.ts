import { Component, OnInit } from '@angular/core';
import { TourNavService } from '../tour-nav.service';
import { startWith } from 'rxjs/operators';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  isGengar: boolean;
  inTour: boolean;

  footerMenuShow: boolean = false;
  tourListShow: boolean = false;

  sensorType: number = 1;

  constructor(
    private tourNav: TourNavService,
  ) {
    const windowAny: any = window;
    this.isGengar = (typeof windowAny.gengar !== 'undefined');
    this.sensorType = (this.isGengar) ? 4 : 1;

    if (this.tourNav.cameraControl) {
      this.sensorType = this.tourNav.cameraControl.getSource().getType();
    }
  }

  ngOnInit() {
    this.tourNav.tourChange.pipe(
      startWith(-1),
    ).subscribe(val => this.inTour = val !=  -1);
  }

  toggleFooterMenu() {
    this.footerMenuShow = !this.footerMenuShow;
  }

  showTourList() {
    this.tourListShow = true;
  }

  closeAll() {
    this.tourListShow = false;
  }

  navPaths = [
    'assets/360/AR-room.png',
  ];

  navExtra: number = 0;

  navExtraSet(idx) {
    if (this.navExtra == idx) {
      idx = 0;
    }
    if (this.navExtra != idx) {
      this.navExtra = idx;
    }
  }
}
