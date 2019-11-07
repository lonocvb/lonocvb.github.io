require=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _SensorSourceType = _interopRequireDefault(require("./SensorSourceType.js"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * @author yufu.kao@kaiostech.com
 *
 * ref & modified from :
 *
 * THREE.js Examples (https://threejs.org/examples/jsm/controls/DeviceOrientationControls.js)
 * W3C Device Orientation control (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
 */
var GENGAR_EXISTED = typeof window.gengar !== 'undefined';

var SensorSource =
/*#__PURE__*/
function () {
  function SensorSource(type) {
    var _this = this;

    (0, _classCallCheck2["default"])(this, SensorSource);
    this.setType(type);
    this.ori_manual = {
      alpha: -90,
      beta: 90,
      gamma: 0
    };
    this.ori_ori = {
      alpha: -90,
      beta: 90,
      gamma: 0
    };
    this.ori_motion = {
      alpha: -90,
      beta: 90,
      gamma: 0
    };
    this.ori_gengar = {
      alpha: -90,
      beta: 90,
      gamma: 0
    };
    window.addEventListener('deviceorientation', function (e) {
      if (_this.type != _SensorSourceType["default"].DEVICE_ORIENTATION) {
        return;
      }

      _this.ori_ori = e;
    }, false);

    var toDegree = function toDegree(r) {
      return r / Math.PI * 180;
    };

    var toRadian = function toRadian(d) {
      return d / 180 * Math.PI;
    };

    var sin = Math.sin,
        cos = Math.cos,
        acos = Math.acos,
        atan = Math.atan,
        abs = Math.abs,
        max = Math.max;
    var globalYaw = 0.0;
    var cosRoll = 1.0;
    var sinRoll = 0.0;
    window.addEventListener('devicemotion', function (e) {
      if (_this.type != _SensorSourceType["default"].DEVICE_MOTION) {
        return;
      }

      if (e.rotationRate.alpha) {
        var _e$rotationRate = e.rotationRate,
            alpha = _e$rotationRate.alpha,
            beta = _e$rotationRate.beta;
        var interval = e.interval;
        var rotationRate = toRadian(beta * cosRoll + alpha * sinRoll) * interval / 1000;
        globalYaw += rotationRate;
      }

      if (e.accelerationIncludingGravity.x) {
        var _e$accelerationInclud = e.accelerationIncludingGravity,
            x = _e$accelerationInclud.x,
            y = _e$accelerationInclud.y,
            z = _e$accelerationInclud.z;
        var pitch = acos(z / max(9.8, x, y, z));
        var roll = abs(x) + abs(y) < 2 ? 0 : atan(x / y) + (y < 0 ? Math.PI : 0.0);
        cosRoll = cos(roll);
        sinRoll = sin(roll);

        var _alpha = toDegree(globalYaw + roll);

        var _beta = toDegree(pitch * cosRoll);

        var gamma = toDegree(-pitch * sinRoll);
        _this.ori_motion = {
          alpha: _alpha,
          beta: _beta,
          gamma: gamma
        };
      }
    }, false);
    var isUserInteracting = false;
    var onMouseDownMouseX = 0;
    var onMouseDownMouseY = 0;
    var onMouseDownOri = this.ori_manual;

    var onPointerDown = function onPointerDown(event) {
      if (_this.type != _SensorSourceType["default"].MANUAL) {
        return;
      }

      isUserInteracting = true;
      var clientX = event.clientX || event.touches[0].clientX;
      var clientY = event.clientY || event.touches[0].clientY;
      onMouseDownMouseX = clientX;
      onMouseDownMouseY = clientY;
      onMouseDownOri = _objectSpread({}, _this.ori_manual);
    };

    var onPointerMove = function onPointerMove(event) {
      if (_this.type != _SensorSourceType["default"].MANUAL) {
        return;
      }

      if (isUserInteracting === true) {
        var clientX = event.clientX || event.touches[0].clientX;
        var clientY = event.clientY || event.touches[0].clientY;
        var lon = (clientX - onMouseDownMouseX) * 0.2;
        var lat = (clientY - onMouseDownMouseY) * 0.2;
        var alpha = onMouseDownOri.alpha + lon;
        var beta = onMouseDownOri.beta + lat;
        var gamma = onMouseDownOri.gamma;
        _this.ori_manual = {
          alpha: alpha,
          beta: beta,
          gamma: gamma
        };
      }
    };

    var onPointerUp = function onPointerUp() {
      isUserInteracting = false;
    };

    document.addEventListener('mousedown', function (e) {
      return onPointerDown(e);
    }, false);
    document.addEventListener('mousemove', function (e) {
      return onPointerMove(e);
    }, false);
    document.addEventListener('mouseup', function (e) {
      return onPointerUp(e);
    }, false);
    document.addEventListener('touchstart', function (e) {
      return onPointerDown(e);
    }, false);
    document.addEventListener('touchmove', function (e) {
      return onPointerMove(e);
    }, false);
    document.addEventListener('touchend', function (e) {
      return onPointerUp(e);
    }, false);

    if (GENGAR_EXISTED) {
      gengar.addEventListener('deviceorientation', function (e) {
        _this.ori_gengar = e;
      }, false);
    }
  }

  (0, _createClass2["default"])(SensorSource, [{
    key: "setType",
    value: function setType(type) {
      if (type == this.type) {
        return;
      }

      if (this.type == _SensorSourceType["default"].MANUAL) {
        var _this$update = this.update(),
            alpha = _this$update.alpha,
            beta = _this$update.beta,
            gamma = _this$update.gamma;

        this.ori_manual = {
          alpha: alpha,
          beta: beta,
          gamma: gamma
        };
      }

      this.type = type;
    }
  }, {
    key: "update",
    value: function update() {
      if (this.type == _SensorSourceType["default"].MANUAL) {
        return this.ori_manual;
      } else if (this.type == _SensorSourceType["default"].DEVICE_ORIENTATION) {
        return this.ori_ori;
      } else if (this.type == _SensorSourceType["default"].DEVICE_MOTION) {
        return this.ori_motion;
      } else if (this.type == _SensorSourceType["default"].GENGAR) {
        return this.ori_gengar;
      }

      throw 'unknown type:' + this.type;
    }
  }]);
  return SensorSource;
}();

var PanoramaCameraControl =
/*#__PURE__*/
function () {
  function PanoramaCameraControl(object) {
    (0, _classCallCheck2["default"])(this, PanoramaCameraControl);
    this.object = object;
    this.object.rotation.reorder('YXZ');
    this.screenOrientation = 0;
    this.connect();
  }

  (0, _createClass2["default"])(PanoramaCameraControl, [{
    key: "onScreenOrientationChangeEvent",
    value: function onScreenOrientationChangeEvent(e) {
      var orientation = e && e.orientation ? e.orientation : window.orientation;
      this.screenOrientation = orientation || 0;
    }
  }, {
    key: "setObjectQuaternion",
    value: function setObjectQuaternion(quaternion, alpha, beta, gamma, orient) {
      var zee = new THREE.Vector3(0, 0, 1);
      var euler = new THREE.Euler();
      var q0 = new THREE.Quaternion();
      var q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis

      euler.set(beta, alpha, -gamma, 'YXZ'); // 'ZXY' for the device, but 'YXZ' for us

      quaternion.setFromEuler(euler); // orient the device

      quaternion.multiply(q1); // camera looks out the back of the device, not the top

      quaternion.multiply(q0.setFromAxisAngle(zee, -orient)); // adjust for screen orientation
    }
  }, {
    key: "connect",
    value: function connect() {
      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _SensorSourceType["default"].DEVICE_ORIENTATION;
      this.onScreenOrientationChangeEvent(); // run once on load

      this.sensor = new SensorSource(type);
    }
  }, {
    key: "setSensorType",
    value: function setSensorType(type) {
      this.sensor.setType(type);
    }
  }, {
    key: "update",
    value: function update() {
      var device = this.sensor.update();
      var alpha = device.alpha ? THREE.Math.degToRad(device.alpha) : 0; // Z

      var beta = device.beta ? THREE.Math.degToRad(device.beta) : 0; // X'

      var gamma = device.gamma ? THREE.Math.degToRad(device.gamma) : 0; // Y''

      var orient = this.screenOrientation ? THREE.Math.degToRad(this.screenOrientation) : 0; // O

      this.setObjectQuaternion(this.object.quaternion, alpha, beta, gamma, orient);
    }
  }]);
  return PanoramaCameraControl;
}();

var _default = PanoramaCameraControl;
exports["default"] = _default;

},{"./SensorSourceType.js":3,"@babel/runtime/helpers/classCallCheck":"@babel/runtime/helpers/classCallCheck","@babel/runtime/helpers/createClass":"@babel/runtime/helpers/createClass","@babel/runtime/helpers/defineProperty":"@babel/runtime/helpers/defineProperty","@babel/runtime/helpers/interopRequireDefault":"@babel/runtime/helpers/interopRequireDefault"}],2:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _PanoramaCameraControl = _interopRequireDefault(require("./PanoramaCameraControl.js"));

var gRadius = 1000; // ref: THREE.js

var PanoramaViewer =
/*#__PURE__*/
function () {
  function PanoramaViewer(_ref) {
    var _this = this;

    var canvas = _ref.canvas,
        width = _ref.width,
        height = _ref.height,
        imagePath = _ref.imagePath,
        _ref$textLabels = _ref.textLabels,
        textLabels = _ref$textLabels === void 0 ? [] : _ref$textLabels,
        _ref$onLabelClick = _ref.onLabelClick,
        onLabelClick = _ref$onLabelClick === void 0 ? function () {} : _ref$onLabelClick;
    (0, _classCallCheck2["default"])(this, PanoramaViewer);
    canvas.style.overflow = 'hidden';
    this.initWebGL({
      canvas: canvas,
      width: width,
      height: height,
      imagePath: imagePath
    });
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = textLabels[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var label = _step.value;
        this.createLabelSprite(label);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    canvas.addEventListener('click', function (e) {
      var _mouse = {};
      _mouse.x = event.clientX / window.innerWidth * 2 - 1;
      _mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      var _raycaster = new THREE.Raycaster();

      _raycaster.setFromCamera(_mouse, _this.cameraOrtho);

      var intersects = _raycaster.intersectObjects(_this.sceneOrtho.children);

      intersects.forEach(function (o) {
        return onLabelClick(o.object.label);
      });
    }, false);
  }

  (0, _createClass2["default"])(PanoramaViewer, [{
    key: "initWebGL",
    value: function initWebGL(_ref2) {
      var canvas = _ref2.canvas,
          width = _ref2.width,
          height = _ref2.height,
          imagePath = _ref2.imagePath;
      this.renderer = new THREE.WebGLRenderer({
        canvas: canvas
      });
      this.renderer.setSize(width, height);
      this.renderer.autoClear = false;
      this.sceneOrtho = new THREE.Scene();
      this.cameraOrtho = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 1, gRadius);
      this.cameraOrtho.position.z = 400;
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(75, width / height, 1, gRadius);
      this.camera.target = new THREE.Vector3(0, 0, 0);
      this.cameraControl = new _PanoramaCameraControl["default"](this.camera);
      this.cameraControl.connect();
      this.sphere = new THREE.SphereBufferGeometry(100, 100, 40);
      this.sphere.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
      this.sphereMaterial = new THREE.MeshBasicMaterial();
      this.sphereMaterial.map = THREE.ImageUtils.loadTexture(imagePath);
      this.scene.add(new THREE.Mesh(this.sphere, this.sphereMaterial));
    }
  }, {
    key: "startAnimate",
    value: function startAnimate() {
      var _this2 = this;

      requestAnimationFrame(function () {
        return _this2.startAnimate();
      });
      this.render();
    }
  }, {
    key: "render",
    value: function render() {
      this.cameraControl.update();
      this.updateSprites();
      this.renderer.render(this.scene, this.camera);
      this.renderer.render(this.sceneOrtho, this.cameraOrtho);
    }
  }, {
    key: "changeSize",
    value: function changeSize(width, height) {
      this.renderer.setSize(width, height);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.cameraOrtho = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 1, 10);
      this.cameraOrtho.position.z = 10;
    }
  }, {
    key: "createLabelSprite",
    value: function createLabelSprite(_ref3) {
      var text = _ref3.text,
          pos = _ref3.position,
          _ref3$args = _ref3.args,
          args = _ref3$args === void 0 ? [] : _ref3$args;
      var canvas1 = document.createElement('canvas');
      var context1 = canvas1.getContext('2d');
      var height = 20;
      var padding = 4;
      context1.font = "".concat(height, "px Arial");
      var metrics = context1.measureText(text);
      var width = metrics.width; // resize canvas to fix content;

      canvas1.width = width + padding + padding;
      canvas1.height = height + padding + padding; // context1 is reset, so we need to set the 'font' again.

      context1.font = "".concat(height, "px Arial");
      context1.fillStyle = "rgba(0,0,0,0.5)";
      context1.fillRect(0, 0, canvas1.width, canvas1.height);
      context1.fillStyle = "rgba(255,255,255,0.95)";
      context1.fillText(text, padding, height);
      var texture1 = new THREE.CanvasTexture(canvas1);
      var spriteMaterial = new THREE.SpriteMaterial({
        map: texture1
      });
      var sprite1 = new THREE.Sprite(spriteMaterial);
      sprite1.scale.set(1.0, 1.0, 1.0);
      sprite1.position.set(0, 0, 0);
      sprite1.name = text;
      sprite1.label = {
        text: text,
        pos: pos,
        args: args,
        width: canvas1.width,
        height: canvas1.height
      };
      this.sceneOrtho.add(sprite1);
    }
  }, {
    key: "updateSprites",
    value: function updateSprites() {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.sceneOrtho.children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var sprite = _step2.value;
          var label = sprite.label;
          var wp = geoPosition2World(label.pos.lon, label.pos.lat);
          var sp = worldPostion2Screen(wp, this.camera);
          var test = wp.clone().project(this.camera);

          if (test.x > -1 && test.x < 1 && test.y > -1 && test.y < 1 && test.z > -1 && test.z < 1) {
            var width = label.width;
            var height = label.height;
            sprite.scale.set(width, height, 10);
            sprite.position.set(sp.x + width / 2, sp.y - height / 2, 1);
          } else {
            sprite.scale.set(1.0, 1.0, 1.0);
            sprite.position.set(0, 0, 0);
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }, {
    key: "setSensorType",
    value: function setSensorType(type) {
      this.cameraControl.setSensorType(type);
    }
  }, {
    key: "changeTexture",
    value: function changeTexture(imagePath) {
      this.sphereMaterial.map = THREE.ImageUtils.loadTexture(imagePath);
    }
  }]);
  return PanoramaViewer;
}();

function geoPosition2World(lon, lat) {
  var phi = THREE.Math.degToRad(90 - lat);
  var theta = THREE.Math.degToRad(lon);
  var result = {
    x: gRadius * Math.sin(phi) * Math.cos(theta),
    y: gRadius * Math.cos(phi),
    z: gRadius * Math.sin(phi) * Math.sin(theta)
  };
  return new THREE.Vector3(result.x, result.y, result.z);
}

function worldPostion2Screen(world_vector, camera) {
  var vector = world_vector.clone().project(camera);
  var result = {
    x: Math.round((vector.x + 1) * window.innerWidth / 2 - window.innerWidth / 2),
    y: Math.round(window.innerHeight / 2 - (-vector.y + 1) * window.innerHeight / 2),
    z: 0
  };
  return new THREE.Vector3(result.x, result.y, result.z);
}

var _default = PanoramaViewer;
exports["default"] = _default;

},{"./PanoramaCameraControl.js":1,"@babel/runtime/helpers/classCallCheck":"@babel/runtime/helpers/classCallCheck","@babel/runtime/helpers/createClass":"@babel/runtime/helpers/createClass","@babel/runtime/helpers/interopRequireDefault":"@babel/runtime/helpers/interopRequireDefault"}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var SensorSourceType = {
  MANUAL: 1,
  DEVICE_ORIENTATION: 2,
  DEVICE_MOTION: 3,
  GENGAR: 4
};
var _default = SensorSourceType;
exports["default"] = _default;

},{}],4:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _PanoramaViewer = _interopRequireDefault(require("./lib/PanoramaViewer.js"));

