import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

interface ArtworkData {
  img: string;
  name: string;
};

export interface TourData {
  name: string,
  tourTitle: string;
  numberOfItems: number;
  duration: string;
  description: string;

  artworks: Array<ArtworkData>;
};

function build(obj): TourData {
  obj.name = obj.tourTitle.toLowerCase().replace(/\s/g, "_");
  return obj;
}

import tour01 from '../assets/tour/Museum Highlights/MuseumHighlights.json';
import tour02 from '../assets/tour/Paintings of the Americas/PaintingsOfTheAmericas.json';
import tour03 from '../assets/tour/Sculpture of the Americas/SculptureOfTheAmericas.json';

@Injectable({
  providedIn: 'root'
})
export class TourNavService {
  tourChange: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
  tourIdx$: Observable<number>;
  tourIdx: number;

  itemVisited: number = 28;
  itemTotal: number = 41;

  tours: Array<TourData>;

  constructor() {

    this.tours = [
      tour01, tour02, tour03
    ].map(t => build(t));

    this.tourIdx$ = this.tourChange;
    this.tourIdx$.subscribe(val => this.tourIdx = val);
  }

  getList(): Array<TourData> {
    return this.tours;
  }

  getByName(name: string): TourData {
    return this.tours.filter(t => name == t.name)[0];
  }

  startTourName(name: string) {
    let id = 0;
    for (let idx = 0; idx < this.tours.length; ++idx) {
      if (this.tours[idx].name == name) {
        id = idx;
        break;
      };
    }
    this.tourChange.next(id);
  }
  startTour(idx: number) {
    this.tourChange.next(idx);
  }

  stopTour() {
    this.tourChange.next(-1);
  }

  cameraControl: any;
}
