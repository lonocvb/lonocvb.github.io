import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GengarService {

  gengarRaw: any;
  isFullscreen: boolean = false;

  constructor(
    private router: Router
  ) {
    this.gengarRaw = (window as any).gengar;

    if (!this.isSupported()) {
      return;
    }

    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
    ).subscribe((e: NavigationEnd) => this.hookRoutingChange(e.url));
  }

  getRaw() {
    return this.gengarRaw;
  }

  isSupported() {
    return !!this.gengarRaw;
  }

  private hookRoutingChange(url) {
    const rgex = /^\/(exhibit|tour)\/.*/;
    const needFullscreen = rgex.test(url);

    if (this.isFullscreen != needFullscreen) {
      this.updateFullscreenHint(needFullscreen);
      this.isFullscreen = needFullscreen;
    }
  }

  private updateFullscreenHint(enable: boolean) {
    this.gengarRaw.emit('edgefullscreen', enable);
  }

}
