import {
  Color,
  EdgesGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  Vector3,
  CanvasTexture,
  LineBasicMaterial,
  LineSegments,
  SphereGeometry,
  Vector2,
  Raycaster
} from 'three/build/three.module'

/**
 * Navigation helper
 * @param {Object} renderer Renderer
 * @param {Object} camera Camera
 * @param {Object} controls Controls
 * @param {Object} dimensions Dimensions
 */
const NavigationHelper = (
  renderer,
  scene,
  camera,
  controls,
  { offsetWidth, offsetHeight, width, height } = {
    offsetWidth: 0,
    offsetHeight: 0,
    width: 150,
    height: 150
  }
) => {
  // Cube color
  const cubeColor = '#d3d3d3'
  // Edge color
  const edgeColor = '#ffffff'
  // Text color
  const textColor = '#000000'
  // Highlight color
  const highlightColor = '#0096C7'
  // Cube size
  const size = 100
  // Cube corner
  const corner = 0.25
  // Highlight variable
  let currentlyHighlighted = 0
  // Unhighlight variable
  let previouslyHighlighted = 0

  // Faces
  const faces = [
    { text: 'FRONT', normal: new Vector3(0, 0, 1), up: new Vector3(0, 1, 0) },
    { text: 'BACK', normal: new Vector3(0, 0, -1), up: new Vector3(0, 1, 0) },
    { text: 'RIGHT', normal: new Vector3(1, 0, 0), up: new Vector3(0, 1, 0) },
    { text: 'LEFT', normal: new Vector3(-1, 0, 0), up: new Vector3(0, 1, 0) },
    { text: 'UP', normal: new Vector3(0, 1, 0), up: new Vector3(0, 0, -1) },
    { text: 'DOWN', normal: new Vector3(0, -1, 0), up: new Vector3(0, 0, 1) }
  ]

  // Face geometry
  const faceGeometry = new PlaneGeometry(
    size * (1 - corner),
    size * (1 - corner)
  )

  // Edge geometry
  const edgeGeometry = new EdgesGeometry(faceGeometry)

  // Hemisphere geometry
  const hemisphereGeometry = new SphereGeometry(
    (size * (1 - corner)) / 2,
    10,
    10,
    0,
    Math.PI,
    0
  )

  // Cube
  const cube = new Group()
  faces.forEach((face) => {
    // Canvas
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    canvas.width = canvas.height = 256
    context.fillStyle = cubeColor
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.font = 'bold 50pt sans-serif'
    context.fillStyle = textColor
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillText(face.text, canvas.width / 2, canvas.height / 2)

    // Mesh
    const texture = new CanvasTexture(canvas)
    texture.needUpdate = true

    // Material
    const frontMaterial = new MeshBasicMaterial({ map: texture })
    const backMaterial = new MeshBasicMaterial({
      color: cubeColor
    })

    // Mesh
    const frontMesh = new Mesh(faceGeometry, frontMaterial)
    const backMesh = new Mesh(faceGeometry, backMaterial)
    backMesh.rotateY(Math.PI)

    // Edge
    const edgeMaterial = new LineBasicMaterial({ color: edgeColor })
    const edgeMesh = new LineSegments(edgeGeometry, edgeMaterial)

    // Hemisphere
    const hemisphereMaterial = new MeshBasicMaterial({
      color: cubeColor,
      transparent: true,
      opacity: 0.2
    })
    const hemisphereMesh = new Mesh(hemisphereGeometry, hemisphereMaterial)

    // Group
    const faceGroup = new Group()
    faceGroup.add(frontMesh, backMesh, edgeMesh, hemisphereMesh)

    // Orientation
    faceGroup.lookAt(face.normal)
    faceGroup.translateZ(size / 2)
    faceGroup.normal = face.normal
    faceGroup.up = face.up

    // Add
    cube.add(faceGroup)
  })

  // Scene
  const localScene = new Scene()
  localScene.add(cube)

  // Camera
  const localCamera = new OrthographicCamera(
    -size,
    size,
    size,
    -size,
    -size,
    size
  )
  localCamera.position.z = 2

  // Raycatser
  const raycaster = new Raycaster()

  /**
   * On mouse move
   * @param {Object} event Event
   */
  const onMouseMove = (event) => {
    const mouse = globalToLocal({ X: event.clientX, Y: event.clientY })
    if (isIn(mouse)) {
      currentlyHighlighted = intersect(mouse)
      highlight()
      if (currentlyHighlighted.uuid !== previouslyHighlighted.uuid)
        unhighlight()
      previouslyHighlighted = currentlyHighlighted
    } else {
      unhighlight()
    }
  }

  /**
   *  Global coordinates to local [-1, 1]^2
   * @param {Object} event Event
   */
  const globalToLocal = ({ X, Y }) => {
    const parentSize = new Vector2()
    renderer.getSize(parentSize)

    const mouse = new Vector2()
    mouse.x = ((X - offsetWidth) / width) * 2 - 1
    mouse.y = -((Y + height - parentSize.y + offsetHeight) / height) * 2 + 1

    return mouse
  }

  /**
   * Check if mouse is in the viewport
   * @param {Object} mouse Mouse
   */
  const isIn = (mouse) => {
    if (mouse.x > -1 && mouse.x < 1 && mouse.y > -1 && mouse.y < 1) return true
    return false
  }

  /**
   * Intersect
   * @param {Object} mouse Mouse
   */
  const intersect = (mouse) => {
    const mouseCoords = new Vector3(mouse.x, mouse.y, -1)
    mouseCoords.unproject(localCamera)

    const cameraDir = new Vector3()
    localCamera.getWorldDirection(cameraDir)

    raycaster.set(mouseCoords, cameraDir)

    const intersects = raycaster.intersectObjects(localScene.children, true)

    return intersects.length && intersects[0].object.parent
  }

  /**
   * Highlight
   */
  const highlight = () => {
    currentlyHighlighted &&
      currentlyHighlighted.children &&
      currentlyHighlighted.children.forEach((object) => {
        if (object.material && object.material.color) {
          object.material.previousColor = object.material.color
          object.material.color = new Color(highlightColor)
        }
      })
  }

  /**
   * Unhighlight
   */
  const unhighlight = () => {
    previouslyHighlighted &&
      previouslyHighlighted.children &&
      previouslyHighlighted.children.forEach((object) => {
        if (object.material && object.material.color) {
          object.material.color = new Color(cubeColor)
        }
      })
  }

  /**
   * On mouse down
   * @param {Object} event Event
   */
  const onMouseDown = (event) => {
    if (currentlyHighlighted) {
      const normal = currentlyHighlighted.normal
      const up = currentlyHighlighted.up

      // Scene
      const center = new Vector3()
      scene.boundingBox.getCenter(center)

      // Camera
      const distance = camera.position.distanceTo(controls.target)

      const interval = normal.clone().multiplyScalar(distance)
      const newPosition = center.add(interval)

      camera.position.copy(newPosition)
      camera.up.copy(up)

      // Unhighlight
      currentlyHighlighted = 0
      unhighlight()

      // Mouse move
      onMouseMove(event)
    }
  }

  // Events
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mousedown', onMouseDown)

  /**
   * Resize
   * @param {Object} dimensions Dimensions
   */
  const resize = ({ newOffsetWidth, newOffsetHeight, newWidth, newHeight }) => {
    offsetWidth = newOffsetWidth
    offsetHeight = newOffsetHeight
    width = newWidth
    height = newHeight
  }

  /**
   * Render
   */
  const render = () => {
    renderer.setViewport(offsetWidth, offsetHeight, width, height)
    localCamera.rotation.copy(camera.rotation)
    renderer.render(localScene, localCamera)
  }

  /**
   * Dispose
   */
  const dispose = () => {
    // Event listeners
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mousedown', onMouseDown)

    // Cube
    cube.children.forEach((group) => {
      group.children.forEach((child) => {
        child.geometry.dispose()
        child.material.dispose()
      })
    })

    // Scene
    localScene.remove(cube)
  }

  return { resize, render, dispose }
}

export { NavigationHelper }
