"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _space = _interopRequireDefault(require("antd/lib/space"));

var _button = _interopRequireDefault(require("antd/lib/button"));

var _typography = _interopRequireDefault(require("antd/lib/typography"));

var _icons = require("@ant-design/icons");

var __jsx = _react["default"].createElement;

var Local = function Local(_ref) {
  var onSelect = _ref.onSelect;

  var onClick = function onClick() {
    onSelect();
  };

  return __jsx(_space["default"], {
    style: {
      width: '100%'
    }
  }, __jsx(_typography["default"].Text, null, "Local computing"), __jsx(_button["default"], {
    onClick: onClick,
    icon: __jsx(_icons.SelectOutlined, null)
  }));
};

var _default = Local;
exports["default"] = _default;