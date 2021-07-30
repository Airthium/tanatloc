"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PartLoader = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _three = require("three");

var _GLTFLoader = require("three/examples/jsm/loaders/GLTFLoader");

var _DRACOLoader = require("three/examples/jsm/loaders/DRACOLoader");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// TODO edges not supported for now

/**
 * PartLoader
 * @param {Function} mouseMoveEvent Mouse move event
 * @param {Function} mouseDownEvent Mouse down event
 */
var PartLoader = function PartLoader(mouseMoveEvent, mouseDownEvent) {
  // Highlight color
  var highlightColor = new _three.Color('#0096C7'); // Select colo

  var selectColor = new _three.Color('#c73100');
  /**
   * Load
   * @param {Object} part Part
   * @param {boolean} transparent Transparent
   * @param {Object} clippingPlane Clipping plane
   */

  var load = /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(part, transparent, clippingPlane) {
      var blob, url, loader, dracoLoader, gltf, object, solids, _iterator, _step, solid, faces, _iterator2, _step2, face;

      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              // TODO bug with GLB format: JSON content not found
              blob = new Blob([Buffer.from(part.buffer)]);
              url = URL.createObjectURL(blob);
              loader = new _GLTFLoader.GLTFLoader();
              dracoLoader = new _DRACOLoader.DRACOLoader();
              dracoLoader.setDecoderPath('/three/libs/draco/');
              dracoLoader.preload();
              loader.setDRACOLoader(dracoLoader);
              _context.next = 9;
              return new Promise(function (resolve, reject) {
                loader.load(url, function (glb) {
                  return resolve(glb);
                }, function (progress) {
                  return console.info(progress);
                }, function (err) {
                  return console.error(err);
                });
              });

            case 9:
              gltf = _context.sent;
              object = gltf.scene.children[0];
              object.type = 'Part';
              object.uuid = part.uuid; // Set original colors

              solids = object.children[0];
              _iterator = _createForOfIteratorHelper(solids.children);

              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  solid = _step.value;
                  solid.material.originalColor = solid.material.color;
                  solid.material.clippingPlanes = [clippingPlane];
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }

              faces = object.children[1];
              _iterator2 = _createForOfIteratorHelper(faces.children);

              try {
                for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                  face = _step2.value;
                  face.material.originalColor = face.material.color;
                  face.material.clippingPlanes = [clippingPlane];
                } // Transparency

              } catch (err) {
                _iterator2.e(err);
              } finally {
                _iterator2.f();
              }

              setTransparent(object, transparent);
              object.boundingBox = computeBoundingBox(object);

              object.dispose = function () {
                return dispose(object);
              };

              object.setTransparent = function (transp) {
                return setTransparent(object, transp);
              };

              object.startSelection = function (renderer, camera, outlinePass, type) {
                return startSelection(object, renderer, camera, outlinePass, type);
              };

              object.stopSelection = function () {
                return stopSelection(object);
              };

              object.getHighlighted = function () {
                return highlighted;
              };

              object.getSelected = function () {
                return selected;
              };

              object.highlight = highlight;
              object.unhighlight = unhighlight;
              object.select = select;
              object.unselect = unselect;
              return _context.abrupt("return", object);

            case 32:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function load(_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }();
  /**
   * Compute bounding box
   * @param {Object} part Part
   */


  var computeBoundingBox = function computeBoundingBox(part) {
    var box = new _three.Box3(); // Solids

    var solids = part.children[0];
    solids.children && solids.children.forEach(function (solid) {
      var childBox = solid.geometry.boundingBox;
      mergeBox(box, childBox);
    });

    if (box.isEmpty()) {
      // Try faces
      var faces = part.children[1];
      faces.children && faces.children.forEach(function (face) {
        var childBox;
        childBox = face.geometry.boundingBox;
        mergeBox(box, childBox);
      });
    }

    return box;
  };
  /**
   * Merge boxes
   * @param {Object} box1 Box
   * @param {Object} box2 Box
   */


  var mergeBox = function mergeBox(box1, box2) {
    var min = new _three.Vector3(Math.min(box1.min.x, box2.min.x), Math.min(box1.min.y, box2.min.y), Math.min(box1.min.z, box2.min.z));
    var max = new _three.Vector3(Math.max(box1.max.x, box2.max.x), Math.max(box1.max.y, box2.max.y), Math.max(box1.max.z, box2.max.z));
    box1.set(min, max);
  };
  /**
   * Dispose
   * @param {Object} part Part
   */


  var dispose = function dispose(part) {
    part.children.forEach(function (group) {
      group.children.forEach(function (child) {
        child.geometry.dispose();
        child.material.dispose();
      });
    });
  };
  /**
   * Set transparent
   * @param {Object} part Part
   * @param {boolean} transparent Transparent
   */


  var setTransparent = function setTransparent(part, transparent) {
    part.children.forEach(function (group) {
      group.children && group.children.forEach(function (child) {
        child.material.transparent = transparent;
        child.material.opacity = transparent ? 0.5 : 1;
        child.material.depthWrite = !transparent;
      });
    });
  };
  /**
   * Set solids visible
   * @param {Object} part Part
   * @param {boolean} visible Visible
   */


  var setSolidsVisible = function setSolidsVisible(part, visible) {
    part.children[0].children.forEach(function (solid) {
      solid.visible = visible;
    });
  };
  /**
   * Set faces visible
   * @param {Object} part Part
   * @param {boolean} visible Visible
   */


  var setFacesVisible = function setFacesVisible(part, visible) {
    part.children[1].children.forEach(function (face) {
      face.visible = visible;
    });
  }; // highlight / selection Variables


  var raycaster = new _three.Raycaster();
  var selectionPart = null;
  var selectionRenderer = null;
  var selectionCamera = null;
  var selectionOutlinePass = null;
  var selectionType = null;
  var highlighted = null;
  var selected = [];
  /**
   *
   * @param {Object} part Part
   * @param {Object} renderer Renderer
   * @param {Object} camera Camera
   * @param {Object} outlinePass OutlinePass
   * @param {string} type Type (solid, face)
   */

  var startSelection = function startSelection(part, renderer, camera, outlinePass, type) {
    selectionPart = part;
    selectionRenderer = renderer;
    selectionCamera = camera;
    selectionOutlinePass = outlinePass;
    highlighted = null;
    selected.length = 0;

    if (type === 'solids') {
      setSolidsVisible(part, true);
      setFacesVisible(part, false);
      selectionType = 0;
    } else if (type === 'faces') {
      setSolidsVisible(part, false);
      setFacesVisible(part, true);
      selectionType = 1;
    }

    selectionRenderer.domElement.addEventListener('pointermove', mouseMove);
    selectionRenderer.domElement.addEventListener('pointerdown', mouseDown);
  };
  /**
   * Stop selection
   * @param {Object} part Part
   */


  var stopSelection = function stopSelection(part) {
    selectionRenderer && selectionRenderer.domElement.removeEventListener('pointermove', mouseMove);
    selectionRenderer && selectionRenderer.domElement.removeEventListener('pointerdown', mouseDown);
    selectionType = null;
    setSolidsVisible(part, false);
    setFacesVisible(part, true);
    unhighlight();
    highlighted = null;
    selected.forEach(function (s) {
      unselect(s);
    });
    selected.length = 0;
    selectionPart = null;
    selectionRenderer = null;
    selectionCamera = null;
    selectionOutlinePass = null;
  };
  /**
   * Find object in part
   * @param {Object} part Part
   * @param {string} uuid UUID
   */


  var findObject = function findObject(part, uuid) {
    if (!part) return; // Search in solids

    var solids = part.children[0];

    var _iterator3 = _createForOfIteratorHelper(solids.children),
        _step3;

    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var solid = _step3.value;
        if (solid.userData.uuid === uuid) return solid;
      } // Search in faces

    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }

    var faces = part.children[1];

    var _iterator4 = _createForOfIteratorHelper(faces.children),
        _step4;

    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var face = _step4.value;
        if (face.userData.uuid === uuid) return face;
      } // Search in edges
      // TODO

    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
  };
  /**
   *  Global coordinates to local [-1, 1]^2
   * @param {Object} event Event
   */


  var globalToLocal = function globalToLocal(event) {
    var rect = event.target.getBoundingClientRect();
    var X = event.clientX - rect.left;
    var Y = event.clientY - rect.top;
    var mouse = new _three.Vector2();
    mouse.x = X / rect.width * 2 - 1;
    mouse.y = -(Y / rect.height) * 2 + 1;
    return mouse;
  };
  /**
   * Mouse move
   * @param {Object} event Event
   */


  var mouseMove = function mouseMove(event) {
    var mouse = globalToLocal(event);
    raycaster.setFromCamera(mouse, selectionCamera);
    var intersects = raycaster.intersectObjects(selectionPart.children[selectionType].children);
    if (intersects.length) mouseMoveEvent(selectionPart, intersects[0].object.userData.uuid);else mouseMoveEvent(selectionPart);
  };
  /**
   * Highlight
   * @param {Object} uuid Mesh uuid
   */


  var highlight = function highlight(uuid) {
    if (uuid === highlighted) return;else unhighlight();
    var mesh = findObject(selectionPart, uuid);

    if (mesh && mesh.material) {
      highlighted = mesh.userData.uuid;
      selectionOutlinePass.selectedObjects = [mesh];
      mesh.material.color = highlightColor;
    }
  };
  /**
   * Unhighlight
   */


  var unhighlight = function unhighlight() {
    var mesh = findObject(selectionPart, highlighted);

    if (mesh && mesh.material) {
      selectionOutlinePass.selectedObjects = []; // Check selection

      var index = selected.findIndex(function (m) {
        return m === mesh.userData.uuid;
      }); // Unhighlight

      mesh.material.color = index === -1 ? mesh.material.originalColor : selectColor;
    }

    highlighted = null;
  };
  /**
   * Mouse down
   */


  var mouseDown = function mouseDown() {
    if (highlighted) mouseDownEvent(selectionPart, highlighted);
  };
  /**
   * Select
   * @param {Object} uuid Mesh uuid
   */


  var select = function select(uuid) {
    var mesh = findObject(selectionPart, uuid);

    if (mesh && mesh.material) {
      selected.push(uuid);
      mesh.material.color = selectColor;
    }
  };
  /**
   * Unselect
   * @param {Object} uuid Mesh uuid
   */


  var unselect = function unselect(uuid) {
    var mesh = findObject(selectionPart, uuid);

    if (mesh && mesh.material) {
      mesh.material.color = mesh.material.originalColor;
    }

    var index = selected.findIndex(function (s) {
      return s === uuid;
    });
    if (index !== -1) selected = [].concat((0, _toConsumableArray2["default"])(selected.slice(0, index)), (0, _toConsumableArray2["default"])(selected.slice(index + 1)));
  };

  return {
    load: load
  };
};

exports.PartLoader = PartLoader;