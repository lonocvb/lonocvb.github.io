import { Component, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

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

  constructor() { }

  ngOnInit() {
    this.audios = [
      { title: 'The introduction' },
      { title: 'The history' },
    ];
    this.videos = [
      { title: 'vidoe01', preview: 'exhibit/video.png' },
    ];
  }

  play(audio: AVData) {
    alert(`Play: "${audio.title}"`);
  }

}