var _SensorSourceType = _interopRequireDefault(require("./lib/SensorSourceType.js"));

var GENGAR_EXISTED = typeof window.gengar !== 'undefined';

function initGengar(_ref) {
  var viewer = _ref.viewer;

  if (!window.gengar) {
    console.log('gengar is not supported.');
    return;
  } // hint to the frontend


  gengar.postMessage('enable event orientationchange');
  gengar.postMessage('enable event deviceorientation');
}

function main() {
  var viewer = new _PanoramaViewer["default"]({
    canvas: document.querySelector('canvas'),
    imagePath: './04.jpg',
    width: window.innerWidth,
    height: window.innerHeight,
    textLabels: [{
      text: '0,0',
      position: {
        lon: 0,
        lat: 0
      },
      args: {
        yo: 'yo'
      }
    }, {
      text: '45,0',
      position: {
        lon: 45,
        lat: 0
      },
      args: {
        yo: 'yo'
      }
    }, {
      text: '90,0',
      position: {
        lon: 90,
        lat: 0
      },
      args: {
        yo: 'yo'
      }
    }, {
      text: '135,0',
      position: {
        lon: 135,
        lat: 0
      },
      args: {
        yo: 'yo'
      }
    }, {
      text: '180,0',
      position: {
        lon: 180,
        lat: 0
      },
      args: {
        yo: 'yo'
      }
    }, {
      text: '225,0',
      position: {
        lon: 225,
        lat: 0
      },
      args: {
        yo: 'yo'
      }
    }, {
      text: '270,0',
      position: {
        lon: 270,
        lat: 0
      },
      args: {
        yo: 'yo'
      }
    }, {
      text: '315,0',
      position: {
        lon: 315,
        lat: 0
      },
      args: {
        yo: 'yo'
      }
    }, {
      text: '0,45',
      position: {
        lon: 0,
        lat: 45
      },
      args: {
        yo: 'yo'
      }
    }, {
      text: '90,45',
      position: {
        lon: 90,
        lat: 45
      },
      args: {
        yo: 'yo'
      }
    }, {
      text: '180,45',
      position: {
        lon: 180,
        lat: 45
      },
      args: {
        yo: 'yo'
      }
    }, {
      text: '270,45',
      position: {
        lon: 270,
        lat: 45
      },
      args: {
        yo: 'yo'
      }
    }, {
      text: '0,-45',
      position: {
        lon: 0,
        lat: -45
      },
      args: {
        yo: 'yo'
      }
    }, {
      text: '90,-45',
      position: {
        lon: 90,
        lat: -45
      },
      args: {
        yo: 'yo'
      }
    }, {
      text: '180,-45',
      position: {
        lon: 180,
        lat: -45
      },
      args: {
        yo: 'yo'
      }
    }, {
      text: '270,-45',
      position: {
        lon: 270,
        lat: -45
      },
      args: {
        yo: 'yo'
      }
    }, {
      text: 'top',
      position: {
        lon: 0,
        lat: 90
      },
      args: {
        yo: 'yo'
      }
    }, {
      text: 'bottom',
      position: {
        lon: 0,
        lat: -90
      },
      args: {
        yo: 'yo'
      }
    }],
    onLabelClick: function onLabelClick(label) {
      return console.log(label.text);
    }
  }); // react for size change

  window.addEventListener('resize', function () {
    viewer.changeSize(window.innerWidth, window.innerHeight);
  }, true);
  viewer.startAnimate(); // select sensors

  var handleRadioSensorChange = function handleRadioSensorChange(e) {
    var newType = document.querySelector('.control input:checked').value;
    viewer.setSensorType(newType);
  };

  document.querySelectorAll('.control input[type="radio"]').forEach(function (radio) {
    return radio.addEventListener('change', handleRadioSensorChange);
  });

  if (!GENGAR_EXISTED) {
    document.querySelectorAll('.gengar').forEach(function (div) {
      return div.style.display = 'none';
    });
  } else {
    initGengar({
      viewer: viewer
    });
    document.querySelectorAll('.normal').forEach(function (div) {
      return div.style.display = 'none';
    });
    document.querySelector('#radio_gengar').checked = true;
  }

  handleRadioSensorChange();
}

