
import { Camera, CameraSource } from './camera.js';

const gengar = (window as any).gengar;

export class CameraGengarImpl implements Camera {

  id: number;
  state: CameraSource;

  stream: MediaStream;

  constructor() {
    this.id = 1234; // TODO random gen
    this.state = CameraSource.INIT;
  }

  async connect(width: number, height: number, faceMode: CameraSource): Promise<undefined> {

    if (this.state == faceMode) {
      return;
    }

    let openFunc = (faceMode == CameraSource.FRONT) ? gengar.camera.openFront : gengar.camera.openBack;
    this.stream = await openFunc(width, height);

    this.state = faceMode;

  }

  disconnect() {
    this.state = CameraSource.INIT;
    gengar.camera.close();
  }

  getMediaStream(): MediaStream {
    return this.stream;
  }

  isFront(): boolean {
    return this.state == CameraSource.FRONT;
  }

}
