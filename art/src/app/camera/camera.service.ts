import { Injectable } from '@angular/core';
import { Location } from '@angular/common';

import { Camera, CameraSource } from './camera.js';
import QrScanner from './lib/qr-scanner.min.js';
import { CameraLocalImpl } from './camera-local-impl.js';
import { CameraGengarImpl } from './camera-gengar-impl.js';


@Injectable({
  providedIn: 'root'
})
export class CameraService implements Camera {

  impl: Camera;

  constructor(
    private location: Location,
  ) {
    const QrScannerWorkerPath = this.location.prepareExternalUrl('/assets/qr-scanner-worker.min.js');
    QrScanner.WORKER_PATH = QrScannerWorkerPath;


    this.impl = (!(window as any).gengar) ? new CameraLocalImpl() : new CameraGengarImpl();
  }

  async scanQR(ele) {
    try {
      return await QrScanner.scanImage(ele);
    } catch (error) {
      return '';
    };
  }

  async connectFrontCamera(width: number, height: number): Promise<MediaStream> {
    try {
      await this.connect(width, height, CameraSource.FRONT);
      return this.getMediaStream();
    } catch (error) {
      throw error;
    }
  }

  async connectBackCamera(width: number, height: number): Promise<MediaStream> {
    try {
      await this.connect(width, height, CameraSource.BACK);
      return this.getMediaStream();
    } catch (error) {
      throw error;
    }
  }

  connect(width: number, height: number, faceMode: CameraSource): Promise<undefined> {
    return this.impl.connect(width, height, faceMode);
  }

  disconnect() {
    this.impl.disconnect();
  }

  getMediaStream(): MediaStream {
    return this.impl.getMediaStream();
  }

  isFront(): boolean {
    return this.impl.isFront();
  }
}
