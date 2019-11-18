import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface liveartData {
  preview: string;
  name: string;
  found: boolean;
};

@Component({
  selector: 'app-liveart-scaner',
  templateUrl: './liveart-scaner.component.html',
  styleUrls: ['./liveart-scaner.component.scss']
})
export class LiveartScanerComponent implements OnInit {

  showDialog: boolean = false;
  showCollect: boolean = false;
  showLiveart: boolean = false;

  livearts: Array<liveartData>;

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
    this.livearts = [
      { preview: 'thumbnail.png', name: 'Inlay Depicting', found: true },
      { preview: 'thumbnail.png', name: 'Inlay Depicting', found: false },
      { preview: 'thumbnail.png', name: 'Cynocephalus Ape', found: true },
      { preview: 'thumbnail.png', name: 'Inlay Depicting', found: false },
      { preview: 'thumbnail.png', name: 'Terracotta statuette of a draped woman', found: true },
      { preview: 'thumbnail.png', name: 'Inlay Depicting', found: false },
    ];
  }

  btnQR() {
    //this.showDialog = !this.showDialog;
    this.router.navigate(['/']);
  }

  btnLiveart() {
    this.showCollect = !this.showCollect;
  }

  btnCloseAll() {
    this.showDialog = false;
    this.showCollect = false;
  }

  btnCollect(idx: number) {
    if (!this.livearts[idx].found) {
      return;
    }
    this.btnCloseAll();
    this.showLiveart = true;
  }

  btnDelete() {
    this.showLiveart = false;
  }

}
