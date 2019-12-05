import { ElementRef } from "@angular/core";

export class MediaBase {

  playing: boolean = false;

  private ele: HTMLMediaElement;

  private ts: number;

  private debounce(): boolean {
    const now = new Date().getTime();
    if (now - this.ts > 100) {
      this.ts = now;
      return false;
    }
    return true;
  }

  initMediaBase(ele: HTMLMediaElement) {
    this.ele = ele;
    this.ts = new Date().getTime();
  }

  toggle() {
    if (this.debounce()) {
      return;
    }

    if (this.playing) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    if (!this.playing) {
      this.ele.play();
      this.playing = true;
    }

    this.onAfterPlay();
  }

  onAfterPlay() {}

  pause() {
    if (this.playing) {
      this.ele.pause();
      this.playing = false;
    }
  }

  static null() {
    const media = new MediaBase();
    media.initMediaBase({
      play() {},
      pause() {},
    } as HTMLMediaElement);

    return media;
  }

}
