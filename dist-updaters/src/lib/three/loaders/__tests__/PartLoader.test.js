"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _PartLoader = require("../PartLoader");

jest.mock('three/examples/jsm/math/Lut', function () {
  var _temp;

  return {
    Lut: (_temp = function Lut() {
      (0, _classCallCheck2["default"])(this, Lut);
      (0, _defineProperty2["default"])(this, "setMin", function () {});
      (0, _defineProperty2["default"])(this, "setMax", function () {});
      (0, _defineProperty2["default"])(this, "getColor", function () {
        return {
          r: 0,
          g: 0,
          b: 0
        };
      });
    }, _temp)
  };
});
jest.mock('three/examples/jsm/loaders/GLTFLoader', function () {
  var _temp2;

  return {
    GLTFLoader: (_temp2 = function GLTFLoader() {
      (0, _classCallCheck2["default"])(this, GLTFLoader);
      (0, _defineProperty2["default"])(this, "setDRACOLoader", jest.fn());
      (0, _defineProperty2["default"])(this, "load", function (url, finish, progress, error) {
        progress('progress');
        error('error');
        finish({
          scene: {
            children: [{
              children: [{
                children: [{
                  geometry: {
                    boundingBox: {
                      min: {},
                      max: {}
                    },
                    dispose: jest.fn()
                  },
                  material: {
                    dispose: jest.fn()
                  },
                  userData: {
                    uuid: 'solid_uuid'
                  }
                }]
              }, {
                children: [{
                  geometry: {
                    boundingBox: {
                      min: {},
                      max: {}
                    },
                    dispose: jest.fn()
                  },
                  material: {
                    dispose: jest.fn()
                  },
                  userData: {
                    uuid: 'face_uuid'
                  }
                }]
              }]
            }]
          }
        });
      });
    }, _temp2)
  };
});
jest.mock('three/examples/jsm/loaders/DRACOLoader', function () {
  var _temp3;

  return {
    DRACOLoader: (_temp3 = function DRACOLoader() {
      (0, _classCallCheck2["default"])(this, DRACOLoader);
      (0, _defineProperty2["default"])(this, "setDecoderPath", jest.fn());
      (0, _defineProperty2["default"])(this, "preload", jest.fn());
    }, _temp3)
  };
});
describe('lib/three/loaders/PartLoader', function () {
  global.URL.createObjectURL = jest.fn();

  global.MockGeometry.getAttribute = function (attribute) {
    if (attribute === 'position') return {
      array: []
    };
  };

  global.MockGroup.children = [{
    children: [{
      uuid: 'solid_uuid',
      geometry: {
        dispose: function dispose() {},
        boundingBox: {
          min: {
            x: 0,
            y: 0,
            z: 0
          },
          max: {
            x: 1,
            y: 1,
            z: 1
          }
        }
      },
      material: {
        dispose: function dispose() {}
      }
    }]
  }, {
    children: [{
      uuid: 'face_uuid',
      geometry: {
        dispose: function dispose() {},
        boundingBox: {
          min: {
            x: 0,
            y: 0,
            z: 0
          },
          max: {
            x: 1,
            y: 1,
            z: 1
          }
        }
      },
      material: {
        dispose: function dispose() {}
      }
    }]
  }];
  var part = {
    buffer: Buffer.from([])
  };
  var mouseMove;
  var mouseDown;
  var renderer = {
    domElement: {
      addEventListener: function addEventListener(type, callback) {
        if (type === 'pointermove') mouseMove = callback;else if (type === 'pointerdown') mouseDown = callback;
      },
      removeEventListener: function removeEventListener() {}
    },
    getSize: function getSize() {}
  };
  var camera = {};
  var outlinePass = {};
  var mouseMoveEvent = jest.fn();
  var mouseDownEvent = jest.fn();
  test('call', function () {
    var partLoader = (0, _PartLoader.PartLoader)();
    expect(partLoader).toBeDefined();
  });
  test('load', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var partLoader;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            partLoader = (0, _PartLoader.PartLoader)();
            _context.next = 3;
            return partLoader.load(part);

          case 3:
            _context.next = 5;
            return partLoader.load(part, true);

          case 5:
            // With color
            global.MockGeometry.getAttribute = function () {
              return {
                count: 3,
                array: [0.1, 0.2, 0.3]
              };
            };

            _context.next = 8;
            return partLoader.load(part);

          case 8:
            // No type
            part.type = 'other';
            _context.next = 11;
            return partLoader.load(part);

          case 11:
            _context.next = 13;
            return partLoader.load(part, true);

          case 13:
            // Mesh
            part.type = 'mesh';
            _context.next = 16;
            return partLoader.load(part);

          case 16:
            _context.next = 18;
            return partLoader.load(part, true);

          case 18:
            // Result
            part.type = 'result';
            _context.next = 21;
            return partLoader.load(part);

          case 21:
            global.MockGeometry.getAttribute = function () {};

            _context.next = 24;
            return partLoader.load(part, true);

          case 24:
            global.MockGeometry.getAttribute = function () {
              return {
                count: 3,
                array: [0, 0, 0]
              };
            };

            _context.next = 27;
            return partLoader.load(part);

          case 27:
            global.MockGeometry.getAttribute = function () {
              return {
                count: 3,
                array: [1, 1, 1]
              };
            };

            _context.next = 30;
            return partLoader.load(part);

          case 30:
            global.MockBox3.isEmpty = true;
            _context.next = 33;
            return partLoader.load(part, true);

          case 33:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
  test('dispose', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var partLoader, mesh;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            partLoader = (0, _PartLoader.PartLoader)();
            _context2.next = 3;
            return partLoader.load(part);

          case 3:
            mesh = _context2.sent;
            mesh.dispose();

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })));
  test('setTransparent', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    var partLoader, mesh;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            partLoader = (0, _PartLoader.PartLoader)();
            _context3.next = 3;
            return partLoader.load(part);

          case 3:
            mesh = _context3.sent;
            mesh.setTransparent(true);
            mesh.setTransparent(false);

          case 6:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  })));
  test('startSelection', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
    var partLoader, mesh;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            partLoader = (0, _PartLoader.PartLoader)(mouseMoveEvent, mouseDownEvent);
            _context4.next = 3;
            return partLoader.load(part);

          case 3:
            mesh = _context4.sent;
            mesh.startSelection(renderer, camera, outlinePass, 'faces');
            mesh.startSelection(renderer, camera, outlinePass, 'solids');
            mesh.startSelection(renderer, camera, outlinePass, 'others');

          case 7:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  })));
  test('stopSelection', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
    var partLoader, mesh;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            partLoader = (0, _PartLoader.PartLoader)();
            _context5.next = 3;
            return partLoader.load(part);

          case 3:
            mesh = _context5.sent;
            mesh.stopSelection(); // Add selection

            mesh.startSelection(renderer, camera, outlinePass, 'faces');
            mesh.select('face_uuid');
            mesh.stopSelection();
            mesh.startSelection(renderer, camera, outlinePass, 'solids');
            mesh.select('solid_uuid');
            mesh.stopSelection();

          case 11:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  })));
  test('getHighlighted', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
    var partLoader, mesh, highlighted;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            partLoader = (0, _PartLoader.PartLoader)(mouseMoveEvent, mouseDownEvent);
            _context6.next = 3;
            return partLoader.load(part);

          case 3:
            mesh = _context6.sent;
            highlighted = mesh.getHighlighted();
            expect(highlighted).toBe(null);

          case 6:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  })));
  test('getSelected', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
    var partLoader, mesh, selected;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            partLoader = (0, _PartLoader.PartLoader)(mouseMoveEvent, mouseDownEvent);
            _context7.next = 3;
            return partLoader.load(part);

          case 3:
            mesh = _context7.sent;
            selected = mesh.getSelected();
            expect(selected).toEqual([]);

          case 6:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  })));
  test('mouseMove', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8() {
    var current, partLoader, mesh;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            mouseMoveEvent.mockImplementation(function (p, uuid) {
              return current = uuid;
            });
            partLoader = (0, _PartLoader.PartLoader)(mouseMoveEvent, mouseDownEvent);
            _context8.next = 4;
            return partLoader.load(part);

          case 4:
            mesh = _context8.sent;
            mesh.startSelection(renderer, camera, outlinePass, 'faces');
            mouseMove({
              target: {
                getBoundingClientRect: function getBoundingClientRect() {
                  return {};
                }
              }
            });
            global.MockRaycaster.intersectObjects = [{
              object: {
                userData: {
                  uuid: 'uuid'
                }
              }
            }];
            mouseMove({
              target: {
                getBoundingClientRect: function getBoundingClientRect() {
                  return {};
                }
              }
            });
            expect(current).toBe('uuid');

          case 10:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  })));
  test('highlight', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
    var partLoader, mesh;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            partLoader = (0, _PartLoader.PartLoader)();
            _context9.next = 3;
            return partLoader.load(part);

          case 3:
            mesh = _context9.sent;
            mesh.startSelection(renderer, camera, outlinePass, 'faces');
            mesh.highlight('face_uuid');
            mesh.highlight('face_uuid');
            mesh.highlight('uuid');

          case 8:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  })));
  test('unhighlight', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10() {
    var partLoader, mesh;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            partLoader = (0, _PartLoader.PartLoader)();
            _context10.next = 3;
            return partLoader.load(part);

          case 3:
            mesh = _context10.sent;
            mesh.startSelection(renderer, camera, outlinePass, 'faces');
            mesh.unhighlight(); // With selected

            mesh.select('face_uuid');
            mesh.highlight('face_uuid');
            mesh.unhighlight();

          case 9:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  })));
  test('mouseDown', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11() {
    var current, partLoader, mesh;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            mouseDownEvent.mockImplementation(function (p, uuid) {
              return current = uuid;
            });
            partLoader = (0, _PartLoader.PartLoader)(mouseMoveEvent, mouseDownEvent);
            _context11.next = 4;
            return partLoader.load(part);

          case 4:
            mesh = _context11.sent;
            mesh.startSelection(renderer, camera, outlinePass, 'faces');
            mouseDown();
            expect(mouseDownEvent).toHaveBeenCalledTimes(0);
            mesh.highlight('face_uuid');
            mouseDown();
            expect(mouseDownEvent).toHaveBeenCalledTimes(1);
            expect(current).toBe('face_uuid');

          case 12:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  })));
  test('select', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12() {
    var partLoader, mesh;
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            partLoader = (0, _PartLoader.PartLoader)();
            _context12.next = 3;
            return partLoader.load(part);

          case 3:
            mesh = _context12.sent;
            mesh.startSelection(renderer, camera, outlinePass, 'faces');
            mesh.select('face_uuid');
            mesh.select('uuid');
            expect(mesh.getSelected()).toEqual(['face_uuid']);

          case 8:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12);
  })));
  test('unselect', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13() {
    var partLoader, mesh;
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            partLoader = (0, _PartLoader.PartLoader)();
            _context13.next = 3;
            return partLoader.load(part);

          case 3:
            mesh = _context13.sent;
            mesh.startSelection(renderer, camera, outlinePass, 'faces');
            mesh.select('face_uuid');
            mesh.unselect('uuid');
            mesh.unselect('face_uuid');

          case 8:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  })));
  test('result specific', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14() {
    var partLoader, mesh;
    return _regenerator["default"].wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            part.type = 'result';
            part.solids = [];
            global.MockGroup.children = [{
              children: []
            }, {
              children: [{
                type: 'Group',
                boundingBox: {
                  min: {
                    x: 0,
                    y: 0,
                    z: 0
                  },
                  max: {
                    x: 1,
                    y: 1,
                    z: 1
                  }
                },
                children: [{
                  uuid: 'face_uuid',
                  geometry: {
                    dispose: function dispose() {}
                  },
                  material: {
                    dispose: function dispose() {}
                  }
                }, {}]
              }]
            }];
            partLoader = (0, _PartLoader.PartLoader)();
            _context14.next = 6;
            return partLoader.load(part);

          case 6:
            mesh = _context14.sent;
            mesh.setTransparent(true);
            mesh.setTransparent(false);
            mesh.dispose();

          case 10:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14);
  })));
});