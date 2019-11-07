'use strict';

import PanoramaViewer from './lib/PanoramaViewer.js';

function initGengar({ viewer }) {
  if (!window.gengar) {
    console.log('gengar is not supported.');
    return;
  }

  // hint to the frontend
  gengar.postMessage('enable event orientationchange');
  gengar.postMessage('enable event deviceorientation');
}

function main() {
  const viewer = new PanoramaViewer({
    canvas: document.querySelector('canvas'),
    imagePath: './04.jpg',
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // react for size change
  window.addEventListener('resize', () => {
    viewer.changeSize(window.innerWidth, window.innerHeight);
  }, true);

  viewer.startAnimate();

  initGengar({ viewer });
}

main();
