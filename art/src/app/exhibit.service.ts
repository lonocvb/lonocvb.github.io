import { Injectable } from '@angular/core';

export interface ExhibitData {
  name: string;
  title: string;
  subtitle: string;
  timeStr: string;
  describe: string;
  describe2?: any;
};

@Injectable({
  providedIn: 'root'
})
export class ExhibitService {

  exhibits: Array<ExhibitData>;

  constructor() {

    this.exhibits = [
      {
        name: 'medea',
        title: 'Medea',
        subtitle: 'William Wetmore Story',
        timeStr: 'about 1868-80',
        describe: 'In Greek mythology, Medea punished her unfaithful husband by murdering their two children. Rather than portraying the horrific deed, the sculptor selected an earlier moment of high psychological drama. Wounded by infidelity, blinded by jealousy and anger, Medea contemplates the pending crime. She holds a dagger in one hand, idly fondling the beads of her necklace. Story\'s conceptualization likely was inspired by the moving performance by Italian actress Adelaide Ristori, which Story witnessed in the mid-1850s. "Her \'Medea\' is as affecting as it is terrible," he recalled.',
      },
      {
        name: 'sappho',
        title: 'Sappho',
        subtitle: 'William Wetmore Story',
        timeStr: '1863',
        describe: 'The subject of this sculpture, Sappho of Lesbos, the sixth-century-B.C. Greek poet, was a virtual Rohrschach test for nineteenth-century intellectuals, who often interpreted what little is actually known of her life and work to reflect their own predilections. For example, one journal stated in 1859 that Sappho was of "warm poetic temperament, of great lyric power, of voluptuous, passionate yearnings, and of many moral shortcomings." William Wetmore Story saw her differently and chose to portray her in a calm, ideal pose. Seated in a klismos chair, she contemplates throwing herself off a cliff into the sea after her rejection by the Greek ferryman Phaon. A wilting rose, a symbol of failed love, droops across her unstrung lyre, contributing to the mood of listless reverie.',
      },
      {
        name: 'sleepingfaun',
        title: 'Sleeping Faun',
        subtitle: 'Goodhue HosmerHarriet',
        timeStr: 'After 1865',
        describe: 'Exhibited before millions of visitors at international exhibitions, Harriet Hosmer\'s depiction of an inebriated faun sprawled against a tree stump was one of her most highly acclaimed works. Contemporary critics agreed that Hosmer had captured the graceful curves and sensual finishes of Greek Hellenistic sculpture in the adolescent faun\'s perfect proportions, smooth skin, and languorous pose, while at the same time evoking a mood of playfulness and whimsy. The bunch of grapes and the panpipe littered on the ground refer to the faun\'s merry carousing, and his pointed ears and tiger-skin drapery indicate his animalistic nature. In counterpoint to his peaceful sleep, a mischievous satyr ties the faun to the tree stump with the ends of the tiger skin. Hosmer employed tremendous carving skill to create the varied textures of the faun\'s sensual body, the rough tiger skin, the mossy forest floor, the firm grapes, and the satyr\'s thick, curly hair.',
      },
      {
        name: 'bustofevedisconsolate',
        title: 'Bust of Eve Disconsolate',
        subtitle: 'Hiram Powers',
        timeStr: 'about 1871–72',
        describe: '',
        describe2: {
          'Object Place': 'Florence, Italy',
          'MEDIUM/TECHNIQUE': 'Marble',
          'DIMENSIONS': '71.12 x 52.07 x 33.02 cm',
          'CREDIT LINE': 'Gift of Mrs. Thomas O. Richardson',
          'ON VIEW': 'Penny and Jeff Vinik Gallery (Gallery 233)',
          'COLLECTIONS': 'Americas',
          'CLASSIFICATIONS': 'Sculpture',
        },
      },
      {
        name: 'faith',
        title: 'Faith',
        subtitle: 'Hiram Powers',
        timeStr: 'about 1872',
        describe: '',
        describe2: {
          'Object Place': 'Florence, Italy',
          'MEDIUM/TECHNIQUE': 'Marble',
          'DIMENSIONS': '68.6 x 52.1 x 33 cm',
          'CREDIT LINE': 'Gift of Mrs. Henry Lyman',
          'ON VIEW': 'Penny and Jeff Vinik Gallery (Gallery 233)',
          'COLLECTIONS': 'Americas',
          'CLASSIFICATIONS': 'Sculpture',
        },
      },
    ];

  }

  getByName(name: string): ExhibitData {
    return this.exhibits.filter(t => name == t.name)[0];
  }

}
