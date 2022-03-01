/** @module Lib.Three.Helpers.NavigationHelper */

import {
  Box3,
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
  Raycaster,
  WebGLRenderer,
  PerspectiveCamera,
  Object3D,
  BufferGeometry,
  MeshStandardMaterial
} from 'three'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'

export interface INavigationHelper {
  dispose: () => void
  render: () => void
  resize: (size: INavigationHelperNewSize) => void
}

export interface INavigationHelperNewSize {
  newOffsetWidth: number
  newOffsetHeight: number
  newWidth: number
  newHeight: number
}

/**
 * Navigation helper
 * @memberof Lib.Three.Helpers
 * @param renderer Renderer
 * @param scene Scene
 * @param camera Camera
 * @param controls Controls
 * @param dimensions Dimensions
 */
const NavigationHelper = (
  renderer: WebGLRenderer,
  scene: Scene & { boundingBox: Box3 },
  camera: PerspectiveCamera,
  controls: TrackballControls,
  { offsetWidth, offsetHeight, width, height } = {
    offsetWidth: 0,
    offsetHeight: 0,
    width: 150,
    height: 150
  }
): INavigationHelper => {
  // Cube color
  const cubeColor = '#d3d3d3'
  // Edge color
  const edgeColor = '#ffffff'
  // Text color
  const textColor = '#000000'
  // Highlight color
  const highlightColor = '#FAD114'
  // Cube size
  const size = 100
  // Cube corner
  const corner = 0.25
  // Highlight variable
  let currentlyHighlighted = null
  // Unhighlight variable
  let previouslyHighlighted = null

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
    texture.needsUpdate = true

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
    const faceGroup = new Group() as Group & { normal: Vector3 }
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
   * @param event Event
   */
  const onMouseMove = (event: MouseEvent): void => {
    const mouse = globalToLocal(event)
    if (isIn(mouse)) {
      currentlyHighlighted = intersect(mouse)
      highlight()
      if (currentlyHighlighted.uuid !== previouslyHighlighted.uuid) {
        unhighlight()
        previouslyHighlighted = currentlyHighlighted
      }
    } else {
      currentlyHighlighted = 0
      unhighlight()
    }
  }

  /**
   *  Global coordinates to local [-1, 1]^2
   * @param event Event
   */
  const globalToLocal = (event: MouseEvent): Vector2 => {
    const node = event.target as HTMLElement
    const rect = node.getBoundingClientRect()

    const X = event.clientX - rect.left
    const Y = event.clientY - rect.top

    const mouse = new Vector2()
    mouse.x = ((X - offsetWidth) / width) * 2 - 1
    mouse.y = -((Y + height - rect.height + offsetHeight) / height) * 2 + 1

    return mouse
  }

  /**
   * Check if mouse is in the viewport
   * @param mouse Mouse
   */
  const isIn = (mouse: Vector2): boolean => {
    if (mouse.x > -1 && mouse.x < 1 && mouse.y > -1 && mouse.y < 1) return true
    return false
  }

  /**
   * Intersect
   * @param mouse Mouse
   */
  const intersect = (mouse: Vector2): Object3D => {
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
  const highlight = (): void => {
    currentlyHighlighted &&
      currentlyHighlighted.children &&
      currentlyHighlighted.children.forEach(
        (
          object: Mesh<
            BufferGeometry,
            MeshStandardMaterial & { previousColor: Color }
          >
        ) => {
          if (object.material && object.material.color) {
            object.material.previousColor = object.material.color
            object.material.color = new Color(highlightColor)
          }
        }
      )
  }

  /**
   * Unhighlight
   */
  const unhighlight = (): void => {
    previouslyHighlighted &&
      previouslyHighlighted.children &&
      previouslyHighlighted.children.forEach(
        (object: Mesh<BufferGeometry, MeshStandardMaterial>) => {
          if (object.material && object.material.color) {
            object.material.color = new Color(cubeColor)
          }
        }
      )
  }

  /**
   * On mouse down
   * @param event Event
   */
  const onMouseDown = (event: MouseEvent): void => {
    if (currentlyHighlighted) {
      const normal = currentlyHighlighted.normal
      const up = currentlyHighlighted.up

      // Scene
      const center = new Vector3()
      scene.boundingBox && scene.boundingBox.getCenter(center)

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
  renderer.domElement.addEventListener('pointermove', onMouseMove)
  renderer.domElement.addEventListener('pointerdown', onMouseDown)

  /**
   * Resize
   * @param dimensions Dimensions
   */
  const resize = ({
    newOffsetWidth,
    newOffsetHeight,
    newWidth,
    newHeight
  }: INavigationHelperNewSize): void => {
    offsetWidth = newOffsetWidth
    offsetHeight = newOffsetHeight
    width = newWidth
    height = newHeight
  }

  /**
   * Render
   */
  const render = (): void => {
    renderer.setViewport(offsetWidth, offsetHeight, width, height)
    localCamera.rotation.copy(camera.rotation)
    renderer.render(localScene, localCamera)
  }

  /**
   * Dispose
   */
  const dispose = (): void => {
    // Event listeners
    renderer.domElement.removeEventListener('pointermove', onMouseMove)
    renderer.domElement.removeEventListener('pointerdown', onMouseDown)

    // Cube
    cube.children.forEach((group) => {
      group.children.forEach(
        (child: Mesh<BufferGeometry, MeshStandardMaterial>) => {
          child.geometry.dispose()
          child.material.dispose()
        }
      )
    })

    // Scene
    localScene.remove(cube)
  }

  return { resize, render, dispose }
}

export { NavigationHelper }