main();

},{"./lib/PanoramaViewer.js":2,"./lib/SensorSourceType.js":3,"@babel/runtime/helpers/interopRequireDefault":"@babel/runtime/helpers/interopRequireDefault"}],5:[function(require,module,exports){
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

module.exports = _arrayWithHoles;
},{}],6:[function(require,module,exports){
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }
}

module.exports = _arrayWithoutHoles;
},{}],7:[function(require,module,exports){
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

module.exports = _assertThisInitialized;
},{}],8:[function(require,module,exports){
function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

module.exports = _iterableToArray;
},{}],9:[function(require,module,exports){
function _iterableToArrayLimit(arr, i) {
  if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
    return;
  }

  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

module.exports = _iterableToArrayLimit;
},{}],10:[function(require,module,exports){
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

module.exports = _nonIterableRest;
},{}],11:[function(require,module,exports){
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

module.exports = _nonIterableSpread;
},{}],12:[function(require,module,exports){
function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

module.exports = _setPrototypeOf;
},{}],13:[function(require,module,exports){
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}

},{}],"@babel/runtime/helpers/asyncToGenerator":[function(require,module,exports){
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

module.exports = _asyncToGenerator;
},{}],"@babel/runtime/helpers/classCallCheck":[function(require,module,exports){
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;
},{}],"@babel/runtime/helpers/createClass":[function(require,module,exports){
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

module.exports = _createClass;
},{}],"@babel/runtime/helpers/defineProperty":[function(require,module,exports){
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

module.exports = _defineProperty;
},{}],"@babel/runtime/helpers/getPrototypeOf":[function(require,module,exports){
function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

module.exports = _getPrototypeOf;
},{}],"@babel/runtime/helpers/inherits":[function(require,module,exports){
var setPrototypeOf = require("./setPrototypeOf");

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) setPrototypeOf(subClass, superClass);
}

