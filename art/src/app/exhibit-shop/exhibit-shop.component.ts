import { Component, OnInit, ViewChildren } from '@angular/core';
import { FloatTopDirective } from '../float-top.directive';

interface GoodData{
  name: string;
  price: number;
  star: number;
  preview?: string;
};

@Component({
  selector: 'app-exhibit-shop',
  templateUrl: './exhibit-shop.component.html',
  styleUrls: ['./exhibit-shop.component.scss']
})
export class ExhibitShopComponent implements OnInit {
  goods: Array<GoodData>;

  @ViewChildren(FloatTopDirective)
  floatTopElements: Array<FloatTopDirective>;

  constructor() { }

  ngOnInit() {
    this.goods = [
      { name: 'Assyrian Place Guard Bookends', price: 138, star: 5, preview: 'good/good1.png' },
      { name: 'The world between empires: Art and Identity in the Ancient Middle East', price: 65, star: 5, preview: 'good/good2.png' },
      { name: 'Roman Portraits: Sculptures in Stone and Bronze', price: 65, star: 5, preview: 'good/good3.png' },
      { name: 'Michelangelo: Divine Draftsman and Designer', price: 65, star: 5, preview: 'good/good4.png' },
      { name: 'Louise C. Tiffany Favrile Journal', price: 18, star: 5, preview: 'good/good5.png' },
      { name: 'Heavenly Skies Oversize Scarf', price: 65, star: 5, preview: 'good/good6.png' },
      { name: 'Dummy', price: 999, star: 3 },
    ];
  }

  ngAfterViewInit() {
    this.artwrokImageLoaded();
  }

  buy(good: GoodData) {
    alert(`Buy: "${good.name}"`);
  }

  artwrokImageLoaded() {
    FloatTopDirective.float(this.floatTopElements);
  }

}
