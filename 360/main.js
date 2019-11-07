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

    textLabels: [
      { text: '0,0', position: { lon: 0, lat: 0 }, args: { yo: 'yo' } },
      { text: '45,0', position: { lon: 45, lat: 0 }, args: { yo: 'yo' } },
      { text: '90,0', position: { lon: 90, lat: 0 }, args: { yo: 'yo' } },
      { text: '135,0', position: { lon: 135, lat: 0 }, args: { yo: 'yo' } },
      { text: '180,0', position: { lon: 180, lat: 0 }, args: { yo: 'yo' } },
      { text: '225,0', position: { lon: 225, lat: 0 }, args: { yo: 'yo' } },
      { text: '270,0', position: { lon: 270, lat: 0 }, args: { yo: 'yo' } },
      { text: '315,0', position: { lon: 315, lat: 0 }, args: { yo: 'yo' } },

      { text: '0,45', position: { lon: 0, lat: 45 }, args: { yo: 'yo' } },
      { text: '90,45', position: { lon: 90, lat: 45 }, args: { yo: 'yo' } },
      { text: '180,45', position: { lon: 180, lat: 45 }, args: { yo: 'yo' } },
      { text: '270,45', position: { lon: 270, lat: 45 }, args: { yo: 'yo' } },

      { text: '0,-45', position: { lon: 0, lat: -45 }, args: { yo: 'yo' } },
      { text: '90,-45', position: { lon: 90, lat: -45 }, args: { yo: 'yo' } },
      { text: '180,-45', position: { lon: 180, lat: -45 }, args: { yo: 'yo' } },
      { text: '270,-45', position: { lon: 270, lat: -45 }, args: { yo: 'yo' } },

      { text: 'top', position: { lon: 0, lat: 90 }, args: { yo: 'yo' } },
      { text: 'bottom', position: { lon: 0, lat: -90 }, args: { yo: 'yo' } },
    ],
    onLabelClick: label => console.log(label.text),

  });

  // react for size change
  window.addEventListener('resize', () => {
    viewer.changeSize(window.innerWidth, window.innerHeight);
  }, true);

  viewer.startAnimate();

  initGengar({ viewer });
}

main();
