import { Component, OnInit, ViewChild, ElementRef, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { CameraComponent } from '../camera/camera.component';

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

  @ViewChild(CameraComponent, { static: true })
  appCamera: CameraComponent;

  @ViewChild('qrFocus', { static: false })
  qrFocus: ElementRef;
  showQrFocus: boolean = true;

  worker = null;

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
    this.livearts = [
      { preview: 'collect/collect0.png', name: 'Inlay Depicting', found: true },
      { preview: 'thumbnail.png', name: 'Inlay Depicting', found: false },
      { preview: 'collect/collect2.png', name: 'Cynocephalus Ape', found: true },
      { preview: 'thumbnail.png', name: 'Inlay Depicting', found: false },
      { preview: 'collect/collect4.png', name: 'Terracotta statuette of a draped woman', found: true },
      { preview: 'thumbnail.png', name: 'Inlay Depicting', found: false },
    ];
  }

  ngAfterViewInit() {
    this.startQrScanTimer();
  }

  ngOnDestroy() {
    this.stopQrScanTimer();
  }

  startQrScanTimer() {
    this.stopQrScanTimer();

    const task = async () => {
      if (this.showDialog || this.showCollect || this.showLiveart) {
        this.showQrFocus = false;
        return;
      }

      this.showQrFocus = true;
      const res = await this.appCamera.scanQR();

      if (res.found) {
        console.log('qrcode:', res.result);
        this.showDialog = true;
      }
    };

    this.worker = setInterval(task, 750);
  }

  stopQrScanTimer() {
    clearInterval(this.worker);
  }

  btnQR() {
    this.router.navigate(['/']);
  }

  btnLiveart() {
    this.showCollect = !this.showCollect;
  }

  btnGoAlive() {
    this.showDialog = false;
    this.showCollect = true;
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
