import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-exhibits',
  templateUrl: './exhibits.component.html',
  styleUrls: ['./exhibits.component.scss']
})
export class ExhibitsComponent implements OnInit {

  name: string = '';
  pos: string = 'info';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.router.events.pipe(
      filter(evt => evt instanceof NavigationEnd),
      switchMap((evt: NavigationEnd) => [evt.urlAfterRedirects.split('/').pop()]),
    ).subscribe(url => this.pos = url);
    this.pos = this.router.url.split('/').pop();

    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => [params.get('name')]),
    ).subscribe(val => this.name = val);
  }

}
