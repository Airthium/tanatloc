import {
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

const NavigationHelper = (
  renderer,
  camera,
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

  const corner = 0.25

  const faces = [
    { text: 'FRONT', position: new Vector3(0, 0, 1) },
    { text: 'BACK', position: new Vector3(0, 0, -1) },
    { text: 'RIGHT', position: new Vector3(1, 0, 0) },
    { text: 'LEFT', position: new Vector3(-1, 0, 0) },
    { text: 'UP', position: new Vector3(0, 1, 0) },
    { text: 'DOWN', position: new Vector3(0, -1, 0) }
  ]

  const faceGeometry = new PlaneGeometry(1 - corner, 1 - corner)

  const edgeGeometry = new EdgesGeometry(faceGeometry)
  const edgeMaterial = new LineBasicMaterial({ color: edgeColor })

  const hemisphereGeometry = new SphereGeometry(
    (1 - corner) / 2,
    10,
    10,
    0,
    Math.PI,
    0
  )
  const hemisphereMaterial = new MeshBasicMaterial({
    color: cubeColor,
    transparent: true,
    opacity: 0.2
  })

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
    const edgeMesh = new LineSegments(edgeGeometry, edgeMaterial)

    // Hemisphere
    const hemisphereMesh = new Mesh(hemisphereGeometry, hemisphereMaterial)

    // Group
    const faceGroup = new Group()
    faceGroup.add(frontMesh, backMesh, edgeMesh, hemisphereMesh)

    // Orientation
    faceGroup.lookAt(face.position)
    faceGroup.translateZ(1 / 2)

    // Enter / click / out
    faceGroup.enter = () => console.log('enter')
    faceGroup.click = () => console.log('click')
    faceGroup.out = () => console.log('out')

    // Add
    cube.add(faceGroup)
  })

  const localScene = new Scene()
  localScene.add(cube)

  // Camera
  const localCamera = new OrthographicCamera(-1.2, 1.2, 1.2, -1.2, -2, 2)

  // Raycatser
  const raycaster = new Raycaster()

  // Events
  document.addEventListener('mousemove', (e) => onMouseMove(e))

  const globalToLocal = ({ X, Y }) => {
    const size = new Vector2()
    renderer.getSize(size)

    const mouse = new Vector2()
    mouse.x = ((X + width - size.x) / width) * 2 - 1
    mouse.y = -((Y + height - size.y + offsetHeight) / height) * 2 + 1

    return mouse
  }

  const intersect = (mouse) => {
    raycaster.setFromCamera(mouse, localCamera)

    const intersects = raycaster.intersectObjects(
      localScene.children[0].children
    )

    console.log(intersects)
  }

  const onMouseMove = (event) => {
    const mouse = globalToLocal({ X: event.clientX, Y: event.clientY })
    intersect(mouse)
  }

  /**
   *
   */
  const render = () => {
    renderer.setViewport(offsetWidth, offsetHeight, width, height)
    localCamera.rotation.copy(camera.rotation)
    renderer.render(localScene, localCamera)
  }

  return { render }
}

export { NavigationHelper }
