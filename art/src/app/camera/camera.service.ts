import { Injectable } from '@angular/core';

import QrScanner from './lib/qr-scanner.min.js';
import { Location } from '@angular/common';

enum CameraSource {
  INIT,
  FRONT,
  BACK,
};

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  stream: any = null;
  constraints: any;

  state: CameraSource;
  supportFlip: boolean = false;

  constructor(
    private location: Location,
  ) {
    const QrScannerWorkerPath = this.location.prepareExternalUrl('/assets/qr-scanner-worker.min.js');
    QrScanner.WORKER_PATH = QrScannerWorkerPath;

    this.constraints = {
      audio: false,
      video: {
        width: { ideal: 240 },
        height: { ideal: 320 },
      },
    };
    this.state = CameraSource.INIT;

    const supports = navigator.mediaDevices.getSupportedConstraints();
    this.supportFlip = supports['facingMode'] === true;
  }

  async connect(width, height, faceMode) {

    if (faceMode == this.state) {
      return;
    }

    try {
      if (this.stream) {
        const track = this.stream.getTracks()[0];
        track.stop();
        this.stream = null;
      }

      this.state = faceMode;

      this.constraints.video.facingMode = faceMode == CameraSource.FRONT ? "user" : { exact: "environment" };
      this.constraints.video.width.ideal = width;
      this.constraints.video.height.ideal = height;

      this.stream = await navigator.mediaDevices.getUserMedia(this.constraints);
    } catch (error) {
      console.log('connect error', error);
      throw error;
    }
  }

  disconnect() {
    try {
      this.state = CameraSource.INIT;
      this.stream.getTracks().forEach(track => {
        track.stop();
      });
    } catch (error) {
      // ignore error;
    }
  }

  getMediaStream() {
    return this.stream;
  }

  async scanQR(ele) {
    try {
      return await QrScanner.scanImage(ele);
    } catch (error) {
      return '';
    };
  }

  async connectFrontCamera(width, height) {
    try {
      await this.connect(width, height, CameraSource.FRONT);
      return this.getMediaStream();
    } catch (error) {
      throw error;
    }
  }

  async connectBackCamera(width, height) {
    try {
      await this.connect(width, height, CameraSource.BACK);
      return this.getMediaStream();
    } catch (error) {
      throw error;
    }
  }

  async flipCamera(width, height) {
    if (this.state == CameraSource.BACK) {
      await this.connectFrontCamera(width, height);
    } else {
      await this.connectBackCamera(width, height);
    }
    return this.getMediaStream();
  }

  isFront() {
    return this.state == CameraSource.FRONT;
  }

}
