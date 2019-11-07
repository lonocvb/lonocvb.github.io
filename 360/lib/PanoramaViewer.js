
import PanoramaCameraControl from './PanoramaCameraControl.js';

const gRadius = 1000;

// ref: THREE.js
class PanoramaViewer {
  constructor({ canvas, width, height, imagePath, textLabels = [], onLabelClick = () => {} }) {

    canvas.style.overflow = 'hidden';

    this.initWebGL({ canvas, width, height, imagePath });

    console.log(textLabels);
    for (let label of textLabels) {
      console.log(label);
      this.createLabelSprite(label);
    }

    canvas.addEventListener('click', e => {
      const _mouse = {};
      _mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      _mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      const _raycaster = new THREE.Raycaster();
      _raycaster.setFromCamera(_mouse, this.cameraOrtho);

      var intersects = _raycaster.intersectObjects(this.clickableObjects);
      intersects.forEach(onLabelClick);

    }, false);

    this.render();
  }

  initWebGL({ canvas, width, height, imagePath }) {
    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.renderer.setSize(width, height);
    this.renderer.autoClear = false;

    this.sceneOrtho = new THREE.Scene();
    this.cameraOrtho = new THREE.OrthographicCamera(-width / 2, width / 2,height / 2, -height / 2, 1, 10);
    this.cameraOrtho.position.z = 10;
    this.labels = [];
    this.clickableObjects = [];

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, width / height, 1, gRadius);

    this.camera.target = new THREE.Vector3(0, 0, 0);

    // TODO, injection config to avoid hard-code.
    const checkbox = document.querySelector('#control')
    this.cameraControl = new PanoramaCameraControl(this.camera, checkbox);
    this.cameraControl.connect();

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
    this.cameraControl.update();

    this.updateSprites();

    this.renderer.render(this.scene, this.camera);
    this.renderer.render(this.sceneOrtho, this.cameraOrtho);
  }

  changeSize(width, height) {
    this.renderer.setSize(width, height);

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.cameraOrtho = new THREE.OrthographicCamera(-width / 2, width / 2,height / 2, -height / 2, 1, 10);
    this.cameraOrtho.position.z = 10;
  }

  createLabelSprite({ text, position, args = [] }) {
    const canvas1 = document.createElement('canvas');
    const context1 = canvas1.getContext('2d');

    context1.font = "20px Arial";
    const metrics = context1.measureText(text);
    const width = metrics.width;

    context1.fillStyle = "rgba(0,0,0,0.5)";
    context1.fillRect(0, 0, width + 8, 20 + 8);

    context1.fillStyle = "rgba(255,255,255,0.95)";
    context1.fillText(text, 4, 20);

    const texture1 = new THREE.Texture(canvas1);

    texture1.needsUpdate = true;

    const spriteMaterial = new THREE.SpriteMaterial({ map: texture1 });
    const sprite1 = new THREE.Sprite(spriteMaterial);

    sprite1.scale.set(1.0, 1.0, 1.0);
    sprite1.position.set(0, 0, 0);
    sprite1.name = text;
    sprite1.text = text;
    sprite1.args = args;

    const label = {
      text: text,
      pos: position,
      sprite: sprite1,
    };

    this.sceneOrtho.add(label.sprite);
    this.clickableObjects.push(label.sprite);

    this.labels.push(label);
    return label;
  }

  updateSprites() {
    for (let i = 0; i < this.labels.length; i++) {
      const wp = geoPosition2World(this.labels[i].pos.lon, this.labels[i].pos.lat);
      const sp = worldPostion2Screen(wp, this.camera);
      const test = wp.clone().project(this.camera);

      if (test.x > -1 && test.x < 1 && test.y > -1 && test.y < 1 && test.z > -1 && test.z < 1) {
        this.labels[i].sprite.scale.set(400, 150, 1.0);
        this.labels[i].sprite.position.set(sp.x + 200, sp.y - 75, 1);
      } else {
        this.labels[i].sprite.scale.set(1.0, 1.0, 1.0);
        this.labels[i].sprite.position.set(0, 0, 0);
      }
    }
  }

  changeTexture(imagePath) {
    this.sphereMaterial.map = THREE.ImageUtils.loadTexture(imagePath);
  }
}

function geoPosition2World(lon, lat) {
  const phi = THREE.Math.degToRad(90 - lat);
  const theta = THREE.Math.degToRad(lon);

  const result = {
    x: gRadius * Math.sin(phi) * Math.cos(theta),
    y: gRadius * Math.cos(phi),
    z: gRadius * Math.sin(phi) * Math.sin(theta)
  }
  return new THREE.Vector3(result.x, result.y, result.z);
}

function worldPostion2Screen(world_vector, camera) {
  const vector = world_vector.clone().project(camera);

  const result = {
    x: Math.round((vector.x + 1) * window.innerWidth / 2 - window.innerWidth / 2),
    y: Math.round(window.innerHeight / 2 - (-vector.y + 1) * window.innerHeight / 2),
    z: 0
  };
  return new THREE.Vector3(result.x, result.y, result.z);
}

export default PanoramaViewer;
