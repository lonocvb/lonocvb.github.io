
export enum CameraSource {
  INIT,
  FRONT,
  BACK,
};

export interface Camera {

  connect(width: number, height: number, faceMode: CameraSource): Promise<undefined>;
  getMediaStream(): MediaStream;
  disconnect();

  isFront(): boolean;

}
