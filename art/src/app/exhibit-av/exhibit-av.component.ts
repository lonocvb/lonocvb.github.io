import { Component, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { AudioComponent } from '../media/audio/audio.component';
import { VideoComponent } from '../media/video/video.component';
import { MediaBase } from '../media/media.base';

interface AVData {
  title: string;
  src?: string;
  preview?: string;
};

@Component({
  selector: 'app-exhibit-av',
  templateUrl: './exhibit-av.component.html',
  styleUrls: ['./exhibit-av.component.scss']
})
export class ExhibitAvComponent implements OnInit {
  audios: Array<AVData>;
  videos: Array<AVData>;

  lastMedia: MediaBase = MediaBase.null();

  constructor() { }

  ngOnInit() {
    this.audios = [
      { title: 'The introduction', src: 'assets/av/Medea.mp3' },
      { title: 'The history', src: 'assets/av/Sappho.mp3' },
    ];
    this.videos = [
      { title: 'vidoe01', src: 'assets/av/SampleVideo.mp4', preview: 'exhibit/video.png' },
    ];
  }

  play(media: MediaBase) {
    if (this.lastMedia != media) {
      this.lastMedia.pause();
      this.lastMedia = media;
    }
    media.toggle();
  }

}
