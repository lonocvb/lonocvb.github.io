'use strict';

// yufu: 3(t)6(s)0(z)view
// ref: THREE.js
class TszViewer {
  constructor({ canvas, width, height, imagePath }) {
    this.stopPressed = true;

    canvas.style.overflow = 'hidden';

    this.initWebGL({ canvas, width, height, imagePath });
  }

  initWebGL({ canvas, width, height, imagePath }) {
    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.renderer.setSize(width, height);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);
    this.camera.target = new THREE.Vector3(0, 0, 0);

    this.control = new THREE.DeviceOrientationControls(this.camera);
    this.control.connect();

    this.sphere = new THREE.SphereBufferGeometry(100, 100, 40);
    this.sphere.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));

    this.sphereMaterial = new THREE.MeshBasicMaterial();
    this.sphereMaterial.map = THREE.ImageUtils.loadTexture(imagePath);

    this.scene.add(new THREE.Mesh(this.sphere, this.sphereMaterial));

    this.render();
  }

  render(loopOver = false) {
    if (loopOver == false && !this.stopPressed) {
      return;
    }

    this.control.update();
    this.renderer.render(this.scene, this.camera);

    // loop over
    if (!this.stopPressed) {
      requestAnimationFrame(this.render.bind(this, true));
    }
  }

  startRequestAnimationFrame() {
    // prvent to start it twice
    if (this.stopPressed) {
      this.stopPressed = false;
      this.render(true);
    }
  }

  stopRequestAnimationFrame() {
    this.stopPressed = true;
  }

  changeSize(width, height) {
    this.renderer.setSize(width, height);

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  changeTexture(imagePath) {
    this.sphereMaterial.map = THREE.ImageUtils.loadTexture(imagePath);
  }
}

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
  const viewer = new TszViewer({
    canvas: document.querySelector('canvas'),
    imagePath: './04.jpg',
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // react for size change
  window.addEventListener('resize', () => {
    viewer.changeSize(window.innerWidth, window.innerHeight);
  }, true);

  viewer.startRequestAnimationFrame();

  initGengar({ viewer });
}

main();
