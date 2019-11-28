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
  showQrFocus: boolean = false;

  width;
  height;

  worker = null;

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
    this.livearts = [
      { preview: 'collect/collect0.png', name: 'Seated Lion', found: true },
      { preview: 'thumbnail.png', name: 'Inlay Depicting', found: false },
      { preview: 'collect/collect2.png', name: 'Wounded Amazon', found: true },
      { preview: 'thumbnail.png', name: 'Inlay Depicting', found: false },
      { preview: 'collect/collect4.png', name: 'Colossal bust of Ramesses', found: true },
      { preview: 'thumbnail.png', name: 'Inlay Depicting', found: false },
    ];
  }

  ngAfterViewInit() {
    this.width = document.body.offsetWidth;
    this.height = document.body.offsetHeight;

    this.startQrScanTimer();
  }

  ngOnDestroy() {
    this.stopQrScanTimer();
  }

  detectedIdx: number = 0;
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
        console.log(`qrcode: !${res.result}!`);

        const mapping = {
          'edge-model-001': 0,
          'edge-model-002': 2,
          'edge-model-003': 4,
        };

        if (mapping.hasOwnProperty(res.result)) {
          this.detectedIdx = mapping[res.result];
          this.showDialog = true;
        } else {
          console.log('qr code detected but not in db.');
        }
      }
    };

    if (this.appCamera) {
      this.worker = setInterval(task, 750);
    }
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
    this.btnCollect(this.detectedIdx);
  }

  btnCloseAll() {
    this.showDialog = false;
    this.showCollect = false;
  }

  glTFPath: string = '';

  btnCollect(idx: number) {
    if (!this.livearts[idx].found) {
      return;
    }

    const pathList: Array<string> = [
      'assets/3d/glTF/seated_lion_gltf/scene.gltf',
      '',
      'assets/3d/glTF/wounded_amazon_gltf/scene.gltf',
      '',
      'assets/3d/glTF/colossal_bust_of_ramesses_ii_v2.0_gltf/scene.gltf',
      '',
    ];

    this.glTFPath = pathList[idx];

    this.btnCloseAll();
    this.showLiveart = true;
  }

  btnDelete() {
    this.showLiveart = false;
  }

}
