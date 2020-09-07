import { Box2, Vector2, Raycaster } from 'three/build/three.module'

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

  const enable = () => {
    enabled = true
  }

  const disable = () => {
    enabled = false
  }

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

  const onSelectEnd = (event) => {
    controls.enabled = true

    if (element.parentElement) element.parentElement.removeChild(element)

    endPoint.x = event.clientX
    endPoint.y = event.clientY

    const selectionRect = new Box2(startPoint, endPoint)
    zoomToRect(selectionRect)

    disable()
    //TODO zoom with it
  }

  const zoomToRect = (rect) => {
    const center = new Vector2(
      (rect.max.x + rect.min.x) / 2,
      (rect.max.y + rect.min.y) / 2
    )
    console.log(center)

    const size = new Vector2()
    renderer.getSize(size)
    const raycasterCenter = new Vector2(
      (center.x / size.x) * 2 - 1,
      -(center.y / size.y) * 2 + 1
    )
    console.log(raycasterCenter)

    raycaster.setFromCamera(raycasterCenter, camera)
    const intersects = raycaster.intersectObjects(scene.children, true)

    if (intersects.length) {
      controls.target.copy(intersects[0].point)
    } else {
      //TODO
    }

    // TODO Get intersection with surface

    // TODO Zoom camera

    // camera.
  }

  return { enable }
}

export { SelectionHelper }
