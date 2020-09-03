import {
  ConeGeometry,
  CylinderGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  Scene,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  Texture
} from 'three/build/three.module'

// X-axis color
const xColor = 'red'
// Y-axis color
const yColor = 'green'
// Z-axis color
const zColor = 'blue'
// Base sphere color
const baseColor = 'black'

// Default width in viewport
const defaultWidth = 150
// Default height in viewport
const defaultHeight = 150

/**
 * Axis helper
 */
const AxisHelper = () => {
  /**
   * Arrow builder
   * @param {string} color Color
   */
  const arrow = (color) => {
    // Cylinder
    const cylinderGeometry = new CylinderGeometry(0.05, 0.05, 0.8, 50)
    cylinderGeometry.translate(0, 0.4, 0)
    const cylinderMaterial = new MeshBasicMaterial({ color: color })
    const cylinder = new Mesh(cylinderGeometry, cylinderMaterial)

    // Cone
    const coneGeometry = new ConeGeometry(0.1, 0.2, 50)
    coneGeometry.translate(0, 0.9, 0)
    const coneMaterial = new MeshBasicMaterial({ color: color })
    const cone = new Mesh(coneGeometry, coneMaterial)

    // Arrow
    const arrow = new Group()
    arrow.add(cylinder)
    arrow.add(cone)

    return arrow
  }

  /**
   * Label builder
   * @param {string} text Text
   */
  const label = (text) => {
    // Canvas
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const context = canvas.getContext('2d')
    context.fillStyle = 'black'
    context.font = '256px sans-serif'
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillText(text, canvas.width / 2, canvas.height / 2)

    // Texture
    const texture = new Texture(canvas)
    texture.needsUpdate = true

    // Label
    const material = new SpriteMaterial({
      map: texture,
      transparent: true
    })
    const label = new Sprite(material)

    return label
  }

  /**
   * Axis helper builder
   */
  const build = () => {
    // X
    const x = arrow(xColor)
    x.rotateZ(-Math.PI / 2)
    const xLabel = label('X')
    xLabel.scale.setScalar(0.2)
    xLabel.position.set(1.1, 0, 0)

    // Y
    const y = arrow(yColor)
    const yLabel = label('Y')
    yLabel.scale.setScalar(0.2)
    yLabel.position.set(0, 1.1, 0)

    // Z
    const z = arrow(zColor)
    z.rotateX(Math.PI / 2)
    const zLabel = label('Z')
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

    return mesh
  }

  const axisHelper = build()

  // Scene
  const localScene = new Scene()
  localScene.add(axisHelper)

  // Camera
  const localCamera = new OrthographicCamera(-1.2, 1.2, 1.2, -1.2, -2, 2)

  /**
   * Render
   * @param {Object} renderer Renderer
   * @param {Object} camera Camera
   * @param {number} width Width
   * @param {number} height Height
   */
  const render = (
    renderer,
    camera,
    width = defaultWidth,
    height = defaultHeight
  ) => {
    renderer.setViewport(0, 0, width, height)
    localCamera.rotation.copy(camera.rotation)
    renderer.render(localScene, localCamera)
  }

  return { render }
}

export { AxisHelper }
