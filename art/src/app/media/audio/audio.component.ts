import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

import { MediaBase } from '../media.base';

@Component({
  selector: 'app-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.scss']
})
export class AudioComponent extends MediaBase implements OnInit {

  @ViewChild('ele', { static: true })
  video: ElementRef;

  constructor() {
    super();
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.initMediaBase(this.video.nativeElement);
  }

}
