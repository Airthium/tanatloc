/** @module lib/three/helpers/SelectionHelper */

import { Box2, Raycaster, Vector2, Vector3 } from 'three/build/three.module'

/**
 * Selection helper
 * @param {Object} renderer Renderer
 * @param {Object} scene Scene
 * @param {Object} camera Camera
 * @param {Object} controls Controls
 */
const SelectionHelper = (renderer, scene, camera, controls) => {
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
  const start = () => {
    enabled = true
  }

  /**
   * End selection
   */
  const end = () => {
    enabled = false
  }

  const isEnabled = () => {
    return enabled
  }

  /**
   * Mouse down
   * @param {Object} event Event
   */
  const onMouseDown = (event) => {
    if (!enabled || event.button !== 0) return
    down = true
    onSelectStart(event)
  }

  /**
   * Mouse move
   * @param {Object} event Event
   */
  const onMouseMove = (event) => {
    if (!enabled) return
    if (down) onSelectMove(event)
  }

  /**
   * Mouse up
   * @param {Object} event Event
   */
  const onMouseUp = (event) => {
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
   * @param {Object} event Event
   */
  const onSelectStart = (event) => {
    controls.enabled = false

    renderer.domElement.parentElement.appendChild(element)

    element.style.left = event.clientX + 'px'
    element.style.top = event.clientY + 'px'
    element.style.width = '0px'
    element.style.height = '0px'

    startPoint.x = event.clientX
    startPoint.y = event.clientY
  }

  /**
   * Selection move
   * @param {Object} event Event
   */
  const onSelectMove = (event) => {
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
   * @param {Object} event Event
   */
  const onSelectEnd = (event) => {
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
   * @param {Object} rect Rectangle
   */
  const zoomToRect = (rect) => {
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
    raycaster.setFromCamera(raycasterCenter, camera)
    const intersects = raycaster.intersectObjects(scene.children, true)

    // Set center
    if (intersects.length) {
      controls.target.copy(intersects[0].point)
    } else {
      // Distance
      const tmpDistance = camera.position.distanceTo(controls.target)

      // Focus point
      const focusPoint = new Vector3()
      focusPoint.set(raycasterCenter.x, raycasterCenter.y, 0)
      focusPoint.unproject(camera)
      focusPoint.sub(camera.position).normalize()
      focusPoint.multiplyScalar(tmpDistance)

      controls.target.copy(camera.position).add(focusPoint)
    }

    // Zoom
    const size = new Vector2(rect.max.x - rect.min.x, rect.max.y - rect.min.y)
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
  const dispose = () => {
    // Event listeners
    renderer.domElement.removeEventListener('pointerdown', onMouseDown)
    renderer.domElement.removeEventListener('pointermove', onMouseMove)
    renderer.domElement.removeEventListener('pointerup', onMouseUp)
  }

  return { start, isEnabled, end, dispose }
}

export { SelectionHelper }
