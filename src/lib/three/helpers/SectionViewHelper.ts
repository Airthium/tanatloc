/** @module Lib.Three.Helpers.SectionViewHelper */

import {
  Box3,
  Color,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Plane,
  PlaneGeometry,
  Raycaster,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer
} from 'three'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'

export interface ISectionViewHelper {
  getClippingPlane: () => Plane
  start: () => void
  toggleVisible: () => void
  toAxis: (normal: Vector3) => void
  flip: () => void
  setMode: (mode: 'translate' | 'rotate' | 'scale') => void
  stop: () => void
  dispose: () => void
}

/**
 * SectionViewHelper
 * @memberof Lib.Three.Helpers
 * @param renderer Renderer
 * @param scene Scene
 * @param camera Camera
 * @param controls Controls
 */
const SectionViewHelper = (
  renderer: WebGLRenderer,
  scene: Scene & { boundingBox: Box3 },
  camera: PerspectiveCamera,
  controls: TrackballControls
): ISectionViewHelper => {
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
  const buildPlane = (): Mesh<PlaneGeometry, MeshBasicMaterial> & {
    clippingPlane: Plane
  } => {
    const geometry = new PlaneGeometry()
    const material = new MeshBasicMaterial({
      color: baseColor,
      side: DoubleSide,
      transparent: true,
      opacity: 0.5
    })
    const mesh = new Mesh(geometry, material) as Mesh<
      PlaneGeometry,
      MeshBasicMaterial
    > & { clippingPlane: Plane }
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
  const getClippingPlane = (): Plane => {
    return clippingPlane
  }

  /**
   * Start
   */
  const start = (): void => {
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
  const stop = (): void => {
    controller.visible = false
    renderer.localClippingEnabled = false

    transformStop()
  }

  /**
   * Toogle visible
   */
  const toggleVisible = (): void => {
    const visible = controller.visible
    controller.visible = !visible

    if (!controller.visible) {
      transformStop()
    }
  }

  /**
   * To axis
   * @param normal Normal
   */
  const toAxis = (normal: Vector3): void => {
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
  const flip = (): void => {
    // Controllers
    controller.rotateX(Math.PI)

    // Clipping plane
    const normal = clippingPlane.normal.multiplyScalar(-1)
    clippingPlane.setFromNormalAndCoplanarPoint(normal, controller.position)
  }

  /**
   * Set mode
   * @param mode Mode
   */
  const setMode = (mode: 'translate' | 'rotate' | 'scale'): void => {
    transformControls.setMode(mode)
  }

  /**
   *  Global coordinates to local [-1, 1]^2
   * @param event Event
   */
  const globalToLocal = (event: MouseEvent) => {
    const node = event.target as HTMLElement
    const rect = node.getBoundingClientRect()

    const X = event.clientX - rect.left
    const Y = event.clientY - rect.top

    const mouse = new Vector2()
    mouse.x = (X / rect.width) * 2 - 1
    mouse.y = -(Y / rect.height) * 2 + 1

    return mouse
  }

  /**
   * Mouse down
   */
  const onMouseDown = (): void => {
    if (!controller.visible) return

    isDown = true
  }

  /**
   * Mouse move
   * @param event Event
   */
  const onMouseMove = (event: MouseEvent): void => {
    if (!controller.visible) return
    if (isDown) return

    const mouse = globalToLocal(event)
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
  const transformStart = (): void => {
    controls.enabled = false

    transformControls.enabled = true
    transformControls.attach(controller)
  }

  /**
   * Stop transform (start controls)
   */
  const transformStop = (): void => {
    controls.enabled = true

    transformControls.enabled = false
    transformControls.detach()
  }

  /**
   * Mouse up
   */
  const onMouseUp = (): void => {
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
  const dispose = (): void => {
    // Event listener
    renderer.domElement.removeEventListener('mousedown', onMouseDown)
    renderer.domElement.removeEventListener('mousemove', onMouseMove)
    renderer.domElement.removeEventListener('mouseup', onMouseUp)

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
