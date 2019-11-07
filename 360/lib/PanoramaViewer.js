
import PanoramaEvent from './PanoramaEvent.js';

// ref: THREE.js
class PanoramaViewer {
  constructor({ canvas, width, height, imagePath }) {

    canvas.style.overflow = 'hidden';

    this.initWebGL({ canvas, width, height, imagePath });
  }

  initWebGL({ canvas, width, height, imagePath }) {
    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.renderer.setSize(width, height);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);
    this.cameraOrtho = new THREE.OrthographicCamera(-width / 2, width / 2,height / 2, -height / 2, 1, 10);
    this.cameraOrtho.position.z = 10;

    this.camera.target = new THREE.Vector3(0, 0, 0);

    // TODO, injection config to avoid hardcode
    this.event = new PanoramaEvent(this.camera, document.querySelector('#control'));
    this.event.connect();

    this.sphere = new THREE.SphereBufferGeometry(100, 100, 40);
    this.sphere.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));

    this.sphereMaterial = new THREE.MeshBasicMaterial();
    this.sphereMaterial.map = THREE.ImageUtils.loadTexture(imagePath);

    this.scene.add(new THREE.Mesh(this.sphere, this.sphereMaterial));
  }

  startAnimate() {
    requestAnimationFrame(() => this.startAnimate());
    this.render();
  }

  render() {
    this.event.update();
    this.renderer.render(this.scene, this.camera);
    //this.renderer.render(_sceneOrtho,  this.cameraOrtho);
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

export default PanoramaViewer;
