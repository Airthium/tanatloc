import {
  Color,
  DoubleSide,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  Plane,
  PlaneGeometry,
  Raycaster,
  SphereGeometry,
  TorusGeometry,
  Vector3,
  WireframeGeometry
} from 'three/build/three.module'

const SectionViewHelper = (renderer, camera, scene, controls) => {
  const baseColor = new Color('orange')
  const borderColor = new Color('darkblue')
  const hoverColor = new Color('lightgreen')

  const clippingPlane = new Plane(new Vector3(0, 0, 1))

  const buildPlane = () => {
    const geometry = new PlaneGeometry()
    const material = new MeshBasicMaterial({
      color: baseColor,
      side: DoubleSide,
      transparent: true,
      opacity: 0.8
    })
    const mesh = new Mesh(geometry, material)

    const borderGeometry = new WireframeGeometry(geometry)
    const borderMaterial = new LineBasicMaterial({
      color: borderColor,
      transparent: true,
      opacity: 0.8
    })
    const border = new LineSegments(borderGeometry, borderMaterial)
    mesh.add(border)

    return mesh
  }

  const buildArcs = () => {
    const geometry1 = new TorusGeometry(0.25, 0.05, 32, 32, Math.PI)
    const material1 = new MeshBasicMaterial({
      color: baseColor,
      side: DoubleSide,
      transparent: true,
      opacity: 0.8
    })
    const mesh1 = new Mesh(geometry1, material1)
    mesh1.rotateX(Math.PI / 2)

    const geometry2 = new TorusGeometry(0.25, 0.05, 32, 32, Math.PI)
    const material2 = new MeshBasicMaterial({
      color: baseColor,
      side: DoubleSide,
      transparent: true,
      opacity: 0.8
    })
    const mesh2 = new Mesh(geometry2, material2)
    mesh2.rotateX(Math.PI / 2)
    mesh2.rotateY(Math.PI / 2)

    return [mesh1, mesh2]
  }

  const buildDome = () => {
    const geometry = new SphereGeometry(0.15, 32, 32, Math.PI, -Math.PI)
    const material = new MeshBasicMaterial({
      color: baseColor,
      side: DoubleSide,
      transparent: true,
      opacity: 0.8
    })
    const mesh = new Mesh(geometry, material)

    return mesh
  }

  const controllers = new Group()
  const planeController = buildPlane()
  const arcControllers = buildArcs()
  const domeController = buildDome()

  controllers.add(planeController)
  controllers.add(...arcControllers)
  controllers.add(domeController)
  controllers.visible = false
  controllers.type = 'SectionViewHelper'

  scene.add(controllers)

  const getClippingPlane = () => {
    return clippingPlane
  }

  const start = () => {
    controllers.visible = true
    renderer.localClippingEnabled = true
    update()
  }

  const update = () => {
    // Set center
    const center = new Vector3()
    scene.boundingBox.getCenter(center)
    controllers.position.copy(center)

    const normal = new Vector3(0, 0, 1)

    // Set scale
    const size = new Vector3()
    scene.boundingBox.getSize(size)
    const maxSize = Math.max(size.x, size.y, size.z)
    controllers.scale.setScalar(maxSize * 1.2)

    // Clipping plane
    clippingPlane.setFromNormalAndCoplanarPoint(normal, controllers.position)
  }

  const stop = () => {
    controllers.visible = false
    renderer.localClippingEnabled = false
  }

  const toggleVisible = () => {
    const visible = controllers.visible
    controllers.visible = !visible
  }

  const toAxis = (normal) => {
    // Set center
    const center = new Vector3()
    scene.boundingBox.getCenter(center)
    controllers.position.copy(center)

    // Look at
    const lookAt = new Vector3().copy(controllers.position).add(normal)
    controllers.lookAt(lookAt)

    // Clipping plane
    clippingPlane.setFromNormalAndCoplanarPoint(normal, controllers.position)
  }

  const flip = () => {
    // Controllers
    controllers.rotateX(Math.PI)

    // Clipping plane
    const normal = clippingPlane.normal.multiplyScalar(-1)
    clippingPlane.setFromNormalAndCoplanarPoint(normal, controllers.position)
  }

  //   const raycaster = new Raycaster()
  //   const onMouseMove = () => {}

  //   window.addEventListener('move', onMouseMove)

  return { getClippingPlane, start, update, toggleVisible, toAxis, flip, stop }
}

export { SectionViewHelper }
