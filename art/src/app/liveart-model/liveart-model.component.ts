import { Component, OnInit, ViewChildren, ElementRef, ViewChild, Input } from '@angular/core';

import * as THREE from '../3rd-party/build/three.module.js';

import { OrbitControls } from '../3rd-party/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from '../3rd-party/examples/jsm/loaders/GLTFLoader.js';
import { Location } from '@angular/common';

@Component({
  selector: 'app-liveart-model',
  templateUrl: './liveart-model.component.html',
  styleUrls: ['./liveart-model.component.scss']
})
export class LiveartModelComponent implements OnInit {

  @Input()
  glTFPath: string = 'assets/3d/glTF/DamagedHelmet/DamagedHelmet.gltf';

  @Input()
  width: number;

  @Input()
  height: number;

  @ViewChild('container', {static: true})
  container: ElementRef;
  showLoading: boolean = false;

  constructor(
    private location: Location,
  ) { }

  ngOnInit() {
    this.showLoading = true;
    this.init({
      container: this.container.nativeElement,
    });
    this.animate();
  }

  ngOnDestroy() {
    this.stopAnimate();
  }

  controls;
  camera;
  scene;
  renderer;

  init({ container }) {

    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.25, 200);
    this.camera.position.set(-1.8, 0.9, 2.7);

    this.scene = new THREE.Scene();

    var loader = new GLTFLoader();
    loader.load(this.location.prepareExternalUrl(this.glTFPath), gltf => {
      this.normalizeScene(gltf.scene);
      this.scene.add(gltf.scene);

      this.showLoading = false;
    });

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize(this.width, this.height);
    this.renderer.gammaOutput = true;
    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, - 0.2, - 0.5);
    this.controls.update();

  }

  normalizeScene(scene) {
    // https://stackoverflow.com/questions/52271397/centering-and-resizing-gltf-models-automatically-in-three-js
    const bbox = new THREE.Box3().setFromObject(scene);
    const center = bbox.getCenter(new THREE.Vector3());
    const size = bbox.getSize(new THREE.Vector3());

    //Rescale the object to normalized space
    const maxAxis = Math.max(size.x, size.y, size.z);
    scene.scale.multiplyScalar(1.0 / maxAxis);
    bbox.setFromObject(scene);
    bbox.getCenter(center);
    bbox.getSize(size);

    //Reposition to 0,halfY,0
    scene.position.copy(center).multiplyScalar(-1);
    scene.position.y-= (size.y * 0.5);

    return scene;
  }

  next = true;
  animate() {
    if (this.next) {
      requestAnimationFrame(() => this.animate());
      this.renderer.render(this.scene, this.camera);
    }
  }

  stopAnimate() {
    this.next = false;
  }

}