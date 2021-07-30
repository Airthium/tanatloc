"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _react = require("@testing-library/react");

var _ = _interopRequireDefault(require("../"));

describe('lib/utils', function () {
  test('stringToColor', function () {
    var color; // Empty

    color = _["default"].stringToColor();
    expect(color).toBe('#FFFFFF'); // With string

    color = _["default"].stringToColor('string');
    expect(color).toBe('#D56011');
  });
  test('rgbToHex', function () {
    var hex = _["default"].rgbToHex({
      r: 0,
      g: 1,
      b: 1
    });

    expect(hex).toBe('#00ffff');
  });
  test('rgbToRgba', function () {
    var rgba = _["default"].rgbToRgba({
      r: 0,
      g: 1,
      b: 1
    }, 0.1);

    expect(rgba).toBe('rgba(0, 255, 255, 0.1)');
    rgba = _["default"].rgbToRgba();
    expect(rgba).toBe('rgba(255, 255, 255, 0)');
  });
  test('userToAvatar', function () {
    var res; // Empty

    res = _["default"].userToAvatar({});
    {
      var _render = (0, _react.render)(res),
          unmount = _render.unmount;

      unmount();
    } // With avatar & email

    res = _["default"].userToAvatar({
      avatar: {
        type: 'Buffer',
        data: ['data']
      },
      email: 'email'
    });
    {
      var _render2 = (0, _react.render)(res),
          _unmount = _render2.unmount;

      expect(_react.screen.getByRole('img'));

      _unmount();
    } // With firstname & lastname

    res = _["default"].userToAvatar({
      email: 'email',
      firstname: 'firstname',
      lastname: 'lastname'
    });
    {
      var _render3 = (0, _react.render)(res),
          _unmount2 = _render3.unmount;

      expect(_react.screen.getByText('FL'));

      _unmount2();
    }
  });
  test('groupToAvatar', function () {
    var res; // Empty

    res = _["default"].groupToAvatar({});
    {
      var _render4 = (0, _react.render)(res),
          unmount = _render4.unmount;

      unmount();
    } // With name

    res = _["default"].groupToAvatar({
      name: 'name'
    });
    {
      var _render5 = (0, _react.render)(res),
          _unmount3 = _render5.unmount;

      expect(_react.screen.getByText('N'));

      _unmount3();
    }
  });
});