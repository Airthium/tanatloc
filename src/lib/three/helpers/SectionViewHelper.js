import {
  Color,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  Plane,
  PlaneGeometry,
  Raycaster,
  SphereGeometry,
  TorusGeometry,
  Vector2,
  Vector3
} from 'three/build/three.module'

const SectionViewHelper = (renderer, camera, scene, controls) => {
  const baseColor = new Color('orange')
  const borderColor = new Color('darkblue')
  const hoverColor = new Color('lightgreen')

  const clippingPlane = new Plane(new Vector3(0, 0, -1))

  const buildPlane = () => {
    const geometry = new PlaneGeometry()
    const material = new MeshBasicMaterial({
      color: baseColor,
      side: DoubleSide,
      transparent: true,
      opacity: 0.5
    })
    const mesh = new Mesh(geometry, material)

    return mesh
  }

  const buildArcs = () => {
    const geometry1 = new TorusGeometry(0.25, 0.05, 32, 32, Math.PI)
    const material1 = new MeshBasicMaterial({
      color: baseColor,
      side: DoubleSide,
      transparent: true,
      opacity: 0.5
    })
    const mesh1 = new Mesh(geometry1, material1)
    mesh1.rotateX(Math.PI / 2)

    const geometry2 = new TorusGeometry(0.25, 0.05, 32, 32, Math.PI)
    const material2 = new MeshBasicMaterial({
      color: baseColor,
      side: DoubleSide,
      transparent: true,
      opacity: 0.5
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
      opacity: 0.5
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

    const normal = new Vector3(0, 0, -1)

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

    // Clipping plane
    clippingPlane.setFromNormalAndCoplanarPoint(normal, controllers.position)

    // Look at
    normal.multiplyScalar(-1)
    const lookAt = new Vector3().copy(controllers.position).add(normal)
    controllers.lookAt(lookAt)
  }

  const flip = () => {
    // Controllers
    controllers.rotateX(Math.PI)

    // Clipping plane
    const normal = clippingPlane.normal.multiplyScalar(-1)
    clippingPlane.setFromNormalAndCoplanarPoint(normal, controllers.position)
  }

  const raycaster = new Raycaster()
  let currentlyHighlighted = null
  let previouslyHighlited = null
  let isDown = false

  /**
   *  Global coordinates to local [-1, 1]^2
   * @param {Object} event Event
   */
  const globalToLocal = ({ X, Y }) => {
    const parentSize = new Vector2()
    renderer.getSize(parentSize)

    const mouse = new Vector2()
    mouse.x = (X / parentSize.x) * 2 - 1
    mouse.y = -(Y / parentSize.y) * 2 + 1

    return mouse
  }

  const onMouseDown = () => {
    if (!controllers.visible) return
    if (!currentlyHighlighted) return

    controls.enabled = false

    isDown = true
  }

  const onMouseMove = (event) => {
    if (!controllers.visible) return

    const mouse = globalToLocal({ X: event.clientX, Y: event.clientY })
    raycaster.setFromCamera(mouse, camera)

    if (isDown) {
      // TODO
    } else {
      const intersects = raycaster.intersectObjects(controllers.children)
      if (intersects.length > 0) {
        previouslyHighlited = currentlyHighlighted
        console.log(previouslyHighlited)
        unhighlight()

        currentlyHighlighted = intersects[0].object
        console.log(currentlyHighlighted)
        higlight()
      } else {
        previouslyHighlited = currentlyHighlighted
        unhighlight()

        currentlyHighlighted = null
      }
    }
  }

  const onMouseUp = () => {
    isDown = false

    controls.enabled = true
    controls.stop()
  }

  const higlight = () => {
    if (currentlyHighlighted) currentlyHighlighted.material.color = hoverColor
  }

  const unhighlight = () => {
    if (previouslyHighlited) previouslyHighlited.material.color = baseColor
  }

  renderer.domElement.addEventListener('mousemove', onMouseMove)
  renderer.domElement.addEventListener('mousedown', onMouseDown)
  renderer.domElement.addEventListener('mouseup', onMouseUp)

  const dispose = () => {
    // Event listeners
    renderer.domElement.removeEventListener('mousemove', onMouseMove)
    renderer.domElement.removeEventListener('mousedown', onMouseDown)
    renderer.domElement.removeEventListener('mouseup', onMouseUp)

    // Meshes
    controllers.children.forEach((child) => {
      child.geometry.dispose()
      child.material.dispose()
    })
  }

  return {
    getClippingPlane,
    start,
    update,
    toggleVisible,
    toAxis,
    flip,
    stop,
    dispose
  }
}

export { SectionViewHelper }
