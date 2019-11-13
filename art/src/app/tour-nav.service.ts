import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

interface ArtworkData {
  preview: string;
  title: string;
};

export interface TourData {
  name: string;
  title: string;
  item: number;
  time: number;
  describe: string;

  artworks: Array<ArtworkData>;
};

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
      {
        name: 'tour1',
        title: 'MUSEUM HIGHLIGHTS',
        item: 41,
        time: 1,
        describe: 'Discover The Met collection on this tour, which focuses on a selection of works of art representing different cultures and time periods and encourages vistors to explore the Museum on their own.',
        artworks: [
          { preview: 'artwork/art1.png', title: 'Kanagawa Oki Nami Ura' },
          { preview: 'artwork/art2.png', title: 'Rapier of Prince-Elector Christian II of Saxony' },
          { preview: 'artwork/art3.png', title: 'Jain Svetambara Tirthankara in Meditation' },
          { preview: 'artwork/art4.png', title: 'Beaker with Apes' },
        ]
      },
      { name: 'tour2', title: 'DUMMY2', item: 999, time: 99,
        describe: 'Lorem ipsum dolor sit amet, eos suscipit philosophia in, te tractatos intellegat eam. Mandamus mediocrem reprehendunt eum eu, cu pertinax ocurreret his. Usu an legimus petentium, et vis sumo vivendo convenire, id eos dicit primis utamur. Sit enim eripuit ad, adhuc mundi sea ne, legere assentior ius ex. Usu ei denique lobortis.ｚ',
        artworks: [
          { preview: 'artwork/art1.png', title: 'Kanagawa Oki Nami Ura' },
          { preview: 'artwork/art2.png', title: 'Rapier of Prince-Elector Christian II of Saxony' },
          { preview: 'artwork/art3.png', title: 'Jain Svetambara Tirthankara in Meditation' },
          { preview: 'artwork/art4.png', title: 'Beaker with Apes' },
        ]
      },
      { name: 'tour3', title: 'DUMMY3', item: 100, time: 2,
        describe: 'Discover The Met collection on this tour, which focuses on a selection of works of art representing different cultures and time periods and encourages vistors to explore the Museum on their own.',
        artworks: [
          { preview: 'artwork/art1.png', title: 'Kanagawa Oki Nami Ura' },
          { preview: 'artwork/art2.png', title: 'Rapier of Prince-Elector Christian II of Saxony' },
          { preview: 'artwork/art3.png', title: 'Jain Svetambara Tirthankara in Meditation' },
          { preview: 'artwork/art4.png', title: 'Beaker with Apes' },
        ]
      },
    ];

    this.tourIdx$ = this.tourChange;
    this.tourIdx$.subscribe(val => this.tourIdx = val);
  }

  getList(): Array<TourData> {
    return this.tours;
  }

  startTour(idx) {
    this.tourChange.next(idx);
  }

  stopTour() {
    this.tourChange.next(-1);
  }
}