module.exports = _inherits;
},{"./setPrototypeOf":12}],"@babel/runtime/helpers/interopRequireDefault":[function(require,module,exports){
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault;
},{}],"@babel/runtime/helpers/possibleConstructorReturn":[function(require,module,exports){
var _typeof = require("../helpers/typeof");

var assertThisInitialized = require("./assertThisInitialized");

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return assertThisInitialized(self);
}

module.exports = _possibleConstructorReturn;
},{"../helpers/typeof":"@babel/runtime/helpers/typeof","./assertThisInitialized":7}],"@babel/runtime/helpers/slicedToArray":[function(require,module,exports){
var arrayWithHoles = require("./arrayWithHoles");

var iterableToArrayLimit = require("./iterableToArrayLimit");

var nonIterableRest = require("./nonIterableRest");

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || nonIterableRest();
}

module.exports = _slicedToArray;
},{"./arrayWithHoles":5,"./iterableToArrayLimit":9,"./nonIterableRest":10}],"@babel/runtime/helpers/toConsumableArray":[function(require,module,exports){
var arrayWithoutHoles = require("./arrayWithoutHoles");

var iterableToArray = require("./iterableToArray");

var nonIterableSpread = require("./nonIterableSpread");

function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || nonIterableSpread();
}

module.exports = _toConsumableArray;
},{"./arrayWithoutHoles":6,"./iterableToArray":8,"./nonIterableSpread":11}],"@babel/runtime/helpers/typeof":[function(require,module,exports){
function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

function _typeof(obj) {
  if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return _typeof2(obj);
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;
},{}],"@babel/runtime/regenerator":[function(require,module,exports){
module.exports = require("regenerator-runtime");

},{"regenerator-runtime":13}]},{},[4]);
