"use strict";

var _AxisHelper = require("../AxisHelper");

jest.mock("../ArrowHelper", function () {
  return function () {
    return {
      rotateX: function rotateX() {},
      rotateZ: function rotateZ() {}
    };
  };
});
jest.mock("../LabelHelper", function () {
  return function () {
    return {
      scale: {
        setScalar: function setScalar() {}
      },
      position: {
        set: function set() {}
      }
    };
  };
});
describe('lib/three/helpers/AxisHelper', function () {
  var renderer = {
    setViewport: function setViewport() {},
    render: function render() {}
  };
  var camera = {};
  test('call', function () {
    var axis = (0, _AxisHelper.AxisHelper)();
    expect(axis).toBeDefined();
  });
  test('resize', function () {
    var axis = (0, _AxisHelper.AxisHelper)();
    axis.resize({
      newOffsetWidth: 0,
      newOffsetHeight: 0,
      width: 0,
      height: 0
    });
  });
  test('render', function () {
    var axis = (0, _AxisHelper.AxisHelper)(renderer, camera);
    axis.render();
  });
  test('dispose', function () {
    global.MockGroup.children = [{}, {
      type: 'ArrowHelper',
      dispose: function dispose() {}
    }];
    var axis = (0, _AxisHelper.AxisHelper)(renderer, camera);
    axis.dispose();
  });
});