import {
  Group,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  Scene,
  SphereGeometry
} from 'three/build/three.module'
import Arrow from './ArrowHelper'
import Label from './LabelHelper'

// Default width in viewport
const defaultWidth = 150
// Default height in viewport
const defaultHeight = 150

/**
 * Axis helper
 * @param {Object} renderer Renderer
 * @param {Object} camera Camera
 * @param {Object} dimensions Dimensions
 */
const AxisHelper = (
  renderer,
  camera,
  { offsetWidth, offsetHeight, width, height } = {
    offsetWidth: 0,
    offsetHeight: 0,
    width: defaultWidth,
    height: defaultHeight
  }
) => {
  // X-axis color
  const xColor = 'red'
  // Y-axis color
  const yColor = 'green'
  // Z-axis color
  const zColor = 'blue'
  // Base sphere color
  const baseColor = 'black'

  // X
  const x = new Arrow(xColor)
  x.rotateZ(-Math.PI / 2)
  const xLabel = new Label('X')
  xLabel.scale.setScalar(0.2)
  xLabel.position.set(1.1, 0, 0)

  // Y
  const y = new Arrow(yColor)
  const yLabel = new Label('Y')
  yLabel.scale.setScalar(0.2)
  yLabel.position.set(0, 1.1, 0)

  // Z
  const z = new Arrow(zColor)
  z.rotateX(Math.PI / 2)
  const zLabel = new Label('Z')
  zLabel.scale.setScalar(0.2)
  zLabel.position.set(0, 0, 1.1)

  // Sphere
  const sphereGeometry = new SphereGeometry(0.1, 50, 50)
  const sphereMaterial = new MeshBasicMaterial({ color: baseColor })
  const sphere = new Mesh(sphereGeometry, sphereMaterial)

  // Axis helper
  const mesh = new Group()
  mesh.type = 'AxisHelper'
  mesh.add(x)
  mesh.add(xLabel)
  mesh.add(y)
  mesh.add(yLabel)
  mesh.add(z)
  mesh.add(zLabel)
  mesh.add(sphere)

  // Scene
  const localScene = new Scene()
  localScene.add(mesh)

  // Camera
  const localCamera = new OrthographicCamera(-1.2, 1.2, 1.2, -1.2, -2, 2)

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

  return { resize, render }
}

export { AxisHelper }
