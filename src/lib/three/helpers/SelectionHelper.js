import { Box2, Raycaster, Vector2, Vector3 } from 'three/build/three.module'

/**
 * Selection helper
 * @param {Object} renderer Renderer
 * @param {Object} camera Camera
 * @param {Object} scene Scene
 * @param {Object} controls Controls
 */
const SelectionHelper = (renderer, camera, scene, controls) => {
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

  // Event listeners
  renderer.domElement.addEventListener('mousedown', (event) => {
    if (!enabled || event.button !== 0) return
    down = true
    onSelectStart(event)
  })
  renderer.domElement.addEventListener('mousemove', (event) => {
    if (!enabled || event.button !== 0) return
    if (down) onSelectMove(event)
  })
  renderer.domElement.addEventListener('mouseup', (event) => {
    down = false
    if (!enabled) return
    onSelectEnd(event)
  })

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

  /**
   * Selection start
   * @param {Object} event Event
   */
  const onSelectStart = (event) => {
    controls.enabled = false
    controls.stop()

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

    const parentSize = new Vector2()
    renderer.getSize(parentSize)
    const raycasterCenter = new Vector2(
      (center.x / parentSize.x) * 2 - 1,
      -(center.y / parentSize.y) * 2 + 1
    )

    // Intersection
    raycaster.setFromCamera(raycasterCenter, camera)
    const intersects = raycaster.intersectObjects(scene.children, true)

    // Set center
    if (intersects.length) {
      controls.target.copy(intersects[0].point)
    } else {
      // Distance
      const distance = camera.position.distanceTo(controls.target)

      // Focus point
      const focusPoint = new Vector3()
      focusPoint.set(raycasterCenter.x, raycasterCenter.y, 0)
      focusPoint.unproject(camera)
      focusPoint.sub(camera.position).normalize()
      focusPoint.multiplyScalar(distance)

      controls.target.copy(camera.position).add(focusPoint)
    }

    // Zoom
    const size = new Vector2(rect.max.x - rect.min.x, rect.max.y - rect.min.y)
    const ratio = new Vector2(size.x / parentSize.x, size.y / parentSize.y)
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

  return { start }
}

export { SelectionHelper }
