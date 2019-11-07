/**
 * @author yufu.kao@kaiostech.com
 * ref & modified from :
 *
 * THREE.js Examples (https://threejs.org/examples/jsm/controls/DeviceOrientationControls.js)
 * W3C Device Orientation control (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
 */

class PanoramaCameraControl {

	constructor(object, controlElement) {

		this.object = object;
		this.object.rotation.reorder( 'YXZ' );
		this.controlElement = controlElement;

		this.deviceOrientation = {};
		this.screenOrientation = 0;

		this.isUserInteracting = false;
		this.enableSesnor = true;
		this.roll = 0;
		this.curRoll = 0;
		this.lastRoll = 0;

		this.deviceOrientation = { alpha: -90, beta: 90, gamma: 0 };

		this.connect();
	}

	onDeviceOrientationChangeEvent(event) {
		this.curRoll = Math.atan(event.gamma / event.beta);
		if (event.beta < 0) {
			this.curRoll += Math.PI;
		}

		if (this.enableSesnor === true) {
			this.deviceOrientation = event;
			this.lastRoll = this.curRoll;
		}

		this.roll = this.curRoll - this.lastRoll;
	};

	onScreenOrientationChangeEvent(e) {
		const orientation = e && e.orientation ? e.orientation : window.orientation;

		this.screenOrientation = orientation || 0;
	};

	onPointerDown(event) {
		this.isUserInteracting = true;
		this.enableSesnor = false;
		this.controlElement.checked = false;

		const clientX = event.clientX || event.touches[ 0 ].clientX;
		const clientY = event.clientY || event.touches[ 0 ].clientY;

		this.onMouseDownMouseX = clientX;
		this.onMouseDownMouseY = clientY;
	}

	onPointerMove(event) {
		if ( this.isUserInteracting === true ) {
			const clientX = event.clientX || event.touches[ 0 ].clientX;
			const clientY = event.clientY || event.touches[ 0 ].clientY;

			const lon = ( clientX - this.onMouseDownMouseX ) * 0.2;
			const lat = ( clientY - this.onMouseDownMouseY ) * 0.2;
			const c = Math.cos(- this.roll);
			const s = Math.sin(- this.roll);
			const lonR = lon * c + lat * s;
			const latR = lon * -s + lat * c;

			const alpha = this.deviceOrientation.alpha + lonR;
			const beta = this.deviceOrientation.beta + latR;
			const gamma = this.deviceOrientation.gamma;

			this.deviceOrientation = { alpha, beta, gamma };

			this.onMouseDownMouseX = clientX;
			this.onMouseDownMouseY = clientY;
		}
	}

	onPointerUp() {
		this.isUserInteracting = false;
	}


	setObjectQuaternion(quaternion, alpha, beta, gamma, orient) {
		const zee = new THREE.Vector3( 0, 0, 1 );
		const euler = new THREE.Euler();
		const q0 = new THREE.Quaternion();
		const q1 = new THREE.Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) ); // - PI/2 around the x-axis

		euler.set( beta, alpha, - gamma, 'YXZ' ); // 'ZXY' for the device, but 'YXZ' for us
		quaternion.setFromEuler( euler ); // orient the device
		quaternion.multiply( q1 ); // camera looks out the back of the device, not the top
		quaternion.multiply( q0.setFromAxisAngle( zee, - this.roll - orient ) ); // adjust for screen orientation
	}

	connect() {
		this.onScreenOrientationChangeEvent(); // run once on load

		const target = (window.gengar) ? gengar : window;

		target.addEventListener('orientationchange', e => this.onScreenOrientationChangeEvent(e), false);
		target.addEventListener('deviceorientation', e => this.onDeviceOrientationChangeEvent(e), false);

		document.addEventListener('mousedown', e => this.onPointerDown(e), false);
		document.addEventListener('mousemove', e => this.onPointerMove(e), false);
		document.addEventListener('mouseup', e => this.onPointerUp(e), false);

		document.addEventListener('touchstart', e => this.onPointerDown(e), false);
		document.addEventListener('touchmove', e => this.onPointerMove(e), false);
		document.addEventListener('touchend', e => this.onPointerUp(e), false);

		const that = this;
		this.controlElement.onclick = function() {
			that.enableSesnor = this.checked;
		}
	}

	update() {
		const device = this.deviceOrientation;

		const alpha = device.alpha ? THREE.Math.degToRad(device.alpha) : 0; // Z
		const beta = device.beta ? THREE.Math.degToRad(device.beta) : 0; // X'
		const gamma = device.gamma ? THREE.Math.degToRad(device.gamma) : 0; // Y''

		const orient = this.screenOrientation ? THREE.Math.degToRad(this.screenOrientation) : 0; // O

		this.setObjectQuaternion(this.object.quaternion, alpha, beta, gamma, orient);
	}

}

export default PanoramaCameraControl;
