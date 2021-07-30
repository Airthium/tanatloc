"use strict";

var _ColorbarHelper = require("../ColorbarHelper");

jest.mock("../LabelHelper", function () {
  return function () {
    return {
      scale: {},
      position: {
        set: jest.fn()
      }
    };
  };
});
describe('lib/three/helpers/ColorbarHelper', function () {
  var renderer = {
    domElement: {
      getBoundingClientRect: function getBoundingClientRect() {
        return {};
      }
    },
    setViewport: jest.fn(),
    render: jest.fn()
  };
  var scene = {};
  global.MockScene.children = [{
    dispose: jest.fn()
  }];
  test('call', function () {
    var colorbarHelper = (0, _ColorbarHelper.ColorbarHelper)(renderer, scene);
    expect(colorbarHelper).toBeDefined();
  });
  test('setVisible', function () {
    var colorbarHelper = (0, _ColorbarHelper.ColorbarHelper)(renderer, scene);
    colorbarHelper.setVisible(true);
  });
  test('setLUT', function () {
    var colorbarHelper = (0, _ColorbarHelper.ColorbarHelper)(renderer, scene);
    colorbarHelper.setLUT({
      createCanvas: jest.fn(),
      minV: 1,
      maxV: 1
    });
    colorbarHelper.setLUT({
      createCanvas: jest.fn(),
      minV: 1e-5,
      maxV: 1e-5
    });
    colorbarHelper.setLUT({
      createCanvas: jest.fn(),
      minV: 0,
      maxV: 0
    });
  });
  test('render', function () {
    var colorbarHelper = (0, _ColorbarHelper.ColorbarHelper)(renderer, scene);
    colorbarHelper.render();
  });
});