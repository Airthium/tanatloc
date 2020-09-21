import { HighlightFilled } from '@ant-design/icons'
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

import { TransformControls } from 'three/examples/jsm/controls/TransformControls'

/**
 * SectionViewHelper
 * @param {Object} renderer Renderer
 * @param {Object} scene Scene
 * @param {Object} camera Camera
 * @param {Object} controls Controls
 */
const SectionViewHelper = (renderer, scene, camera, controls) => {
  // Base color
  const baseColor = new Color('orange')
  // Hover color
  const hoverColor = new Color('lightgreen')

  // Clipping plane
  const clippingPlane = new Plane(new Vector3(0, 0, -1))

  // Transform controls
  const transformControls = new TransformControls(camera, renderer.domElement)
  transformControls.enabled = false
  scene.add(transformControls)

  /**
   * Build plane
   */
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

  // /**
  //  * Build arcs
  //  */
  // const buildArcs = () => {
  //   const geometry1 = new TorusGeometry(0.25, 0.05, 32, 32, Math.PI)
  //   const material1 = new MeshBasicMaterial({
  //     color: baseColor,
  //     side: DoubleSide,
  //     transparent: true,
  //     opacity: 0.5
  //   })
  //   const mesh1 = new Mesh(geometry1, material1)
  //   mesh1.type = 'SectionViewHelper-ArcX'
  //   mesh1.rotateX(Math.PI / 2)

  //   const geometry2 = new TorusGeometry(0.25, 0.05, 32, 32, Math.PI)
  //   const material2 = new MeshBasicMaterial({
  //     color: baseColor,
  //     side: DoubleSide,
  //     transparent: true,
  //     opacity: 0.5
  //   })
  //   const mesh2 = new Mesh(geometry2, material2)
  //   mesh2.rotateX(Math.PI / 2)
  //   mesh2.rotateY(Math.PI / 2)
  //   mesh2.type = 'SectionViewHelper-ArcY'

  //   return [mesh1, mesh2]
  // }

  // /**
  //  * Build dome
  //  */
  // const buildDome = () => {
  //   const geometry = new SphereGeometry(0.15, 32, 32, Math.PI, -Math.PI)
  //   const material = new MeshBasicMaterial({
  //     color: baseColor,
  //     side: DoubleSide,
  //     transparent: true,
  //     opacity: 0.5
  //   })
  //   const mesh = new Mesh(geometry, material)
  //   mesh.type = 'SectionViewHelper-Dome'

  //   return mesh
  // }

  // const controllers = new Group()
  // const planeController = buildPlane()
  // const arcControllers = buildArcs()
  // const domeController = buildDome()

  // controllers.add(planeController)
  // controllers.add(...arcControllers)
  // controllers.add(domeController)
  // controllers.visible = false
  // controllers.type = 'SectionViewHelper'
  const controller = buildPlane()
  controller.visible = false
  controller.type = 'SectionViewHelper'

  // scene.add(controllers)
  scene.add(controller)

  /**
   * Get clipping plane
   */
  const getClippingPlane = () => {
    return clippingPlane
  }

  /**
   * Start
   */
  const start = () => {
    controller.visible = true
    renderer.localClippingEnabled = true

    // Set center
    const center = new Vector3()
    scene.boundingBox.getCenter(center)
    controller.position.copy(center)

    const normal = new Vector3(0, 0, -1)

    // Set scale
    const size = new Vector3()
    scene.boundingBox.getSize(size)
    const maxSize = Math.max(size.x, size.y, size.z)
    controller.scale.setScalar(maxSize * 1.2)

    // Clipping plane
    clippingPlane.setFromNormalAndCoplanarPoint(normal, controller.position)

    // // Transform controls
    // transformControls.enabled = true
    // transformControls.attach(planeController)
    // transformControls.setMode('rotate')

    // controls.enabled = false
  }

  /**
   * Stop
   */
  const stop = () => {
    controller.visible = false
    renderer.localClippingEnabled = false
  }

  /**
   * Toogle visible
   */
  const toggleVisible = () => {
    const visible = controller.visible
    controller.visible = !visible
  }

  /**
   * To axis
   * @param {Object} normal Normal
   */
  const toAxis = (normal) => {
    // Set center
    const center = new Vector3()
    scene.boundingBox.getCenter(center)
    controller.position.copy(center)

    // Clipping plane
    clippingPlane.setFromNormalAndCoplanarPoint(normal, controller.position)

    // Look at
    normal.multiplyScalar(-1)
    const lookAt = new Vector3().copy(controller.position).add(normal)
    controller.lookAt(lookAt)
  }

  /**
   * Flip
   */
  const flip = () => {
    // Controllers
    controller.rotateX(Math.PI)

    // Clipping plane
    const normal = clippingPlane.normal.multiplyScalar(-1)
    clippingPlane.setFromNormalAndCoplanarPoint(normal, controller.position)
  }

  const raycaster = new Raycaster()
  // let currentlyHighlighted = null
  // let intersectionPoint = null
  // let previouslyHighlited = null
  // let isDown = false

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

  // /**
  //  * Mouse down
  //  */
  // const onMouseDown = () => {
  //   if (!controllers.visible) return
  //   if (!currentlyHighlighted) return

  //   controls.enabled = false
  //   transformControls.enabled = true
  //   transformControls.attach(currentlyHighlighted)

  //   // if (currentlyHighlighted.type === 'SectionViewHelper-Plane')
  //   //   transformControls.setMode('translate')

  //   isDown = true
  // }

  /**
   * Mouse move
   * @param {Object} event Event
   */
  const onMouseMove = (event) => {
    if (!controller.visible) return

    const mouse = globalToLocal({ X: event.clientX, Y: event.clientY })
    raycaster.setFromCamera(mouse, camera)

    const intersects = raycaster.intersectObject(controller)
    if (intersects.length > 0) {
      highlight()
      transformStart()
    } else {
      unhighlight()
      transformStop()
    }
  }

  // TODO button (switch?) to drag or to rotate ?

  const transformStart = () => {
    controls.enabled = false

    transformControls.enabled = true
    transformControls.attach(controller)
  }

  const transformStop = () => {
    controls.enabled = true
    controls.stop()

    transformControls.enabled = false
    transformControls.detach()
  }

  // /**
  //  * Mouse up
  //  */
  // const onMouseUp = () => {
  //   isDown = false

  //   controls.enabled = true
  //   controls.stop()

  //   transformControls.enabled = false
  // }

  /**
   * Highliht
   */
  const highlight = () => {
    controller.material.color = hoverColor
  }

  /**
   * Unhighlight
   */
  const unhighlight = () => {
    controller.material.color = baseColor
  }

  renderer.domElement.addEventListener('mousemove', onMouseMove)
  // renderer.domElement.addEventListener('mousedown', onMouseDown)
  // renderer.domElement.addEventListener('mouseup', onMouseUp)

  /**
   * Dispose
   */
  const dispose = () => {
    // // Event listeners
    // renderer.domElement.removeEventListener('mousemove', onMouseMove)
    // renderer.domElement.removeEventListener('mousedown', onMouseDown)
    // renderer.domElement.removeEventListener('mouseup', onMouseUp)

    // Meshes
    controller.geometry.dispose()
    controller.material.dispose()
  }

  return {
    getClippingPlane,
    start,
    toggleVisible,
    toAxis,
    flip,
    stop,
    dispose
  }
}

export { SectionViewHelper }
