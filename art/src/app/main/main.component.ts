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
    'assets/360/x1.jpg',
    'assets/360/x1-rest.jpg',
    'assets/360/x1-toilet.jpg',
    'assets/360/x1-ele.jpg',
    'assets/360/x1-exit.jpg',
  ];
  nav: number = 0;

  navSet(idx) {
    if (this.nav == idx) {
      idx = 0;
    }
    if (this.nav != idx) {
      this.nav = idx;
    }
  }
  btnNavResturant() {
    this.navSet(1);
  }
  btnNavToilet() {
    this.navSet(2);
  }
  btnNavElevator() {
    this.navSet(3);
  }
  btnNavExit() {
    this.navSet(4);
  }
}
