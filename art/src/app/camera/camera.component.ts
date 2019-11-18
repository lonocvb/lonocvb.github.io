import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { CameraService } from './camera.service';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss']
})
export class CameraComponent implements OnInit {

  @ViewChild('div', { static: true })
  div: ElementRef;

  @ViewChild('canvas', { static: true })
  canvas: ElementRef;

  width: number;
  height: number;

  //cameraPromise: Promise<any>;

  constructor(
    private camera: CameraService,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const n = this.div.nativeElement;
    this.width = n.clientWidth;
    this.height = n.clientHeight;

    this.canvas.nativeElement.width = this.width;
    this.canvas.nativeElement.height = this.height;

    this.camera.connectFrontCamera(this.width, this.height).then(stream => {
      this.canvas.nativeElement.srcObject = stream;
    });
  }

  ngOnDestroy() {
    this.camera.disconnect();
  }

  async scanQR() {
    console.log('start scan');
    console.log(await this.camera.scanQR(this.canvas.nativeElement));
  }

}
