import { Component, OnInit, ViewChildren } from '@angular/core';
import { Location } from '@angular/common';
import { TourNavService, TourData } from '../tour-nav.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FloatTopDirective } from '../float-top.directive';

@Component({
  selector: 'app-tour-details',
  templateUrl: './tour-details.component.html',
  styleUrls: ['./tour-details.component.scss']
})
export class TourDetailsComponent implements OnInit {
  name: string;
  tour: TourData;

  @ViewChildren(FloatTopDirective)
  floatTopElements: Array<FloatTopDirective>;

  constructor(
    private route: ActivatedRoute,
    private tourNav: TourNavService,
    private router: Router,
    private location: Location,
  ) {}

  ngOnInit() {
    this.name = this.route.snapshot.paramMap.get('name');
    this.tour = this.tourNav.getByName(this.name);
  }

  artwrokImageLoaded() {
    FloatTopDirective.float(this.floatTopElements);
  }

  close() {
    this.location.back();
  }

  startTour() {
    this.tourNav.startTourName(this.name);
    this.router.navigate(['/']);
  }

}
