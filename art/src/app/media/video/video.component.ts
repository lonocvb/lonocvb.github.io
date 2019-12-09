import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

import { MediaBase } from '../media.base';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent extends MediaBase implements OnInit {

  played: boolean = false;

  @Input()
  preview: string;

  @ViewChild('video', { static: true })
  audio: ElementRef;

  constructor() {
    super();
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.initMediaBase(this.audio.nativeElement);
  }

  onAfterPlay() {
    this.played = true;
  }

}
