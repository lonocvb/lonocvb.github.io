/**
 * @author yufu.kao@kaiostech.com
 *
 * ref & modified from :
 *
 * THREE.js Examples (https://threejs.org/examples/jsm/controls/DeviceOrientationControls.js)
 * W3C Device Orientation control (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
 */

const GENGAR_EXISTED = (typeof window.gengar !== 'undefined');

const SensorSourceType = {
  MANUAL: 1,
  DEVICE_ORIENTATION: 2,
  DEVICE_MOTION: 3,
  GENGAR: 4,
};

class SensorSource {
  constructor(type) {
    this.setType(type);

    this.ori_manual = { alpha: -90, beta: 90, gamma: 0 };
    this.ori_ori =     { alpha: -90, beta: 90, gamma: 0 };
    this.ori_motion = { alpha: -90, beta: 90, gamma: 0 };
    this.ori_gengar = { alpha: -90, beta: 90, gamma: 0 };

    window.addEventListener('deviceorientation', e => {
      if (this.type != SensorSourceType.DEVICE_ORIENTATION) {
        return;
      }

      this.ori_ori = e;
    }, false);

    const toDegree = r => r / Math.PI * 180;
    const toRadian = d => d / 180 * Math.PI;
    const { sin, cos, acos, atan, abs, max } = Math;
    let globalYaw = 0.0;
    let cosRoll = 1.0;
    let sinRoll = 0.0;
    window.addEventListener('devicemotion', e => {
      if (this.type != SensorSourceType.DEVICE_MOTION) {
        return;
      }

      if (e.rotationRate.alpha) {
        const { alpha, beta } = e.rotationRate;
        const interval = e.interval;

        const rotationRate = toRadian(beta * cosRoll + alpha * sinRoll) * interval / 1000;
        globalYaw += rotationRate;
      }

      if (e.accelerationIncludingGravity.x) {
        const { x, y, z } = e.accelerationIncludingGravity;

        const pitch = acos(z / max(9.8, x, y, z));
        const roll = abs(x) + abs(y) < 2 ? 0 : (atan(x / y) + (y < 0 ? Math.PI : 0.0));

        cosRoll = cos(roll);
        sinRoll = sin(roll);

        const alpha = toDegree(globalYaw + roll);
        const beta = toDegree(pitch * cosRoll);
        const gamma = toDegree(-pitch * sinRoll);

        this.ori_motion = { alpha, beta, gamma };
      }
    }, false);

    let isUserInteracting = false;
    let onMouseDownMouseX = 0;
    let onMouseDownMouseY = 0;
    let onMouseDownOri = this.ori_manual;
    const onPointerDown = event => {
      if (this.type != SensorSourceType.MANUAL) {
        return;
      }

      isUserInteracting = true;

      const clientX = event.clientX || event.touches[ 0 ].clientX;
      const clientY = event.clientY || event.touches[ 0 ].clientY;

      onMouseDownMouseX = clientX;
      onMouseDownMouseY = clientY;
      onMouseDownOri = { ...this.ori_manual };
    }

    const onPointerMove = event => {
      if (this.type != SensorSourceType.MANUAL) {
        return;
      }

      if ( isUserInteracting === true ) {
        const clientX = event.clientX || event.touches[ 0 ].clientX;
        const clientY = event.clientY || event.touches[ 0 ].clientY;

        const lon = ( clientX - onMouseDownMouseX ) * 0.2;
        const lat = ( clientY - onMouseDownMouseY ) * 0.2;

        const alpha = onMouseDownOri.alpha + lon;
        const beta = onMouseDownOri.beta + lat;
        const gamma = onMouseDownOri.gamma;

        this.ori_manual = { alpha, beta, gamma };
      }
    }

    const onPointerUp = () => {
      isUserInteracting = false;
    }

    document.addEventListener('mousedown', e => onPointerDown(e), false);
    document.addEventListener('mousemove', e => onPointerMove(e), false);
    document.addEventListener('mouseup', e => onPointerUp(e), false);

    document.addEventListener('touchstart', e => onPointerDown(e), false);
    document.addEventListener('touchmove', e => onPointerMove(e), false);
    document.addEventListener('touchend', e => onPointerUp(e), false);

    if (GENGAR_EXISTED) {
      gengar.addEventListener('deviceorientation', e => {
        this.ori_gengar = e;
      }, false);
    }
  }

  setType(type) {
    if (type == this.type) {
      return;
    }

    if (this.type == SensorSourceType.MANUAL) {
      const { alpha, beta, gamma } = this.update();
      this.ori_manual = { alpha, beta, gamma };
    }

    this.type = type;
  }

  update() {
    if (this.type == SensorSourceType.MANUAL) {
      return this.ori_manual;
    } else if (this.type == SensorSourceType.DEVICE_ORIENTATION) {
      return this.ori_ori;
    } else if (this.type == SensorSourceType.DEVICE_MOTION) {
      return this.ori_motion;
    } else if (this.type == SensorSourceType.GENGAR) {
      return this.ori_gengar;
    }

    throw 'unknown type:' + this.type;
  }
}

class PanoramaCameraControl {

  constructor(object) {
    this.object = object;
    this.object.rotation.reorder( 'YXZ' );

    this.screenOrientation = 0;

    this.connect();
  }

  onScreenOrientationChangeEvent(e) {
    const orientation = e && e.orientation ? e.orientation : window.orientation;

    this.screenOrientation = orientation || 0;
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

  connect() {
    this.onScreenOrientationChangeEvent(); // run once on load

    if (GENGAR_EXISTED) {
      this.sensor = new SensorSource(SensorSourceType.GENGAR);

      // TODO binding should not be here.
      document.querySelector('.control').style.display = 'none';
    } else {
      this.sensor = new SensorSource(SensorSourceType.DEVICE_ORIENTATION);

      // TODO binding should not be here.
      const radios = document.querySelectorAll('.control input[type="radio"]');

      for (let radio of radios) {
        radio.addEventListener('change', e => {
          const newType = document.querySelector('.control input:checked').value;
          this.sensor.setType( newType );
        });
      }
    }
  }

  update() {
    const device = this.sensor.update();

    const alpha = device.alpha ? THREE.Math.degToRad(device.alpha) : 0; // Z
    const beta = device.beta ? THREE.Math.degToRad(device.beta) : 0; // X'
    const gamma = device.gamma ? THREE.Math.degToRad(device.gamma) : 0; // Y''

    const orient = this.screenOrientation ? THREE.Math.degToRad(this.screenOrientation) : 0; // O

    this.setObjectQuaternion(this.object.quaternion, alpha, beta, gamma, orient);
  }

}

export default PanoramaCameraControl;
