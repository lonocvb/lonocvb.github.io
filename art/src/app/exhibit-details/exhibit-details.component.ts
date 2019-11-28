import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExhibitService, ExhibitData } from '../exhibit.service';

@Component({
  selector: 'app-exhibit-details',
  templateUrl: './exhibit-details.component.html',
  styleUrls: ['./exhibit-details.component.scss']
})
export class ExhibitDetailsComponent implements OnInit {
  name: string;

  data: ExhibitData;

  constructor(
    private exhibitService: ExhibitService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.name = this.route.parent.snapshot.paramMap.get('name');
    this.data = this.exhibitService.getByName(this.name);
  }

}
