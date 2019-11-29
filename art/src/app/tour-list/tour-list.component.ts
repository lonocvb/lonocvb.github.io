import { Component, OnInit, Output } from '@angular/core';
import { TourNavService, TourData } from '../tour-nav.service';
import { Router } from '@angular/router';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tour-list',
  templateUrl: './tour-list.component.html',
  styleUrls: ['./tour-list.component.scss']
})
export class TourListComponent implements OnInit {
  tourIdx: number;
  tours: Array<TourData>;

  constructor(
    private tourNav: TourNavService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.tourIdx = this.tourNav.tourIdx;
    this.tours = this.tourNav.getList();
  }

  stopTour() {
    if (this.tourNav.tourIdx != -1) {
      this.tourNav.stopTour();
    }

    this.tourIdx = this.tourNav.tourIdx;
  }

  closeAll() {
    this.router.navigate(['index', {outlets: {popup: null}}]);
  }

  onWheel({ deltaY }: WheelEvent, item: Element) {
    item.scrollLeft += deltaY;
  }
}
