import { Component, OnInit, Output } from '@angular/core';
import { TourNavService } from '../tour-nav.service';
import { Router } from '@angular/router';
import { EventEmitter } from '@angular/core';

interface TourData {
  name: string;
  title: string;
  item: number;
  time: number;
};

@Component({
  selector: 'app-tour-list',
  templateUrl: './tour-list.component.html',
  styleUrls: ['./tour-list.component.scss']
})
export class TourListComponent implements OnInit {
  tourIdx: number;
  tours: Array<TourData>;

  @Output()
  wantClose = new EventEmitter();

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
      this.wantClose.emit('close');
    }

    this.tourIdx = this.tourNav.tourIdx;
  }
}