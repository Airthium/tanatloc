var _classCallCheck = require("@babel/runtime/helpers/classCallCheck");

var _createClass = require("@babel/runtime/helpers/createClass");

if (typeof window !== 'undefined') {
  var ResizeObserver = /*#__PURE__*/function () {
    "use strict";

    function ResizeObserver() {
      _classCallCheck(this, ResizeObserver);
    }

    _createClass(ResizeObserver, [{
      key: "disconnect",
      value: function disconnect() {// mock method
      }
    }, {
      key: "observe",
      value: function observe() {// mock method
      }
    }, {
      key: "unobserve",
      value: function unobserve() {// mock method
      }
    }]);

    return ResizeObserver;
  }();

  window.ResizeObserver = ResizeObserver;
}