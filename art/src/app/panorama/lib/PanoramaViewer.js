
import * as THREE from '../../3rd-party/build/three.module.js';

const gRadius = 1000;

// ref: THREE.js
class PanoramaViewer {
  constructor({ canvas, width, height, imagePath, cameraControl, textLabels = [], elementLabels = [], onLabelClick = () => {} }) {

    this.enable = false;
    this.canvas = canvas;

    this.initWebGL({ canvas, width, height, imagePath, cameraControl });

    for (let label of textLabels) {
      this.createLabelSprite(label);
    }

    canvas.addEventListener('click', e => {
      const _mouse = {};
      _mouse.x = (event.clientX / canvas.width) * 2 - 1;
      _mouse.y = -(event.clientY / canvas.height) * 2 + 1;

      const _raycaster = new THREE.Raycaster();
      _raycaster.setFromCamera(_mouse, this.cameraOrtho);

      var intersects = _raycaster.intersectObjects(this.sceneOrtho.children);
      intersects.forEach(o => onLabelClick(o.object.label));
    }, false);

    this.elementLabels = elementLabels;

  }

  initWebGL({ canvas, width, height, imagePath, cameraControl }) {
    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio( window.devicePixelRatio / 0.75 );
    this.renderer.autoClear = false;

    this.sceneOrtho = new THREE.Scene();
    this.cameraOrtho = new THREE.OrthographicCamera(-width / 2, width / 2,height / 2, -height / 2, 1, gRadius);
    this.cameraOrtho.position.z = 400;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, width / height, 1, gRadius);

    this.camera.target = new THREE.Vector3(0, 0, 0);

    this.cameraControl = cameraControl;
    this.cameraControl.connect(this.camera);

    this.sphere = new THREE.SphereBufferGeometry(100, 100, 40);
    this.sphere.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));

    this.sphereMaterial = new THREE.MeshBasicMaterial();
    this.sphereMaterial.map = new THREE.TextureLoader().load(imagePath);

    this.scene.add(new THREE.Mesh(this.sphere, this.sphereMaterial));
  }

  startAnimate() {
    if (this.enable) {
      return;
    }
    this.enable = true;
    this._startAnimate();
  }
  _startAnimate() {
    if (this.enable) {
      requestAnimationFrame(() => this._startAnimate());
    }
    this.render();
  }

  stopAnimate() {
    this.enable = false;
  }

  render() {
    this.cameraControl.update();

    this.updateSprites();
    this.updateElements();

    this.renderer.render(this.scene, this.camera);
    this.renderer.render(this.sceneOrtho, this.cameraOrtho);
  }

  changeSize(width, height) {
    this.renderer.setSize(width, height);

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.cameraOrtho.aspect = width / height;
    this.cameraOrtho.updateProjectionMatrix();
  }

  createLabelSprite({ text, position: pos, args = [] }) {
    const canvas1 = document.createElement('canvas');
    const context1 = canvas1.getContext('2d');

    const height = 20;
    const padding = 4;

    context1.font = `${height}px Arial`;
    const metrics = context1.measureText(text);
    const width = metrics.width;

    // resize canvas to fix content;
    canvas1.width = width + padding + padding;
    canvas1.height = height + padding + padding;

    // context1 is reset, so we need to set the 'font' again.
    context1.font = `${height}px Arial`;
    context1.fillStyle = "rgba(0,0,0,0.5)";
    context1.fillRect(0, 0, canvas1.width, canvas1.height);
    context1.fillStyle = "rgba(255,255,255,0.95)";
    context1.fillText(text, padding, height);

    const texture1 = new THREE.CanvasTexture(canvas1);

    const spriteMaterial = new THREE.SpriteMaterial({ map: texture1 });
    const sprite1 = new THREE.Sprite(spriteMaterial);

    sprite1.scale.set(1.0, 1.0, 1.0);
    sprite1.position.set(0, 0, 0);
    sprite1.name = text;

    sprite1.label = {
      text,
      pos,
      args,
      width: canvas1.width,
      height: canvas1.height,
    };

    this.sceneOrtho.add(sprite1);
  }

  updateSprites() {
    const { offsetWidth: cwidth, offsetHeight: cheight } = this.canvas;

    for (let sprite of this.sceneOrtho.children) {
      const label = sprite.label;
      const wp = geoPosition2World(label.pos.lon, label.pos.lat);
      const sp = worldPostion2Screen(wp, this.camera, cwidth, cheight);
      const test = wp.clone().project(this.camera);

      if (test.x >= -2 && test.x <= 2 && test.y >= -2 && test.y <= 2 && test.z >= -1 && test.z <= 1) {
        const width = label.width;
        const height = label.height;
        const x = sp.x + width / 2;
        const y = sp.y - height / 2;

        sprite.scale.set(width, height, 10);
        sprite.position.set(x, y, 1);
      } else {
        sprite.scale.set(1.0, 1.0, 1.0);
        sprite.position.set(0, 0, 0);
      }
    }
  }

  updateElements() {
    const { offsetWidth: cwidth, offsetHeight: cheight } = this.canvas;

    for (let elementLabel of this.elementLabels) {
      const wp = geoPosition2World(elementLabel.position.lon, elementLabel.position.lat);
      const sp = worldPostion2Screen(wp, this.camera, cwidth, cheight);
      const test = wp.clone().project(this.camera);

      if (test.x >= -2 && test.x <= 2 && test.y >= -2 && test.y <= 2 && test.z >= -1 && test.z <= 1) {
        const x = sp.x + cwidth / 2;
        const y = -sp.y + cheight / 2;

        elementLabel.element.style.display = 'inline-block';
        elementLabel.element.style.left = `${x}px`;
        elementLabel.element.style.top = `${y}px`;
      } else {
        elementLabel.element.style.display = 'none';
      }
    }
  }

  changeTexture(imagePath) {
    this.sphereMaterial.map = new THREE.TextureLoader().load(imagePath);
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

function worldPostion2Screen(world_vector, camera, width, height) {
  const vector = world_vector.clone().project(camera);

  const result = {
    x: Math.round((vector.x + 1) * width / 2 - width / 2),
    y: Math.round(height / 2 - (-vector.y + 1) * height / 2),
    z: 0
  };
  return new THREE.Vector3(result.x, result.y, result.z);
}

export default PanoramaViewer;
