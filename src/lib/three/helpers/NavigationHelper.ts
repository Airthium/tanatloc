/** @module Lib.Three.Helpers.NavigationHelper */

import {
  Box3,
  Color,
  Float32BufferAttribute,
  Group,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  Scene,
  Vector3,
  CanvasTexture,
  SphereGeometry,
  Vector2,
  Raycaster,
  WebGLRenderer,
  PerspectiveCamera,
  BufferGeometry,
  AmbientLight,
  ShapeGeometry,
  Uint32BufferAttribute
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
 * Shape
 * @param width Width
 * @param height Height
 * @param radius Radius
 * @param smooth Smooth
 * @returns
 */
const shape = (
  width: number,
  height: number,
  radius: number,
  smooth: number
): ShapeGeometry => {
  // helper const's
  const innerWidth = width / 2 - radius
  const innerHeight = height / 2 - radius
  const left = radius / width
  const right = (width - radius) / width
  const down = radius / height
  const top = (height - radius) / height

  const positions = [
    innerWidth,
    innerHeight,
    0,
    -innerWidth,
    innerHeight,
    0,
    -innerWidth,
    -innerHeight,
    0,
    innerWidth,
    -innerHeight,
    0
  ]

  const uvs = [right, top, left, top, left, down, right, down]

  const n = [
    3 * (smooth + 1) + 3,
    3 * (smooth + 1) + 4,
    smooth + 4,
    smooth + 5,
    2 * (smooth + 1) + 4,
    2,
    1,
    2 * (smooth + 1) + 3,
    3,
    4 * (smooth + 1) + 3,
    4,
    0
  ]

  const indices = [
    n[0],
    n[1],
    n[2],
    n[0],
    n[2],
    n[3],
    n[4],
    n[5],
    n[6],
    n[4],
    n[6],
    n[7],
    n[8],
    n[9],
    n[10],
    n[8],
    n[10],
    n[11]
  ]

  for (let i = 0; i < 4; i++) {
    const xc = i < 1 || i > 2 ? innerWidth : -innerWidth
    const yc = i < 2 ? innerHeight : -innerHeight

    const uc = i < 1 || i > 2 ? right : left
    const vc = i < 2 ? top : down

    for (let j = 0; j <= smooth; j++) {
      const phi = (Math.PI / 2) * (i + j / smooth)
      const cos = Math.cos(phi)
      const sin = Math.sin(phi)

      positions.push(xc + radius * cos, yc + radius * sin, 0)

      uvs.push(uc + left * cos, vc + down * sin)

      if (j < smooth) {
        const idx = (smooth + 1) * i + j + 4
        indices.push(i, idx, idx + 1)
      }
    }
  }

  const geometry = new BufferGeometry()
  geometry.setIndex(new Uint32BufferAttribute(indices, 1))
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2))

  return geometry
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
  // Text color
  const textColor = '#000000'
  // Highlight color
  const highlightColor = '#FAD114'
  // Cube size
  const size = 100
  // Cube corner
  const corner = 0.25
  // Highlight variable
  let currentlyHighlighted: (Group & { normal: Vector3 }) | null = null
  // Unhighlight variable
  let previouslyHighlighted: (Group & { normal: Vector3 }) | null = null

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
  const faceSize = size * (1 - corner)
  const faceRadius = size * corner
  const faceGeometry = shape(faceSize, faceSize, faceRadius, 20)

  // Hemisphere geometry
  const hemisphereGeometry = new SphereGeometry(
    faceSize / 2,
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
    const context = canvas.getContext('2d') as CanvasRenderingContext2D
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
    const frontMaterial = new MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.75
    })
    const backMaterial = new MeshBasicMaterial({
      color: cubeColor
    })

    // Mesh
    const frontMesh = new Mesh(faceGeometry, frontMaterial)
    const backMesh = new Mesh(faceGeometry, backMaterial)
    backMesh.rotateY(Math.PI)

    // Hemisphere
    const hemisphereMaterial = new MeshBasicMaterial({
      color: cubeColor,
      transparent: true,
      opacity: 0.2
    })
    const hemisphereMesh = new Mesh(hemisphereGeometry, hemisphereMaterial)

    // Group
    const faceGroup = new Group() as Group & { normal: Vector3 }
    faceGroup.add(frontMesh, backMesh, hemisphereMesh)

    // Orientation
    faceGroup.lookAt(face.normal)
    faceGroup.translateZ(size / 2)
    faceGroup.normal = face.normal
    faceGroup.up = face.up

    // Add
    cube.add(faceGroup)
  })

  // Light
  const light = new AmbientLight('#ffffff', 1)

  // Scene
  const localScene = new Scene()
  localScene.add(cube)
  localScene.add(light)

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
      if (currentlyHighlighted?.uuid !== previouslyHighlighted?.uuid) {
        unhighlight()
        previouslyHighlighted = currentlyHighlighted
      }
    } else {
      currentlyHighlighted = null
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
  const intersect = (mouse: Vector2): (Group & { normal: Vector3 }) | null => {
    const mouseCoords = new Vector3(mouse.x, mouse.y, -1)
    mouseCoords.unproject(localCamera)

    const cameraDir = new Vector3()
    localCamera.getWorldDirection(cameraDir)

    raycaster.set(mouseCoords, cameraDir)

    const intersects = raycaster.intersectObjects(localScene.children, true)

    return intersects.length
      ? (intersects[0].object.parent as (Group & { normal: Vector3 }) | null)
      : null
  }

  /**
   * Highlight
   */
  const highlight = (): void => {
    currentlyHighlighted &&
      currentlyHighlighted.children &&
      currentlyHighlighted.children.forEach((object) => {
        const mesh = object as Mesh<
          BufferGeometry,
          MeshBasicMaterial & { previousColor: Color }
        >
        if (mesh.material && mesh.material.color) {
          mesh.material.previousColor = mesh.material.color
          mesh.material.color = new Color(highlightColor)
        }
      })
  }

  /**
   * Unhighlight
   */
  const unhighlight = (): void => {
    previouslyHighlighted &&
      previouslyHighlighted.children &&
      previouslyHighlighted.children.forEach((object) => {
        const mesh = object as Mesh<BufferGeometry, MeshBasicMaterial>
        if (mesh.material && mesh.material.color) {
          mesh.material.color = new Color(cubeColor)
        }
      })
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
      currentlyHighlighted = null
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
      group.children.forEach((child) => {
        const mesh = child as Mesh<BufferGeometry, MeshBasicMaterial>
        mesh.geometry.dispose()
        mesh.material.dispose()
      })
    })

    // Scene
    localScene.remove(cube)
  }

  return { resize, render, dispose }
}

export { NavigationHelper }
