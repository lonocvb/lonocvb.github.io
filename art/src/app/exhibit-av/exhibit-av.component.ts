import { Component, OnInit } from '@angular/core';
import { MediaBase } from '../media/media.base';

interface Media {
  src: string;
  type: string;
};

interface AVData {
  title: string;
  media: Media | Array<Media>;
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
      { title: 'The introduction', media: { src: 'assets/av/Medea.mp3', type: 'audio/mpeg' } },
      { title: 'The history', media: { src: 'assets/av/Sappho.mp3', type: 'audio/mpeg' } },
    ];
    this.videos = [
      {
        title: 'vidoe01',
        media: [
          { src: 'assets/av/SampleVideo.mkv', type: 'video/webm' },
          { src: 'assets/av/SampleVideo.mp4', type: 'video/mp4' },
        ],
        preview: 'exhibit/video.png'
      },
    ];
  }

  play(media: MediaBase) {
    if (this.lastMedia != media) {
      this.lastMedia.pause();
      this.lastMedia = media;
    }
    media.toggle();
  }

  getMedias(av: AVData): Array<Media> {
    if (Array.isArray(av.media)) {
      return av.media as Array<Media>;
    } else {
      return [ av.media as Media ];
    }
  }

}
