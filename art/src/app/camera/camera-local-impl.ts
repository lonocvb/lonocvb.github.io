
import { Camera, CameraSource } from './camera.js';

export class CameraLocalImpl implements Camera {

  state: CameraSource;
  stream: MediaStream = null;

  constraints: any;

  constructor() {
    this.constraints = {
      audio: false,
      video: {
        width: { ideal: 240 },
        height: { ideal: 320 },
      },
    };

    this.state = CameraSource.INIT;
  }

  async connect(width, height, faceMode): Promise<undefined> {

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

  getMediaStream(): MediaStream {
    return this.stream;
  }

  supportFlip_: boolean = false;

  supportFlip(): boolean {
    const supports = navigator.mediaDevices.getSupportedConstraints();
    this.supportFlip_ = supports['facingMode'] === true;

    return this.supportFlip_;
  }

  isFront() {
    return this.state == CameraSource.FRONT;
  }

}
