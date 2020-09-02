import {
  AmbientLight,
  Color,
  CylinderGeometry,
  ConeGeometry,
  SphereGeometry,
  MeshBasicMaterial,
  Mesh,
  Group,
  Texture,
  SpriteMaterial,
  Sprite,
  Scene,
  OrthographicCamera
} from 'three/build/three.module'

const xColor = 'red'
const yColor = 'green'
const zColor = 'blue'
const baseColor = 'black'

const AxisHelper = () => {
  const arrow = (color) => {
    const cylinderGeometry = new CylinderGeometry(0.05, 0.05, 0.8, 50)
    cylinderGeometry.translate(0, 0.4, 0)
    const cylinderMaterial = new MeshBasicMaterial({ color: color })
    const cylinder = new Mesh(cylinderGeometry, cylinderMaterial)

    const coneGeometry = new ConeGeometry(0.1, 0.2, 50)
    coneGeometry.translate(0, 0.9, 0)
    const coneMaterial = new MeshBasicMaterial({ color: color })
    const cone = new Mesh(coneGeometry, coneMaterial)

    const arrow = new Group()
    arrow.add(cylinder)
    arrow.add(cone)

    return arrow
  }

  const label = (text) => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const context = canvas.getContext('2d')
    context.fillStyle = '#808080'
    context.font = '256px sans-serif'
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillText(text, canvas.width / 2, canvas.height / 2)
    const texture = new Texture(canvas)
    texture.needsUpdate = true
    const material = new SpriteMaterial({
      map: texture,
      transparent: true
    })
    const label = new Sprite(material)
    return label
  }

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

  return build()

  //   const scene = new Scene()

  //   const width = 1
  //   const height = 1
  //   const camera = new OrthographicCamera(
  //     -width / 2,
  //     width / 2,
  //     -height / 2,
  //     height / 2
  //   )
  //   //     -10,
  //   //     10
  //   //   )

  //   //   const render = () => {
  //   //     renderer.setViewport(0, 0, width, height)
  //   //     renderer.render(scene, camera)
  //   //   }

  //   //   return { axesHelper, render }
  //   return { axisHelper, scene, camera }
}

export { AxisHelper }
