
import { Camera, CameraSource } from './camera.js';

export class CameraGengarImpl implements Camera {

  id: number;
  state: CameraSource;

  stream: MediaStream;

  constructor(private gengarRaw) {
    this.id = 1234; // TODO random gen
    this.state = CameraSource.INIT;
  }

  async connect(width: number, height: number, faceMode: CameraSource): Promise<undefined> {

    if (this.state == faceMode) {
      return;
    }

    let openFunc = (faceMode == CameraSource.FRONT) ? this.gengarRaw.camera.openFront : this.gengarRaw.camera.openBack;
    this.stream = await openFunc(width, height);

    this.state = faceMode;

  }

  disconnect() {
    this.state = CameraSource.INIT;
    this.gengarRaw.camera.close();
  }

  getMediaStream(): MediaStream {
    return this.stream;
  }

  isFront(): boolean {
    return this.state == CameraSource.FRONT;
  }

}
