import { Component, OnInit } from '@angular/core';
import { TourNavService } from '../tour-nav.service';
import { startWith } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  isGengar: boolean;
  inTour: boolean;

  footerMenuShow: boolean = false;

  sensorType_: number = 1;
  set sensorType(val) {
    this.sensorType_ = val;
  }
  get sensorType() {
    return this.sensorType_;
  }

  navPaths = [
    'assets/360/AR-room.png',
    'assets/360/AR-room-1.png',
    'assets/360/AR-room-2.png',
    'assets/360/AR-room-3.png',
  ];
  navIdx: number = 0;

  navExtra: number = 0;

  constructor(
    private router: Router,
    private tourNav: TourNavService,
  ) {
    const windowAny: any = window;
    this.isGengar = (typeof windowAny.gengar !== 'undefined');
    this.sensorType = (this.isGengar) ? 4 : 1;
  }

  ngOnInit() {
    this.tourNav.tourChange.pipe(
      startWith(-1),
    ).subscribe(val => this.inTour = val !=  -1);

    this.navIdx = this.tourNav.tourIdx + 1;

    if (this.tourNav.cameraControl) {
      this.sensorType = this.tourNav.cameraControl.getSource().getType();
    }
  }

  toggleFooterMenu() {
    this.footerMenuShow = !this.footerMenuShow;
  }

  showTourList() {
    this.router.navigate(['index', {outlets: {popup: 'tourlist'}}]);
  }

  navExtraSet(idx) {
    if (this.navExtra == idx) {
      idx = 0;
    }
    if (this.navExtra != idx) {
      this.navExtra = idx;
    }
  }
}
