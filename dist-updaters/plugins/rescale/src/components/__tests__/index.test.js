"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@testing-library/react");

var _ = _interopRequireDefault(require(".."));

var __jsx = _react["default"].createElement;
var mockError = jest.fn();
jest.mock("../../../../../src/components/assets/notification", function () {
  return {
    Error: function Error() {
      return mockError();
    }
  };
});
describe('plugins/rescale/src/components/index', function () {
  var data = {
    coreTypes: [{
      name: 'coretype 1',
      cores: [1, 2, 4],
      memory: 5000,
      price: 5000,
      lowPriorityPrice: 1000
    }, {
      name: 'coretype 2',
      cores: [500],
      memory: 10000,
      price: 10000,
      lowPriorityPrice: 2000
    }],
    freefem: {
      versions: [{
        id: 'version1',
        version: 'version1'
      }, {
        id: 'version2',
        version: 'version2'
      }]
    }
  };
  var onSelect = jest.fn();
  beforeEach(function () {
    mockError.mockReset();
    onSelect.mockReset();
  });
  test('render', function () {
    var _render = (0, _react2.render)(__jsx(_["default"], {
      data: data,
      onSelect: onSelect
    })),
        unmount = _render.unmount;

    unmount();
  });
  test('rowSelection', function () {
    var _render2 = (0, _react2.render)(__jsx(_["default"], {
      data: data,
      onSelect: onSelect
    })),
        unmount = _render2.unmount; // Set visible


    _react2.fireEvent.click(_react2.screen.getByRole('button'));

    var radios = _react2.screen.getAllByRole('radio');

    _react2.fireEvent.click(radios[0]);

    _react2.fireEvent.click(radios[1]);

    unmount();
  });
  test('onOk', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var _render3, unmount, radios, next, numberOfCores, combobox, ok;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _render3 = (0, _react2.render)(__jsx(_["default"], {
              data: data,
              onSelect: onSelect
            })), unmount = _render3.unmount; // Set visible

            _react2.fireEvent.click(_react2.screen.getByRole('button')); // Select one


            radios = _react2.screen.getAllByRole('radio');

            _react2.fireEvent.click(radios[1]); // Step 1 -> 2


            next = _react2.screen.getByRole('button', {
              name: 'Next'
            });

            _react2.fireEvent.click(next); // Fill form


            radios = _react2.screen.getAllByRole('radio');

            _react2.fireEvent.click(radios[0]);

            numberOfCores = _react2.screen.getByRole('spinbutton');

            _react2.fireEvent.input(numberOfCores, {
              target: {
                value: 1
              }
            });

            _react2.fireEvent.input(numberOfCores, {
              target: {
                value: 501
              }
            });

            _react2.fireEvent.input(numberOfCores, {
              target: {
                value: 1001
              }
            });

            _react2.fireEvent.input(numberOfCores, {
              target: {
                value: 999
              }
            });

            _react2.fireEvent.input(numberOfCores, {
              target: {
                value: 499
              }
            });

            combobox = _react2.screen.getByRole('combobox');

            _react2.fireEvent.change(combobox, {
              target: {
                value: 'version1'
              }
            }); // Step 2 -> end


            ok = _react2.screen.getByRole('button', {
              name: 'Ok'
            });

            _react2.fireEvent.click(ok);

            _context.next = 20;
            return (0, _react2.waitFor)(function () {
              return expect(onSelect).toHaveBeenCalledTimes(1);
            });

          case 20:
            unmount();

          case 21:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
  test('onOk error', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var _render4, unmount, radios, next, increase, decrease, combobox, ok;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _render4 = (0, _react2.render)(__jsx(_["default"], {
              data: data,
              onSelect: onSelect
            })), unmount = _render4.unmount; // Set visible

            _react2.fireEvent.click(_react2.screen.getByRole('button')); // Select one


            radios = _react2.screen.getAllByRole('radio');

            _react2.fireEvent.click(radios[0]); // Step 1 -> 2


            next = _react2.screen.getByRole('button', {
              name: 'Next'
            });

            _react2.fireEvent.click(next); // Fill form


            radios = _react2.screen.getAllByRole('radio');

            _react2.fireEvent.click(radios[0]);

            increase = _react2.screen.getByRole('button', {
              name: 'Increase Value'
            });
            decrease = _react2.screen.getByRole('button', {
              name: 'Decrease Value'
            });

            _react2.fireEvent.mouseDown(increase);

            _react2.fireEvent.mouseDown(decrease);

            combobox = _react2.screen.getByRole('combobox');

            _react2.fireEvent.change(combobox, {
              target: {
                value: 'version1'
              }
            }); // Step 2 -> end


            onSelect.mockImplementation(function () {
              throw new Error();
            });
            ok = _react2.screen.getByRole('button', {
              name: 'Ok'
            });

            _react2.fireEvent.click(ok);

            _context2.next = 19;
            return (0, _react2.waitFor)(function () {
              return expect(onSelect).toHaveBeenCalledTimes(1);
            });

          case 19:
            _context2.next = 21;
            return (0, _react2.waitFor)(function () {
              return expect(mockError).toHaveBeenCalledTimes(1);
            });

          case 21:
            unmount();

          case 22:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })));
  test('onCancel', function () {
    var _render5 = (0, _react2.render)(__jsx(_["default"], {
      data: data,
      onSelect: onSelect
    })),
        unmount = _render5.unmount; // Set visible


    _react2.fireEvent.click(_react2.screen.getByRole('button')); // Step 1


    var buttons = _react2.screen.getAllByRole('button');

    _react2.fireEvent.click(buttons[2]);

    unmount();
  });
});