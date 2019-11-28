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
  set glTFPath(value: string) {
    this.updateScene(value);
  }

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

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize(this.width, this.height);
    this.renderer.gammaOutput = true;
    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, - 0.2, - 0.5);
    this.controls.update();
  }

  updateScene(glTFPath: string) {
    this.scene = new THREE.Scene();

    const light1 = new THREE.AmbientLight(0xffffff, 0.3);
    light1.name = 'ambient_light';
    this.scene.add( light1 );

    const light2 = new THREE.DirectionalLight(0xffffff, 2.5);
    light2.position.set(0.5, 0, 0.866); // ~60º
    light2.name = 'main_light';
    this.scene.add( light2 );

    const loader = new GLTFLoader();

    this.showLoading = true;

    loader.load(this.location.prepareExternalUrl(glTFPath), gltf => {
      this.normalizeScene(gltf.scene);
      this.scene.add(gltf.scene);

      this.showLoading = false;
    });
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