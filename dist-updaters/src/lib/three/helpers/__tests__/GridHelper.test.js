"use strict";

var _GridHelper = require("../GridHelper");

jest.mock("../LabelHelper", function () {
  return function () {
    return {
      translateX: function translateX() {},
      translateY: function translateY() {},
      scale: {
        setScalar: function setScalar() {}
      }
    };
  };
});
global.MockVector3 = {
  x: 1e5,
  y: 3,
  z: 1e-13
};
describe('lib/three/helpers/GridHelper', function () {
  var scene = {
    children: [{
      type: 'Mesh'
    }, {
      type: 'GridHelper',
      dispose: function dispose() {}
    }],
    boundingBox: {
      min: {
        x: -1e-5,
        y: -3,
        z: -1e-13
      },
      max: {
        x: 1,
        y: 1,
        z: 1
      }
    },
    boundingSphere: {
      center: {}
    },
    add: function add() {},
    remove: function remove() {}
  };
  test('call', function () {
    var grid = (0, _GridHelper.GridHelper)(scene);
    expect(grid).toBeDefined();
  });
  test('update', function () {
    var grid = (0, _GridHelper.GridHelper)(scene);
    grid.update();
  });
  test('setVisible', function () {
    var grid = (0, _GridHelper.GridHelper)(scene);
    grid.update();
    grid.setVisible(true);
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
    var grid = (0, _GridHelper.GridHelper)(scene);
    grid.update();
    grid.dispose();
  });
});