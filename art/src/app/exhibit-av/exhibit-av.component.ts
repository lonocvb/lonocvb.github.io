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
      { title: 'Terracotta statuette of a draped woman, Part 1' },
      { title: 'Terracotta statuette of a draped woman, Part 2' },
    ];
    this.videos = [
      { title: 'vidoe 1', preview: 'exhibit1/header.png' },
      { title: 'video 2', preview: 'exhibit1/header.png' },
    ];
  }

  play(audio: AVData) {
    alert(`Play: "${audio.title}"`);
  }

}
