import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, switchMap, tap, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-exhibits',
  templateUrl: './exhibits.component.html',
  styleUrls: ['./exhibits.component.scss']
})
export class ExhibitsComponent implements OnInit {

  pos$: Observable<string>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.pos$ = this.router.events.pipe(
      filter(evt => evt instanceof NavigationEnd),
      switchMap((evt: NavigationEnd) => [evt.urlAfterRedirects.split('/').pop()]),
      startWith(this.router.url.split('/').pop()),
    );
  }

}
