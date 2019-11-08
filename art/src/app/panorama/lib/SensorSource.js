
import SensorSourceType from './SensorSourceType.js';

const GENGAR_EXISTED = (typeof window.gengar !== 'undefined');

class SensorSource {
  constructor(type, ele = document) {
    this.setType(type);
    this.ele = ele;

    const ori_default = { alpha: -90, beta: 90, gamma: 0 };
    this.ori_manual = { ...ori_default };
    this.ori_ori =    { ...ori_default };
    this.ori_motion = { ...ori_default };
    this.ori_gengar = { ...ori_default };

    // for ori_ori
    this.event_ori = e => {
      if (this.type != SensorSourceType.DEVICE_ORIENTATION) {
        return;
      }

      this.ori_ori = e;
    }

    // for ori_motion
    const toDegree = r => r / Math.PI * 180;
    const toRadian = d => d / 180 * Math.PI;
    const { sin, cos, acos, atan, abs, max } = Math;
    let globalYaw = 0.0;
    let cosRoll = 1.0;
    let sinRoll = 0.0;
    this.event_motion = e => {
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
    };

    // for ori_manual
    let isUserInteracting = false;
    let onMouseDownMouseX = 0;
    let onMouseDownMouseY = 0;
    let onMouseDownOri = this.ori_manual;
    this.onPointerDown = event => {
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

    this.onPointerMove = event => {
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

    this.onPointerUp = () => {
      isUserInteracting = false;
    }

    window.addEventListener('deviceorientation', this.event_ori, false);
    window.addEventListener('devicemotion', this.event_motion, false);

    this.ele.addEventListener('mousedown', this.onPointerDown, false);
    this.ele.addEventListener('mousemove', this.onPointerMove, false);
    this.ele.addEventListener('mouseup', this.onPointerUp, false);

    this.ele.addEventListener('touchstart', this.onPointerDown, false);
    this.ele.addEventListener('touchmove', this.onPointerMove, false);
    this.ele.addEventListener('touchend', this.onPointerUp, false);

    // for ori_gengar
    if (GENGAR_EXISTED) {
      this.event_gengar = e => {
        this.ori_gengar = e;
      };
      gengar.addEventListener('deviceorientation', this.event_gengar, false);
    }
  }

  unlisten() {
    window.removeEventListener('deviceorientation', this.event_ori, false);
    window.removeEventListener('devicemotion', this.event_motion, false);

    this.ele.removeEventListener('mousedown', this.onPointerDown, false);
    this.ele.removeEventListener('mousemove', this.onPointerMove, false);
    this.ele.removeEventListener('mouseup', this.onPointerUp, false);

    this.ele.removeEventListener('touchstart', this.onPointerDown, false);
    this.ele.removeEventListener('touchmove', this.onPointerMove, false);
    this.ele.removeEventListener('touchend', this.onPointerUp, false);

    if (GENGAR_EXISTED) {
      gengar.removeEventListener('deviceorientation', this.event_gengar, false);
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

export default SensorSource;
