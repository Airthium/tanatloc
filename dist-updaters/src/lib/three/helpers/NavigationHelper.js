"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NavigationHelper = void 0;

var _three = require("three");

/** @module lib/three/helpers/NavigationHelper */

/**
 * Navigation helper
 * @param {Object} renderer Renderer
 * @param {Object} scene Scene
 * @param {Object} camera Camera
 * @param {Object} controls Controls
 * @param {Object} dimensions Dimensions
 */
var NavigationHelper = function NavigationHelper(renderer, scene, camera, controls) {
  var _ref = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {
    offsetWidth: 0,
    offsetHeight: 0,
    width: 150,
    height: 150
  },
      offsetWidth = _ref.offsetWidth,
      offsetHeight = _ref.offsetHeight,
      width = _ref.width,
      height = _ref.height;

  // Cube color
  var cubeColor = '#d3d3d3'; // Edge color

  var edgeColor = '#ffffff'; // Text color

  var textColor = '#000000'; // Highlight color

  var highlightColor = '#0096C7'; // Cube size

  var size = 100; // Cube corner

  var corner = 0.25; // Highlight variable

  var currentlyHighlighted = 0; // Unhighlight variable

  var previouslyHighlighted = 0; // Faces

  var faces = [{
    text: 'FRONT',
    normal: new _three.Vector3(0, 0, 1),
    up: new _three.Vector3(0, 1, 0)
  }, {
    text: 'BACK',
    normal: new _three.Vector3(0, 0, -1),
    up: new _three.Vector3(0, 1, 0)
  }, {
    text: 'RIGHT',
    normal: new _three.Vector3(1, 0, 0),
    up: new _three.Vector3(0, 1, 0)
  }, {
    text: 'LEFT',
    normal: new _three.Vector3(-1, 0, 0),
    up: new _three.Vector3(0, 1, 0)
  }, {
    text: 'UP',
    normal: new _three.Vector3(0, 1, 0),
    up: new _three.Vector3(0, 0, -1)
  }, {
    text: 'DOWN',
    normal: new _three.Vector3(0, -1, 0),
    up: new _three.Vector3(0, 0, 1)
  }]; // Face geometry

  var faceGeometry = new _three.PlaneGeometry(size * (1 - corner), size * (1 - corner)); // Edge geometry

  var edgeGeometry = new _three.EdgesGeometry(faceGeometry); // Hemisphere geometry

  var hemisphereGeometry = new _three.SphereGeometry(size * (1 - corner) / 2, 10, 10, 0, Math.PI, 0); // Cube

  var cube = new _three.Group();
  faces.forEach(function (face) {
    // Canvas
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    canvas.width = canvas.height = 256;
    context.fillStyle = cubeColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = 'bold 50pt sans-serif';
    context.fillStyle = textColor;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(face.text, canvas.width / 2, canvas.height / 2); // Mesh

    var texture = new _three.CanvasTexture(canvas);
    texture.needUpdate = true; // Material

    var frontMaterial = new _three.MeshBasicMaterial({
      map: texture
    });
    var backMaterial = new _three.MeshBasicMaterial({
      color: cubeColor
    }); // Mesh

    var frontMesh = new _three.Mesh(faceGeometry, frontMaterial);
    var backMesh = new _three.Mesh(faceGeometry, backMaterial);
    backMesh.rotateY(Math.PI); // Edge

    var edgeMaterial = new _three.LineBasicMaterial({
      color: edgeColor
    });
    var edgeMesh = new _three.LineSegments(edgeGeometry, edgeMaterial); // Hemisphere

    var hemisphereMaterial = new _three.MeshBasicMaterial({
      color: cubeColor,
      transparent: true,
      opacity: 0.2
    });
    var hemisphereMesh = new _three.Mesh(hemisphereGeometry, hemisphereMaterial); // Group

    var faceGroup = new _three.Group();
    faceGroup.add(frontMesh, backMesh, edgeMesh, hemisphereMesh); // Orientation

    faceGroup.lookAt(face.normal);
    faceGroup.translateZ(size / 2);
    faceGroup.normal = face.normal;
    faceGroup.up = face.up; // Add

    cube.add(faceGroup);
  }); // Scene

  var localScene = new _three.Scene();
  localScene.add(cube); // Camera

  var localCamera = new _three.OrthographicCamera(-size, size, size, -size, -size, size);
  localCamera.position.z = 2; // Raycatser

  var raycaster = new _three.Raycaster();
  /**
   * On mouse move
   * @param {Object} event Event
   */

  var onMouseMove = function onMouseMove(event) {
    var mouse = globalToLocal(event);

    if (isIn(mouse)) {
      currentlyHighlighted = intersect(mouse);
      highlight();

      if (currentlyHighlighted.uuid !== previouslyHighlighted.uuid) {
        unhighlight();
        previouslyHighlighted = currentlyHighlighted;
      }
    } else {
      currentlyHighlighted = 0;
      unhighlight();
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
    mouse.x = (X - offsetWidth) / width * 2 - 1;
    mouse.y = -((Y + height - rect.height + offsetHeight) / height) * 2 + 1;
    return mouse;
  };
  /**
   * Check if mouse is in the viewport
   * @param {Object} mouse Mouse
   */


  var isIn = function isIn(mouse) {
    if (mouse.x > -1 && mouse.x < 1 && mouse.y > -1 && mouse.y < 1) return true;
    return false;
  };
  /**
   * Intersect
   * @param {Object} mouse Mouse
   */


  var intersect = function intersect(mouse) {
    var mouseCoords = new _three.Vector3(mouse.x, mouse.y, -1);
    mouseCoords.unproject(localCamera);
    var cameraDir = new _three.Vector3();
    localCamera.getWorldDirection(cameraDir);
    raycaster.set(mouseCoords, cameraDir);
    var intersects = raycaster.intersectObjects(localScene.children, true);
    return intersects.length && intersects[0].object.parent;
  };
  /**
   * Highlight
   */


  var highlight = function highlight() {
    currentlyHighlighted && currentlyHighlighted.children && currentlyHighlighted.children.forEach(function (object) {
      if (object.material && object.material.color) {
        object.material.previousColor = object.material.color;
        object.material.color = new _three.Color(highlightColor);
      }
    });
  };
  /**
   * Unhighlight
   */


  var unhighlight = function unhighlight() {
    previouslyHighlighted && previouslyHighlighted.children && previouslyHighlighted.children.forEach(function (object) {
      if (object.material && object.material.color) {
        object.material.color = new _three.Color(cubeColor);
      }
    });
  };
  /**
   * On mouse down
   * @param {Object} event Event
   */


  var onMouseDown = function onMouseDown(event) {
    if (currentlyHighlighted) {
      var normal = currentlyHighlighted.normal;
      var up = currentlyHighlighted.up; // Scene

      var center = new _three.Vector3();
      scene.boundingBox && scene.boundingBox.getCenter(center); // Camera

      var distance = camera.position.distanceTo(controls.target);
      var interval = normal.clone().multiplyScalar(distance);
      var newPosition = center.add(interval);
      camera.position.copy(newPosition);
      camera.up.copy(up); // Unhighlight

      currentlyHighlighted = 0;
      unhighlight(); // Mouse move

      onMouseMove(event);
    }
  }; // Events


  renderer.domElement.addEventListener('pointermove', onMouseMove);
  renderer.domElement.addEventListener('pointerdown', onMouseDown);
  /**
   * Resize
   * @param {Object} dimensions Dimensions
   */

  var resize = function resize(_ref2) {
    var newOffsetWidth = _ref2.newOffsetWidth,
        newOffsetHeight = _ref2.newOffsetHeight,
        newWidth = _ref2.newWidth,
        newHeight = _ref2.newHeight;
    offsetWidth = newOffsetWidth;
    offsetHeight = newOffsetHeight;
    width = newWidth;
    height = newHeight;
  };
  /**
   * Render
   */


  var render = function render() {
    renderer.setViewport(offsetWidth, offsetHeight, width, height);
    localCamera.rotation.copy(camera.rotation);
    renderer.render(localScene, localCamera);
  };
  /**
   * Dispose
   */


  var dispose = function dispose() {
    // Event listeners
    renderer.domElement.removeEventListener('pointermove', onMouseMove);
    renderer.domElement.removeEventListener('pointerdown', onMouseDown); // Cube

    cube.children.forEach(function (group) {
      group.children.forEach(function (child) {
        child.geometry.dispose();
        child.material.dispose();
      });
    }); // Scene

    localScene.remove(cube);
  };

  return {
    resize: resize,
    render: render,
    dispose: dispose
  };
};

exports.NavigationHelper = NavigationHelper;