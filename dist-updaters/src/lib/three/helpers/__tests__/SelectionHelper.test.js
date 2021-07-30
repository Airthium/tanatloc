"use strict";

var _SelectionHelper = require("../SelectionHelper");

document.createElement = function () {
  return {
    style: {}
  };
};

describe('lib/three/helpers/SelectionHelper', function () {
  var mouseDown;
  var mouseMove;
  var mouseUp;
  var renderer = {
    domElement: {
      getBoundingClientRect: function getBoundingClientRect() {
        return {};
      },
      addEventListener: function addEventListener(type, callback) {
        if (type === 'pointerdown') mouseDown = callback;else if (type === 'pointermove') mouseMove = callback;else if (type === 'pointerup') mouseUp = callback;
      },
      removeEventListener: function removeEventListener() {},
      parentElement: {
        appendChild: function appendChild() {}
      }
    },
    getSize: function getSize(vector) {
      vector.x = 150;
      vector.y = 150;
    }
  };
  var camera = {
    position: {
      add: function add() {},
      distanceTo: function distanceTo() {}
    }
  };
  var scene = {};
  var controls = {
    target: {
      copy: function copy() {
        return {
          add: function add() {}
        };
      },
      clone: function clone() {
        return {
          sub: function sub() {
            return {
              normalize: function normalize() {
                return {
                  multiplyScalar: function multiplyScalar() {}
                };
              }
            };
          }
        };
      }
    },
    stop: function stop() {}
  };
  test('call', function () {
    var selection = (0, _SelectionHelper.SelectionHelper)(renderer, scene, camera, controls);
    expect(selection).toBeDefined();
  });
  test('events', function () {
    var selection = (0, _SelectionHelper.SelectionHelper)(renderer, scene, camera, controls);
    mouseDown();
    mouseMove();
    mouseUp();
    selection.start();
    mouseMove({
      button: 0
    });
    mouseDown({
      button: 0
    });
    mouseMove({
      button: 0
    });
    mouseUp({});
  });
  test('element parentElement', function () {
    document.createElement = function () {
      return {
        style: {},
        parentElement: {
          removeChild: function removeChild() {}
        }
      };
    };

    var selection = (0, _SelectionHelper.SelectionHelper)(renderer, scene, camera, controls);
    selection.start();
    mouseDown({
      button: 0
    });
    mouseUp({});
  });
  test('raycaster', function () {
    global.MockRaycaster.intersectObjects = [{}];
    var selection = (0, _SelectionHelper.SelectionHelper)(renderer, scene, camera, controls);
    selection.start();
    mouseDown({
      button: 0
    });
    mouseUp({});
  });
  test('isEnabled', function () {
    var selection = (0, _SelectionHelper.SelectionHelper)(renderer, scene, camera, controls);
    expect(selection.isEnabled()).toBe(false);
  });
  test('dispose', function () {
    var selection = (0, _SelectionHelper.SelectionHelper)(renderer, scene, camera, controls);
    selection.dispose();
  });
});