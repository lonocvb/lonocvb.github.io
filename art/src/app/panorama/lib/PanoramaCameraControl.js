
import * as THREE from '../../3rd-party/build/three.module.js';

/**
 * @author yufu.kao@kaiostech.com
 *
 * ref & modified from :
 *
 * THREE.js Examples (https://threejs.org/examples/jsm/controls/DeviceOrientationControls.js)
 * W3C Device Orientation control (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
 */

class PanoramaCameraControl {

  constructor(sensor) {
    this.sensor = sensor;
    this.screenOrientation = 0;
  }

  onScreenOrientationChangeEvent(e) {
    //const orientation = e && e.orientation ? e.orientation : window.orientation;
    //this.screenOrientation = orientation || 0;
    //console.log('screenOrientation', this.screenOrientation);
  };

  setObjectQuaternion(quaternion, alpha, beta, gamma, orient) {
    const zee = new THREE.Vector3( 0, 0, 1 );
    const euler = new THREE.Euler();
    const q0 = new THREE.Quaternion();
    const q1 = new THREE.Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) ); // - PI/2 around the x-axis

    euler.set( beta, alpha, - gamma, 'YXZ' ); // 'ZXY' for the device, but 'YXZ' for us
    quaternion.setFromEuler( euler ); // orient the device
    quaternion.multiply( q1 ); // camera looks out the back of the device, not the top
    quaternion.multiply( q0.setFromAxisAngle( zee, - orient ) ); // adjust for screen orientation
  }

  connect(object) {
    this.object = object;
    this.object.rotation.reorder( 'YXZ' );
    this.onScreenOrientationChangeEvent(); // run once on load
  }

  setSensorType(type) {
    this.sensor.setType(type);
  }

  update() {
    const device = this.sensor.update();

    const alpha = device.alpha ? THREE.Math.degToRad(device.alpha) : 0; // Z
    const beta = device.beta ? THREE.Math.degToRad(device.beta) : 0; // X'
    const gamma = device.gamma ? THREE.Math.degToRad(device.gamma) : 0; // Y''

    const orient = this.screenOrientation ? THREE.Math.degToRad(this.screenOrientation) : 0; // O

    this.setObjectQuaternion(this.object.quaternion, alpha, beta, gamma, orient);
  }

  getSource() {
    return this.sensor;
  }
}

export default PanoramaCameraControl;
