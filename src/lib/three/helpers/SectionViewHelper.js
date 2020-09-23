/** @module src/lib/three/SectionViewHelper */

import {
  Color,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  Plane,
  PlaneGeometry,
  Raycaster,
  Vector2,
  Vector3
} from 'three/build/three.module'

import { TransformControls } from 'three/examples/jsm/controls/TransformControls'

/**
 * SectionViewHelper
 * @param {Object} renderer Renderer
 * @param {Object} scene Scene
 * @param {Object} camera Camera
 * @param {Object} controls Controls
 */
const SectionViewHelper = (renderer, scene, camera, controls) => {
  // Base color
  const baseColor = new Color('orange')
  // Ray caster
  const raycaster = new Raycaster()
  // Down
  let isDown = false
  // Clipping plane
  const clippingPlane = new Plane(new Vector3(0, 0, 1))

  // Transform controls
  const transformControls = new TransformControls(camera, renderer.domElement)
  transformControls.enabled = false
  scene.add(transformControls)

  /**
   * Build plane
   */
  const buildPlane = () => {
    const geometry = new PlaneGeometry()
    const material = new MeshBasicMaterial({
      color: baseColor,
      side: DoubleSide,
      transparent: true,
      opacity: 0.5
    })
    const mesh = new Mesh(geometry, material)
    mesh.clippingPlane = clippingPlane

    return mesh
  }

  const controller = buildPlane()
  controller.visible = false
  controller.type = 'SectionViewHelper'

  scene.add(controller)

  /**
   * Get clipping plane
   */
  const getClippingPlane = () => {
    return clippingPlane
  }

  /**
   * Start
   */
  const start = () => {
    controller.visible = true
    renderer.localClippingEnabled = true

    const normal = new Vector3(0, 0, 1)

    // LookAt
    controller.position.copy(new Vector3(0, 0, 0))
    controller.lookAt(normal)

    // Set center
    const center = new Vector3()
    scene.boundingBox.getCenter(center)
    controller.position.copy(center)

    // Set scale
    const size = new Vector3()
    scene.boundingBox.getSize(size)
    const maxSize = Math.max(size.x, size.y, size.z)
    controller.scale.setScalar(maxSize * 1.2)

    // Clipping plane
    normal.multiplyScalar(-1)
    clippingPlane.setFromNormalAndCoplanarPoint(normal, controller.position)
  }

  /**
   * Stop
   */
  const stop = () => {
    controller.visible = false
    renderer.localClippingEnabled = false

    transformStop()
  }

  /**
   * Toogle visible
   */
  const toggleVisible = () => {
    const visible = controller.visible
    controller.visible = !visible
  }

  /**
   * To axis
   * @param {Object} normal Normal
   */
  const toAxis = (normal) => {
    // Set center
    const center = new Vector3()
    scene.boundingBox.getCenter(center)
    controller.position.copy(center)

    // Clipping plane
    clippingPlane.setFromNormalAndCoplanarPoint(normal, controller.position)

    // Look at
    normal.multiplyScalar(-1)
    const lookAt = new Vector3().copy(controller.position).add(normal)
    controller.lookAt(lookAt)
  }

  /**
   * Flip
   */
  const flip = () => {
    // Controllers
    controller.rotateX(Math.PI)

    // Clipping plane
    const normal = clippingPlane.normal.multiplyScalar(-1)
    clippingPlane.setFromNormalAndCoplanarPoint(normal, controller.position)
  }

  const setMode = (mode) => {
    transformControls.setMode(mode)
  }

  /**
   *  Global coordinates to local [-1, 1]^2
   * @param {Object} event Event
   */
  const globalToLocal = ({ X, Y }) => {
    const parentSize = new Vector2()
    renderer.getSize(parentSize)

    const mouse = new Vector2()
    mouse.x = (X / parentSize.x) * 2 - 1
    mouse.y = -(Y / parentSize.y) * 2 + 1

    return mouse
  }

  /**
   * Mouse down
   * @param {Object} event Event
   */
  const onMouseDown = (event) => {
    if (!controller.visible) return

    isDown = true
  }

  /**
   * Mouse move
   * @param {Object} event Event
   */
  const onMouseMove = (event) => {
    if (!controller.visible) return
    if (isDown) return

    const mouse = globalToLocal({ X: event.clientX, Y: event.clientY })
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObject(controller)
    if (intersects.length > 0) {
      if (!transformControls.enabled) transformStart()
    } else {
      if (transformControls.enabled) transformStop()
    }
  }

  /**
   * Start transform (stop controls)
   */
  const transformStart = () => {
    controls.enabled = false

    transformControls.enabled = true
    transformControls.attach(controller)
  }

  /**
   * Stop transform (start controls)
   */
  const transformStop = () => {
    controls.enabled = true
    controls.stop()

    transformControls.enabled = false
    transformControls.detach()
  }

  /**
   * Mouse up
   */
  const onMouseUp = () => {
    if (!controller.visible) return
    isDown = false

    if (!transformControls.enabled) return

    const normal = new Vector3(0, 0, 1)
    normal.applyQuaternion(controller.quaternion).multiplyScalar(-1)

    clippingPlane.setFromNormalAndCoplanarPoint(normal, controller.position)
  }

  // Event listener
  renderer.domElement.addEventListener('mousedown', onMouseDown)
  renderer.domElement.addEventListener('mousemove', onMouseMove)
  renderer.domElement.addEventListener('mouseup', onMouseUp)

  /**
   * Dispose
   */
  const dispose = () => {
    // Event listener
    renderer.domElement.removeEventListener('mousemove', onMouseMove)

    // Meshes
    controller.geometry.dispose()
    controller.material.dispose()
  }

  return {
    getClippingPlane,
    start,
    toggleVisible,
    toAxis,
    flip,
    setMode,
    stop,
    dispose
  }
}

export { SectionViewHelper }
