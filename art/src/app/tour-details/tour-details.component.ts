import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { TourNavService, TourData } from '../tour-nav.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-tour-details',
  templateUrl: './tour-details.component.html',
  styleUrls: ['./tour-details.component.scss']
})
export class TourDetailsComponent implements OnInit {
  id: number;
  tour: TourData;

  constructor(
    private route: ActivatedRoute,
    private tourNav: TourNavService,
    private router: Router,
    private location: Location,
  ) {}

  ngOnInit() {
    this.id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.tour = this.tourNav.getList()[this.id];
  }

  close() {
    this.location.back();
  }

  startTour() {
    this.tourNav.startTour(this.id);
    this.router.navigate(['/']);
  }

}
