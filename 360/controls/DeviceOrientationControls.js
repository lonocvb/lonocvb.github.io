/**
 * @author richt / http://richt.me
 * @author WestLangley / http://github.com/WestLangley
 *
 * W3C Device Orientation control (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
 *
 * @author yufu.kao@kaiostech.com
 */

THREE.DeviceOrientationControls = function ( object, controlElement ) {

	var scope = this;

	this.object = object;
	this.object.rotation.reorder( 'YXZ' );
	this.controlElement = controlElement;

	this.enabled = true;

	this.deviceOrientation = {};
	this.screenOrientation = 0;

	this.alphaOffset = 0; // radians

	this.isUserInteracting = false;
	this.enableSesnor = true;
	this.lon = 0;
	this.lat = 0;

	var onDeviceOrientationChangeEvent = function ( event ) {

		if ( scope.enableSesnor === true ) {

			scope.deviceOrientation = event;

			scope.lon = 0;
			scope.lat = 0;

		}

	};

	var onScreenOrientationChangeEvent = function (e) {

		const orientation = (window.gengar) ? e.orientation : window.orientation;

		scope.screenOrientation = orientation || 0;

	};
	const onPointerDown = function (event) {

		scope.isUserInteracting = true;
		scope.enableSesnor = false;
		scope.controlElement.checked = false;

		var clientX = event.clientX || event.touches[ 0 ].clientX;
		var clientY = event.clientY || event.touches[ 0 ].clientY;

		scope.onMouseDownMouseX = clientX;
		scope.onMouseDownMouseY = clientY;

		scope.onMouseDownLon = scope.lon;
		scope.onMouseDownLat = scope.lat;
	}

	const onPointerMove = function (event) {

		if ( scope.isUserInteracting === true ) {

			var clientX = event.clientX || event.touches[ 0 ].clientX;
			var clientY = event.clientY || event.touches[ 0 ].clientY;

			scope.lon = ( clientX - scope.onMouseDownMouseX ) * 0.2 + scope.onMouseDownLon;
			scope.lat = ( clientY - scope.onMouseDownMouseY ) * 0.2  + scope.onMouseDownLat;

		}

	}

	const onPointerUp = function () {

		scope.isUserInteracting = false;

	}

	// The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

	var setObjectQuaternion = function () {

		var zee = new THREE.Vector3( 0, 0, 1 );

		var euler = new THREE.Euler();

		var q0 = new THREE.Quaternion();

		var q1 = new THREE.Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) ); // - PI/2 around the x-axis

		return function ( quaternion, alpha, beta, gamma, orient ) {

			alpha += THREE.Math.degToRad(scope.lon);

			beta += THREE.Math.degToRad(scope.lat);

			euler.set( beta, alpha, - gamma, 'YXZ' ); // 'ZXY' for the device, but 'YXZ' for us

			quaternion.setFromEuler( euler ); // orient the device

			quaternion.multiply( q1 ); // camera looks out the back of the device, not the top

			quaternion.multiply( q0.setFromAxisAngle( zee, - orient ) ); // adjust for screen orientation

		};

	}();

	this.connect = function () {

		onScreenOrientationChangeEvent(); // run once on load

		const target = (window.gengar) ? gengar : window;

		target.addEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
		target.addEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

		document.addEventListener( 'mousedown', onPointerDown, false );
		document.addEventListener( 'mousemove', onPointerMove, false );
		document.addEventListener( 'mouseup', onPointerUp, false );

		document.addEventListener( 'touchstart', onPointerDown, false );
		document.addEventListener( 'touchmove', onPointerMove, false );
		document.addEventListener( 'touchend', onPointerUp, false );

		scope.controlElement.onclick = function () {
			scope.enableSesnor = this.checked;
		}

		scope.enabled = true;

	};

	this.disconnect = function () {

		const target = (window.gengar) ? gengar : window;

		target.removeEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
		target.removeEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

		scope.enabled = false;

	};

	this.update = function () {

		if ( scope.enabled === false ) return;

		var device = scope.deviceOrientation;

		if ( device ) {

			var alpha = device.alpha ? THREE.Math.degToRad( device.alpha ) + scope.alphaOffset : 0; // Z

			var beta = device.beta ? THREE.Math.degToRad( device.beta ) : 0; // X'

			var gamma = device.gamma ? THREE.Math.degToRad( device.gamma ) : 0; // Y''

			var orient = scope.screenOrientation ? THREE.Math.degToRad( scope.screenOrientation ) : 0; // O

			setObjectQuaternion( scope.object.quaternion, alpha, beta, gamma, orient );

		}

	};

	this.dispose = function () {

		scope.disconnect();

	};

	this.connect();

};