/** @module Lib.Three.Helpers.SelectionHelper */

import {
  Box2,
  PerspectiveCamera,
  Raycaster,
  Scene,
  Vector2,
  WebGLRenderer
} from 'three'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'

export interface ISelectionHelper {
  dispose: () => void
  end: () => void
  isEnabled: () => boolean
  start: () => void
}

/**
 * Selection helper
 * @param renderer Renderer
 * @param scene Scene
 * @param camera Camera
 * @param controls Controls
 */
const SelectionHelper = (
  renderer: WebGLRenderer,
  scene: Scene,
  camera: PerspectiveCamera,
  controls: TrackballControls
): ISelectionHelper => {
  // Selector element
  const element = document.createElement('div')
  element.style.pointerEvents = 'none'
  element.style.border = '1px solid #55aaff'
  element.style.backgroundColor = 'rgba(75, 160, 255, 0.3)'
  element.style.position = 'fixed'

  // Start point
  const startPoint = new Vector2()
  // End point
  const endPoint = new Vector2()
  // Top-left point
  const pointTopLeft = new Vector2()
  // Bottom-right point
  const pointBottomRight = new Vector2()

  // Is enabled
  let enabled = false
  // Is down
  let down = false

  // Raycatser
  const raycaster = new Raycaster()

  /**
   * Start selection
   */
  const start = (): void => {
    enabled = true
  }

  /**
   * End selection
   */
  const end = (): void => {
    enabled = false
  }

  const isEnabled = (): boolean => {
    return enabled
  }

  /**
   * Mouse down
   * @param event Event
   */
  const onMouseDown = (event: MouseEvent): void => {
    if (!enabled || event.button !== 0) return
    down = true
    onSelectStart(event)
  }

  /**
   * Mouse move
   * @param event Event
   */
  const onMouseMove = (event: MouseEvent): void => {
    if (!enabled) return
    if (down) onSelectMove(event)
  }

  /**
   * Mouse up
   * @param event Event
   */
  const onMouseUp = (event: MouseEvent): void => {
    down = false
    if (!enabled) return
    onSelectEnd(event)
  }

  // Event listeners
  renderer.domElement.addEventListener('pointerdown', onMouseDown)
  renderer.domElement.addEventListener('pointermove', onMouseMove)
  renderer.domElement.addEventListener('pointerup', onMouseUp)

  /**
   * Selection start
   * @param event Event
   */
  const onSelectStart = (event: MouseEvent): void => {
    controls.enabled = false

    renderer.domElement.parentElement!.appendChild(element)

    element.style.left = event.clientX + 'px'
    element.style.top = event.clientY + 'px'
    element.style.width = '0px'
    element.style.height = '0px'

    startPoint.x = event.clientX
    startPoint.y = event.clientY
  }

  /**
   * Selection move
   * @param event Event
   */
  const onSelectMove = (event: MouseEvent): void => {
    pointBottomRight.x = Math.max(startPoint.x, event.clientX)
    pointBottomRight.y = Math.max(startPoint.y, event.clientY)

    pointTopLeft.x = Math.min(startPoint.x, event.clientX)
    pointTopLeft.y = Math.min(startPoint.y, event.clientY)

    element.style.left = pointTopLeft.x + 'px'
    element.style.top = pointTopLeft.y + 'px'
    element.style.width = pointBottomRight.x - pointTopLeft.x + 'px'
    element.style.height = pointBottomRight.y - pointTopLeft.y + 'px'
  }

  /**
   * Selection end
   * @param event Event
   */
  const onSelectEnd = (event: MouseEvent): void => {
    controls.enabled = true

    if (element.parentElement) element.parentElement.removeChild(element)

    endPoint.x = event.clientX
    endPoint.y = event.clientY

    const selectionRect = new Box2(startPoint, endPoint)
    zoomToRect(selectionRect)

    end()
  }

  /**
   * Zoom to rectangle
   * @param rect Rectangle
   */
  const zoomToRect = (rect: Box2): void => {
    // Check size
    const size = new Vector2()
    rect.getSize(size)
    if (size.x < 5 || size.y < 5) return

    // Center
    const center = new Vector2(
      (rect.max.x + rect.min.x) / 2,
      (rect.max.y + rect.min.y) / 2
    )

    const parentRect = renderer.domElement.getBoundingClientRect()
    const X = center.x - parentRect.left
    const Y = center.y - parentRect.top

    const raycasterCenter = new Vector2(
      (X / parentRect.width) * 2 - 1,
      -(Y / parentRect.height) * 2 + 1
    )

    // Intersection
    const object = scene.children.find((child) => child.type === 'Part')
    if (!object) return

    raycaster.setFromCamera(raycasterCenter, camera)
    const intersects = raycaster.intersectObject(object)

    // Set center
    if (!intersects.length) return
    controls.target.copy(intersects[0].point)

    // Zoom
    const ratio = new Vector2(
      size.x / parentRect.width,
      size.y / parentRect.height
    )
    const maxRatio = Math.max(ratio.x, ratio.y)
    const zoomFactor = 1 - maxRatio

    const distance = camera.position.distanceTo(controls.target)
    const zoomDistance = distance * zoomFactor
    const translation = controls.target
      .clone()
      .sub(camera.position)
      .normalize()
      .multiplyScalar(zoomDistance)

    camera.position.add(translation)
  }

  /**
   * Dispose
   */
  const dispose = (): void => {
    // Event listeners
    renderer.domElement.removeEventListener('pointerdown', onMouseDown)
    renderer.domElement.removeEventListener('pointermove', onMouseMove)
    renderer.domElement.removeEventListener('pointerup', onMouseUp)
  }

  return { dispose, end, isEnabled, start }
}

export { SelectionHelper }
