import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-exhibit-details',
  templateUrl: './exhibit-details.component.html',
  styleUrls: ['./exhibit-details.component.scss']
})
export class ExhibitDetailsComponent implements OnInit {
  name: string;

  title: string;
  time: string;
  describe: string;

  constructor(
    private route: ActivatedRoute,
  ) {
    route.parent.paramMap.pipe(
      switchMap((params: ParamMap) => [params.get('name')]),
    ).subscribe(val => this.name = val);
  }

  ngOnInit() {
    this.title = 'Teracotta statuette of a draped woman';
    this.time = 'Early 3rd centruy B.C.';
    this.describe = 'The variety among terracotta statuettes of draped ladies occurs principally in their hairdos and in the fall of their draperies, with the concomitant play of folds.';
  }

}
