"use strict";

var _NavigationHelper = require("../NavigationHelper");

document.createElement = function () {
  return {
    getContext: function getContext() {
      return {
        fillRect: function fillRect() {},
        fillText: function fillText() {}
      };
    }
  };
};

document.addEventListener = function (type, callback) {
  callback({});
};

global.MockRaycaster.intersectObjects = [{
  object: {
    parent: {
      uuid: 'id',
      normal: {
        clone: function clone() {
          return {
            multiplyScalar: function multiplyScalar() {}
          };
        }
      },
      children: [{}, {
        material: {
          color: 'color'
        }
      }]
    }
  }
}];
describe('lib/three/helpers/NavigationHelper', function () {
  var renderer = {
    domElement: {
      addEventListener: function addEventListener(type, callback) {
        callback({
          target: {
            getBoundingClientRect: function getBoundingClientRect() {
              return {};
            }
          }
        });
        callback({
          clientX: 500,
          clientY: 500,
          target: {
            getBoundingClientRect: function getBoundingClientRect() {
              return {
                width: 150,
                height: 150,
                top: 0,
                left: 0
              };
            }
          }
        });
        callback({
          clientX: 75,
          clientY: 75,
          target: {
            getBoundingClientRect: function getBoundingClientRect() {
              return {
                width: 150,
                height: 150,
                top: 0,
                left: 0
              };
            }
          }
        });
        callback({
          clientX: 50,
          clientY: 50,
          target: {
            getBoundingClientRect: function getBoundingClientRect() {
              return {
                width: 150,
                height: 150,
                top: 0,
                left: 0
              };
            }
          }
        });
        callback({
          clientX: 25,
          clientY: 25,
          target: {
            getBoundingClientRect: function getBoundingClientRect() {
              return {
                width: 150,
                height: 150,
                top: 0,
                left: 0
              };
            }
          }
        });
      },
      removeEventListener: function removeEventListener() {}
    },
    getSize: function getSize(vector) {
      vector.x = 150;
      vector.y = 150;
    },
    setViewport: function setViewport() {},
    render: function render() {}
  };
  var scene = {
    boundingBox: {
      getCenter: function getCenter() {}
    }
  };
  var camera = {
    position: {
      copy: function copy() {
        return {
          multiplyScalar: function multiplyScalar() {}
        };
      },
      distanceTo: function distanceTo() {}
    },
    up: {
      copy: function copy() {}
    }
  };
  var controls = {};
  test('call', function () {
    var navigation = (0, _NavigationHelper.NavigationHelper)(renderer, scene, camera, controls);
    expect(navigation).toBeDefined();
  });
  test('event', function () {
    var navigation = (0, _NavigationHelper.NavigationHelper)(renderer, scene, camera, controls);
    expect(navigation).toBeDefined();
  });
  test('resize', function () {
    var navigation = (0, _NavigationHelper.NavigationHelper)(renderer, scene, camera, controls);
    navigation.resize({
      newOffsetWidth: 0,
      newOffsetHeight: 0,
      newWidth: 0,
      newHeight: 0
    });
  });
  test('render', function () {
    var navigation = (0, _NavigationHelper.NavigationHelper)(renderer, scene, camera, controls);
    navigation.render();
  });
  test('dispose', function () {
    global.MockGroup.children = [{
      children: [{
        geometry: {
          dispose: function dispose() {}
        },
        material: {
          dispose: function dispose() {}
        }
      }]
    }];
    var navigation = (0, _NavigationHelper.NavigationHelper)(renderer, scene, camera, controls);
    navigation.dispose();
  });
});