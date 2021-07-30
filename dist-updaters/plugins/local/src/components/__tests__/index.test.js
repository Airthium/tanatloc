"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@testing-library/react");

var _ = _interopRequireDefault(require(".."));

var __jsx = _react["default"].createElement;
describe('plugins/local/src/component', function () {
  var onSelect = jest.fn();
  beforeEach(function () {
    onSelect.mockReset();
  });
  test('render', function () {
    var _render = (0, _react2.render)(__jsx(_["default"], {
      onSelect: onSelect
    })),
        unmount = _render.unmount;

    unmount();
  });
  test('onClick', function () {
    var _render2 = (0, _react2.render)(__jsx(_["default"], {
      onSelect: onSelect
    })),
        unmount = _render2.unmount;

    _react2.fireEvent.click(_react2.screen.getByRole('button'));

    expect(onSelect).toHaveBeenCalledTimes(1);
    unmount();
  });
});