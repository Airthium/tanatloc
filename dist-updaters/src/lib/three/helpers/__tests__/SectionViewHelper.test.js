"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _three = require("three");

var _SectionViewHelper = require("../SectionViewHelper");

jest.mock('three/examples/jsm/controls/TransformControls', function () {
  return {
    TransformControls: /*#__PURE__*/function () {
      function TransformControls() {
        (0, _classCallCheck2["default"])(this, TransformControls);
      }

      (0, _createClass2["default"])(TransformControls, [{
        key: "attach",
        value: function attach() {}
      }, {
        key: "detach",
        value: function detach() {}
      }, {
        key: "setMode",
        value: function setMode() {}
      }]);
      return TransformControls;
    }()
  };
});
describe('lib/three/helpers/SectionViewHelper', function () {
  var mouseDown;
  var mouseMove;
  var mouseUp;
  var renderer = {
    domElement: {
      addEventListener: function addEventListener(type, callback) {
        if (type === 'mousedown') mouseDown = callback;else if (type === 'mousemove') mouseMove = callback;else if (type === 'mouseup') mouseUp = callback;
      },
      removeEventListener: function removeEventListener() {}
    },
    getSize: function getSize() {}
  };
  var scene = {
    add: function add() {},
    boundingBox: {
      getCenter: function getCenter() {},
      getSize: function getSize() {}
    }
  };
  var camera = {};
  var controls = {
    stop: function stop() {}
  };
  test('call', function () {
    var sectionView = (0, _SectionViewHelper.SectionViewHelper)(renderer, scene, camera, controls);
    expect(sectionView).toBeDefined();
  });
  test('getClippingPlane', function () {
    var sectionView = (0, _SectionViewHelper.SectionViewHelper)(renderer, scene, camera, controls);
    sectionView.getClippingPlane();
  });
  test('start', function () {
    var sectionView = (0, _SectionViewHelper.SectionViewHelper)(renderer, scene, camera, controls);
    sectionView.start();
  });
  test('toogleVisible', function () {
    var sectionView = (0, _SectionViewHelper.SectionViewHelper)(renderer, scene, camera, controls);
    sectionView.toggleVisible();
    sectionView.toggleVisible();
  });
  test('toAxis', function () {
    var sectionView = (0, _SectionViewHelper.SectionViewHelper)(renderer, scene, camera, controls);
    sectionView.toAxis(new _three.Vector3());
  });
  test('flip', function () {
    var sectionView = (0, _SectionViewHelper.SectionViewHelper)(renderer, scene, camera, controls);
    sectionView.flip();
  });
  test('setMode', function () {
    var sectionView = (0, _SectionViewHelper.SectionViewHelper)(renderer, scene, camera, controls);
    sectionView.setMode('mode');
  });
  test('mouse', function () {
    var sectionView = (0, _SectionViewHelper.SectionViewHelper)(renderer, scene, camera, controls);
    mouseDown({});
    mouseMove({
      target: {
        getBoundingClientRect: function getBoundingClientRect() {
          return {};
        }
      }
    });
    mouseUp({});
    sectionView.start();
    mouseMove({
      target: {
        getBoundingClientRect: function getBoundingClientRect() {
          return {};
        }
      }
    });
    global.MockRaycaster.intersectObject = [{}];
    mouseMove({
      target: {
        getBoundingClientRect: function getBoundingClientRect() {
          return {};
        }
      }
    });
    mouseMove({
      target: {
        getBoundingClientRect: function getBoundingClientRect() {
          return {};
        }
      }
    });
    mouseDown({});
    mouseMove({
      target: {
        getBoundingClientRect: function getBoundingClientRect() {
          return {};
        }
      }
    });
    mouseUp({});
    global.MockRaycaster.intersectObject = [];
    mouseMove({
      target: {
        getBoundingClientRect: function getBoundingClientRect() {
          return {};
        }
      }
    });
    mouseUp({});
  });
  test('stop', function () {
    var sectionView = (0, _SectionViewHelper.SectionViewHelper)(renderer, scene, camera, controls);
    sectionView.stop();
  });
  test('dispose', function () {
    global.MockGroup.children = [{
      geometry: {
        dispose: function dispose() {}
      },
      material: {
        dispose: function dispose() {}
      }
    }];
    var sectionView = (0, _SectionViewHelper.SectionViewHelper)(renderer, scene, camera, controls);
    sectionView.dispose();
  });
});