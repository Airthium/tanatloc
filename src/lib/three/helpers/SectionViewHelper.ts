/** @module Lib.Three.Helpers.SectionViewHelper */

import {
  BackSide,
  Color,
  Curve,
  DoubleSide,
  Euler,
  FrontSide,
  Group,
  Line3,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  Plane,
  PlaneGeometry,
  SphereGeometry,
  TubeGeometry,
  Vector2,
  Vector3,
  WireframeGeometry
} from 'three'

export interface ISectionViewHelper {
  getClippingPlane: () => Plane
  start: () => void
  toggleVisible: () => void
  toAxis: (normal: Vector3) => void
  flip: () => void
  setMode: (mode: 'translate' | 'rotate' | 'scale') => void
  stop: () => void
  dispose: () => void
}

/**
 * SectionViewHelper
 * @memberof Lib.Three.Helpers
 * @param renderer Renderer
 * @param scene Scene
 * @param camera Camera
 * @param controls Controls
 */
const OldSectionViewHelper = (
  renderer: WebGLRenderer,
  scene: Scene & { boundingBox: Box3 },
  camera: PerspectiveCamera,
  controls: TrackballControls
): ISectionViewHelper => {
  // Base color
  const baseColor = new Color('orange')
  // Ray caster
  const raycaster = new Raycaster()
  // Down
  let isDown = false
  // Clipping plane
  const clippingPlane = new Plane(new Vector3(0, 0, 1))

  // Transform controls
  const transformControls = new TransformControls(camera, renderer.domElement)
  transformControls.enabled = false
  scene.add(transformControls)

  /**
   * Build plane
   */
  const buildPlane = (): Mesh<PlaneGeometry, MeshBasicMaterial> & {
    clippingPlane: Plane
  } => {
    const geometry = new PlaneGeometry()
    const material = new MeshBasicMaterial({
      color: baseColor,
      side: DoubleSide,
      transparent: true,
      opacity: 0.5
    })
    const mesh = new Mesh(geometry, material) as Mesh<
      PlaneGeometry,
      MeshBasicMaterial
    > & { clippingPlane: Plane }
    mesh.clippingPlane = clippingPlane

    return mesh
  }

  const controller = buildPlane()
  controller.visible = false
  controller.type = 'SectionViewHelper'

  scene.add(controller)

  /**
   * Get clipping plane
   */
  const getClippingPlane = (): Plane => {
    return clippingPlane
  }

  /**
   * Start
   */
  const start = (): void => {
    controller.visible = true
    renderer.localClippingEnabled = true

    const normal = new Vector3(0, 0, 1)

    // LookAt
    controller.position.copy(new Vector3(0, 0, 0))
    controller.lookAt(normal)

    // Set center
    const center = new Vector3()
    scene.boundingBox.getCenter(center)
    controller.position.copy(center)

    // Set scale
    const size = new Vector3()
    scene.boundingBox.getSize(size)
    const maxSize = Math.max(size.x, size.y, size.z)
    controller.scale.setScalar(maxSize * 1.2)

    // Clipping plane
    normal.multiplyScalar(-1)
    clippingPlane.setFromNormalAndCoplanarPoint(normal, controller.position)
  }

  /**
   * Stop
   */
  const stop = (): void => {
    controller.visible = false
    renderer.localClippingEnabled = false

    transformStop()
  }

  /**
   * Toogle visible
   */
  const toggleVisible = (): void => {
    const visible = controller.visible
    controller.visible = !visible

    if (!controller.visible) {
      transformStop()
    }
  }

  /**
   * To axis
   * @param normal Normal
   */
  const toAxis = (normal: Vector3): void => {
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
  const flip = (): void => {
    // Controllers
    controller.rotateX(Math.PI)

    // Clipping plane
    const normal = clippingPlane.normal.multiplyScalar(-1)
    clippingPlane.setFromNormalAndCoplanarPoint(normal, controller.position)
  }

  /**
   * Set mode
   * @param mode Mode
   */
  const setMode = (mode: 'translate' | 'rotate' | 'scale'): void => {
    transformControls.setMode(mode)
  }

  /**
   *  Global coordinates to local [-1, 1]^2
   * @param event Event
   */
  const globalToLocal = (event: MouseEvent) => {
    const node = event.target as HTMLElement
    const rect = node.getBoundingClientRect()

    const X = event.clientX - rect.left
    const Y = event.clientY - rect.top

    const mouse = new Vector2()
    mouse.x = (X / rect.width) * 2 - 1
    mouse.y = -(Y / rect.height) * 2 + 1

    return mouse
  }

  /**
   * Mouse down
   */
  const onMouseDown = (): void => {
    if (!controller.visible) return

    isDown = true
  }

  /**
   * Mouse move
   * @param event Event
   */
  const onMouseMove = (event: MouseEvent): void => {
    if (!controller.visible) return
    if (isDown) return

    const mouse = globalToLocal(event)
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObject(controller)
    if (intersects.length > 0) {
      if (!transformControls.enabled) transformStart()
    } else {
      if (transformControls.enabled) transformStop()
    }
  }

  /**
   * Start transform (stop controls)
   */
  const transformStart = (): void => {
    controls.enabled = false

    transformControls.enabled = true
    transformControls.attach(controller)
  }

  /**
   * Stop transform (start controls)
   */
  const transformStop = (): void => {
    controls.enabled = true

    transformControls.enabled = false
    transformControls.detach()
  }

  /**
   * Mouse up
   */
  const onMouseUp = (): void => {
    if (!controller.visible) return
    isDown = false

    if (!transformControls.enabled) return

    const normal = new Vector3(0, 0, 1)
    normal.applyQuaternion(controller.quaternion).multiplyScalar(-1)

    clippingPlane.setFromNormalAndCoplanarPoint(normal, controller.position)
  }

  // Event listener
  renderer.domElement.addEventListener('mousedown', onMouseDown)
  renderer.domElement.addEventListener('mousemove', onMouseMove)
  renderer.domElement.addEventListener('mouseup', onMouseUp)

  /**
   * Dispose
   */
  const dispose = (): void => {
    // Event listener
    renderer.domElement.removeEventListener('mousedown', onMouseDown)
    renderer.domElement.removeEventListener('mousemove', onMouseMove)
    renderer.domElement.removeEventListener('mouseup', onMouseUp)

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
    setMode,
    stop,
    dispose
  }
}

// export { SectionViewHelper }

const SectionViewHelper = (renderer, scene, camera, controls) => {
  // Speed
  const arcRotationSpeed = 1
  const domeRotationSpeed = 5

  // Scales
  const controlsScale = 5
  const planeScale = 1
  const handlesScale = 0.7
  const domeScale = 0.35

  // Base color
  const baseColor = new Color('orange')
  // Border color
  const borderColor = new Color('darkblue')
  // Hover color
  const hoverColor = new Color('lightgreen')

  // Clipping plane
  const clippingPlane = new Plane(new Vector3(1, 0, 0))

  // Variables
  let lastAxis = new Vector3()

  /**
   * buildPlane
   * @returns Plane
   */
  const buildPlane = (): Mesh => {
    const geometry = new PlaneGeometry(planeScale, planeScale)
    const material = new MeshBasicMaterial({
      color: baseColor,
      side: DoubleSide,
      transparent: true,
      opacity: 0.8
    })
    return new Mesh(geometry, material)
  }

  /**
   * Build dome
   * @returns Dome
   */
  const buildDome = (): Mesh => {
    const domeRadius = domeScale * 0.5
    const domeContourScale = 1.02
    const geometry = new SphereGeometry(domeRadius, 32, 32, -Math.PI, Math.PI)
    const material = new MeshBasicMaterial({
      color: baseColor,
      side: DoubleSide,
      transparent: true,
      opacity: 0.4
    })
    const mesh = new Mesh(geometry, material)
    mesh.rotateX(Math.PI)

    const borderMaterial = new MeshBasicMaterial({
      color: borderColor,
      side: BackSide,
      transparent: true,
      opacity: 0.4
    })
    const border = new Mesh(geometry, borderMaterial)
    border.scale.setScalar(domeContourScale)

    mesh.add(border)

    return mesh
  }

  /**
   * Build arcs
   * @returns Arcs
   */
  const buildArcs = () => {
    const arcRadius = handlesScale * 0.5
    const arcWidth = arcRadius * 0.1
    const arcContourScale = 1.1

    const group = []

    class ArcCurve extends Curve<Vector3> {
      radius: number
      constructor(radius: number) {
        super()
        this.radius = radius
      }

      getPoint(t: number): Vector3 {
        return new Vector3(
          Math.cos(Math.PI * t),
          Math.sin(Math.PI * t),
          0
        ).multiplyScalar(this.radius)
      }
    }
    const arcPath = new ArcCurve(arcRadius - arcWidth)

    const arcsRotate = [{ rotateY: 0 }, { rotateY: Math.PI / 2 }]
    arcsRotate.forEach((arcRotate) => {
      const geometry = new TubeGeometry(arcPath, 32, arcWidth, 32)
      const material = new MeshBasicMaterial({
        color: baseColor,
        side: FrontSide,
        transparent: true,
        opacity: 0.4
      })
      const mesh = new Mesh(geometry, material)
      mesh.rotateX(Math.PI / 2)
      mesh.rotateY(arcRotate.rotateY)

      const borderGeometry = new TubeGeometry(
        arcPath,
        32,
        arcWidth * arcContourScale,
        32
      )
      const borderMaterial = new MeshBasicMaterial({
        color: borderColor,
        side: BackSide,
        transparent: true,
        opacity: 0.4
      })
      const border = new Mesh(borderGeometry, borderMaterial)
      mesh.add(border)

      group.push(mesh)
    })

    return group
  }

  // Controllers
  const controllers = new Group()
  controllers.visible = false
  scene.add(controllers)

  // Plane
  const planeController = buildPlane()
  controllers.add(planeController)

  // Dome
  const domeController = buildDome()
  controllers.add(domeController)

  // Arcs
  const arcs = buildArcs()
  const arcXController = arcs[0]
  const arcYController = arcs[1]
  controllers.add(arcXController, arcYController)

  // let controllersLastValidPosition = new Vector3()
  // let controllersLastSnapAxis = new Vector3()

  // let controllerSelected = null

  // let controlPlane = new Plane()
  // let controlOffset = new Vector3()
  // let controlNormal = new Vector3()
  // let controlIntersection = new Vector3()
  // let controlIntersectionPoint = new Vector3()
  // let controlLine = new Line3()
  // controlLine.directions = {
  //   up: new Vector3(),
  //   forward: new Vector3(),
  //   right: new Vector3()
  // }
  // let controlRotationAxis = new Vector3()
  // let controlStartPoint = new Vector2()

  // let controlInitialIntersection = new Vector3()
  // let controlInitialPosition = new Vector3()
  // let controlInitialRotation = new Euler()

  // let bbLines = []

  // let mouseControl = false

  /**
   * Get clipping plane
   * @returns Clipping plane
   */
  const getClippingPlane = () => {
    return clippingPlane
  }

  /**
   * Toggle visible
   */
  const toggleVisible = (): void => {
    const visible = controllers.visible
    controllers.visible = !visible
  }

  /**
   * Start
   */
  const start = (): void => {
    controllers.visible = true
    renderer.localClippingEnabled = true

    const normal = new Vector3(0, 0, 1)

    // LookAt
    controllers.position.copy(new Vector3(0, 0, 0))
    controllers.lookAt(normal)

    // Set center
    const center = new Vector3()
    scene.boundingBox.getCenter(center)
    controllers.position.copy(center)

    // Set scale
    const size = new Vector3()
    scene.boundingBox.getSize(size)
    const maxSize = Math.max(size.x, size.y, size.z)
    controllers.scale.setScalar(maxSize * 1.2)

    // Clipping plane
    normal.multiplyScalar(-1)
    clippingPlane.setFromNormalAndCoplanarPoint(normal, controllers.position)
  }

  /**
   * Stop
   */
  const stop = (): void => {
    controllers.visible = false
    renderer.localClippingEnabled = false
  }

  const onMouseDown = () => {}

  const onMouseMove = () => {}

  const onMouseUp = () => {}

  // const rescale = () => {
  //   const distanceToTarget = controls.object.position.distanceTo(
  //     controls.target
  //   )
  //   controllers.scale.setScalar((distanceToTarget / 200) * controlsScale)
  // }

  // const setCenter = (center) => {
  //   controllers.position.copy(center)
  //   updateClippingPlane()
  // }

  // const haveControllerSelected = () => {
  //   return controllerSelected !== null
  // }

  // const haveMouseControl = () => {
  //   return mouseControl === true
  // }

  // const updateClippingPlane = () => {
  //   const normal = new Vector3(0, 0, 1)
  //     .applyQuaternion(controllers.quaternion)
  //     .multiplyScalar(-1)
  //   clippingPlane.setFromNormalAndCoplanarPoint(normal, controllers.position)

  //   if (scene.boundingBox.containsPoint(controllers.position))
  //     controllersLastValidPosition.copy(controllers.position)
  // }

  // const computeBounds = () => {
  //   const box = scene.boundingBox
  //   const bbMin = box.min
  //   const bbMax = box.max

  //   bbLines = []

  //   {
  //     const startPoint = new Vector3(bbMin.x, bbMin.y, bbMin.z)
  //     const endPoint = new Vector3(bbMin.x, bbMin.y, bbMax.z)
  //     const line = new Line3(startPoint, endPoint)
  //     bbLines.push(line)
  //   }
  //   {
  //     const startPoint = new Vector3(bbMin.x, bbMin.y, bbMin.z)
  //     const endPoint = new Vector3(bbMin.x, bbMax.y, bbMin.z)
  //     const line = new Line3(startPoint, endPoint)
  //     bbLines.push(line)
  //   }
  //   {
  //     const startPoint = new Vector3(bbMin.x, bbMin.y, bbMin.z)
  //     const endPoint = new Vector3(bbMax.x, bbMin.y, bbMin.z)
  //     const line = new Line3(startPoint, endPoint)
  //     bbLines.push(line)
  //   }

  //   {
  //     const startPoint = new Vector3(bbMax.x, bbMax.y, bbMin.z)
  //     const endPoint = new Vector3(bbMax.x, bbMax.y, bbMax.z)
  //     const line = new Line3(startPoint, endPoint)
  //     bbLines.push(line)
  //   }
  //   {
  //     const startPoint = new Vector3(bbMax.x, bbMax.y, bbMin.z)
  //     const endPoint = new Vector3(bbMax.x, bbMin.y, bbMin.z)
  //     const line = new Line3(startPoint, endPoint)
  //     bbLines.push(line)
  //   }
  //   {
  //     const startPoint = new Vector3(bbMax.x, bbMax.y, bbMin.z)
  //     const endPoint = new Vector3(bbMin.x, bbMax.y, bbMin.z)
  //     const line = new Line3(startPoint, endPoint)
  //     bbLines.push(line)
  //   }

  //   {
  //     const startPoint = new Vector3(bbMax.x, bbMin.y, bbMax.z)
  //     const endPoint = new Vector3(bbMax.x, bbMin.y, bbMin.z)
  //     const line = new Line3(startPoint, endPoint)
  //     bbLines.push(line)
  //   }
  //   {
  //     const startPoint = new Vector3(bbMax.x, bbMin.y, bbMax.z)
  //     const endPoint = new Vector3(bbMax.x, bbMax.y, bbMax.z)
  //     const line = new Line3(startPoint, endPoint)
  //     bbLines.push(line)
  //   }
  //   {
  //     const startPoint = new Vector3(bbMax.x, bbMin.y, bbMax.z)
  //     const endPoint = new Vector3(bbMin.x, bbMin.y, bbMax.z)
  //     const line = new Line3(startPoint, endPoint)
  //     bbLines.push(line)
  //   }

  //   {
  //     const startPoint = new Vector3(bbMin.x, bbMax.y, bbMax.z)
  //     const endPoint = new Vector3(bbMin.x, bbMax.y, bbMin.z)
  //     const line = new Line3(startPoint, endPoint)
  //     bbLines.push(line)
  //   }
  //   {
  //     const startPoint = new Vector3(bbMin.x, bbMax.y, bbMax.z)
  //     const endPoint = new Vector3(bbMin.x, bbMin.y, bbMax.z)
  //     const line = new Line3(startPoint, endPoint)
  //     bbLines.push(line)
  //   }
  //   {
  //     const startPoint = new Vector3(bbMin.x, bbMax.y, bbMax.z)
  //     const endPoint = new Vector3(bbMax.x, bbMax.y, bbMax.z)
  //     const line = new Line3(startPoint, endPoint)
  //     bbLines.push(line)
  //   }
  // }

  // const updateClippingPlaneMiddlePoint = () => {
  //   // Compute intersection with bounding box lines
  //   const intersectionPoints = []
  //   computeBounds()
  //   bbLines.forEach((line) => {
  //     if (clippingPlane.intersectsLine(line)) {
  //       const intersection = new Vector3()
  //       clippingPlane.intersectLine(line, intersection)
  //       intersectionPoints.push(intersection)
  //     }
  //   })

  //   if (intersectionPoints.length === 0) return null

  //   // Compute barycenter
  //   let baryCenter = new Vector3()
  //   intersectionPoints.forEach((point) => {
  //     baryCenter = baryCenter.add(point)
  //   })
  //   baryCenter = baryCenter.divideScalar(intersectionPoints.length)

  //   return baryCenter
  // }

  // const beginControls = (mouse, rayCaster) => {
  //   rayCaster.setFromCamera(mouse, camera)

  //   const intersects = rayCaster.intersectObjects(controllers.children)
  //   if (intersects.length === 0) {
  //     controllerSelected = null
  //     return null
  //   }

  //   controllerSelected = intersects[0].object
  //   if (!controllerSelected) return null

  //   controlIntersectionPoint = intersects[0].point

  //   updateObjectDirections(camera)

  //   switchControls(mouse, rayCaster)

  //   controls.noRotate = true
  //   controls.update()

  //   if (controllerSelected.material)
  //     controllerSelected.material.color = hoverColor

  //   mouseControl = true
  // }

  // const updateObjectDirections = (obj) => {
  //   if (!obj.directions)
  //     obj.directions = {
  //       up: new Vector3(),
  //       forward: new Vector3(),
  //       right: new Vector3()
  //     }
  //   obj.getWorldDirection(obj.directions.forward).normalize()
  //   obj.directions.up.copy(obj.up).normalize()
  //   obj.directions.right
  //     .crossVectors(obj.directions.up, obj.directions.forward)
  //     .normalize()
  // }

  // const switchControls = (mouse, rayCaster) => {
  //   if (controllerSelected === planeController) {
  //     planeControls(rayCaster)
  //   } else if (controllerSelected === arcXController) {
  //     arcsControls()
  //   } else if (controllerSelected === arcYController) {
  //     arcsControls()
  //   } else if (controllerSelected === domeController) {
  //     domeControls(mouse)
  //   }
  // }

  // const planeControls = (rayCaster) => {
  //   controlPlane.setFromNormalAndCoplanarPoint(
  //     camera.directions.forward,
  //     controlIntersectionPoint
  //   )
  //   rayCaster.ray.intersectPlane(controlPlane, controlIntersection) // intersection point on the control plane
  //   controlInitialPosition.copy(controllers.position)
  //   controlInitialIntersection.copy(controlIntersection)
  //   controlOffset.copy(controlIntersection).sub(controllers.position) // offset from grabing point
  //   controlNormal.copy(controlOffset).normalize()
  //   controlLine.set(
  //     controlInitialPosition,
  //     new Vector3().copy(controlInitialPosition).add(clippingPlane.normal)
  //   )
  // }

  // const arcsControls = () => {
  //   controlIntersection.copy(controlIntersectionPoint)
  //   controllerSelected.getWorldDirection(controlRotationAxis)

  //   controlInitialRotation.copy(controllers.rotation)
  //   controlInitialIntersection.copy(controlIntersection)
  //   controlOffset.copy(controlInitialIntersection).sub(controllers.position) // offset from grabing point
  //   controlNormal.copy(controlOffset).normalize()

  //   controlLine.directions.up.copy(controlNormal)
  //   controlLine.directions.right.copy(controlRotationAxis)
  //   controlLine.directions.forward.crossVectors(
  //     controlLine.directions.right,
  //     controlLine.directions.up
  //   )

  //   controlLine.set(
  //     controlInitialIntersection,
  //     new Vector3()
  //       .copy(controlInitialIntersection)
  //       .add(controlLine.directions.forward)
  //   )

  //   controlPlane.setFromNormalAndCoplanarPoint(
  //     camera.directions.forward,
  //     controlInitialIntersection
  //   )
  // }

  // const domeControls = (mouse) => {
  //   controlInitialRotation.copy(controllers.rotation)
  //   controlStartPoint.copy(mouse)
  // }

  // const moveControls = (mouse, rayCaster) => {
  //   rayCaster.setFromCamera(mouse, camera)

  //   const distanceToTarget = controls.object.position.distanceTo(
  //     controls.target
  //   )

  //   if (!controllerSelected) {
  //     // if no control is selected
  //     const intersects = rayCaster.intersectObjects(controllers.children)

  //     controllers.children.forEach((controller) => {
  //       if (controller.material) controller.material.color = baseColor
  //     })

  //     if (intersects.length > 0) {
  //       const controller = intersects[0].object
  //       if (controller.material) controller.material.color = hoverColor
  //       mouseControl = true
  //     } else {
  //       mouseControl = false
  //     }
  //   } else {
  //     // if a control is selected
  //     rayCaster.ray.intersectPlane(controlPlane, controlIntersection)

  //     if (controllerSelected === planeController) {
  //       controlIntersection.sub(controlOffset)
  //       const controlLinePoint = new Vector3()
  //       controlLine.closestPointToPoint(
  //         controlIntersection,
  //         false,
  //         controlLinePoint
  //       )
  //       controllers.position.copy(controlLinePoint)
  //     } else if (
  //       controllerSelected === arcXController ||
  //       controllerSelected === arcYController
  //     ) {
  //       const controlLinePoint = new Vector3()
  //       controlLine.closestPointToPoint(
  //         controlIntersection,
  //         false,
  //         controlLinePoint
  //       )

  //       const distance = controlInitialIntersection.distanceTo(controlLinePoint)

  //       controlLinePoint.sub(controlInitialIntersection)
  //       const controlCross = new Vector3()
  //         .copy(controlNormal)
  //         .cross(controlLinePoint)
  //         .normalize()
  //       const sign = Math.sign(controlRotationAxis.dot(controlCross))

  //       const rotation =
  //         (sign * distance * arcRotationSpeed) / (distanceToTarget / 100)

  //       controllers.rotation.copy(controlInitialRotation)
  //       controllers.rotateOnWorldAxis(controlRotationAxis, rotation)
  //     } else if (controllerSelected === domeController) {
  //       controllers.rotation.copy(controlInitialRotation)
  //       controllers.rotateOnWorldAxis(
  //         camera.directions.up,
  //         -(controlStartPoint.x - mouse.x) * domeRotationSpeed
  //       )
  //       controllers.rotateOnWorldAxis(
  //         camera.directions.right,
  //         -(controlStartPoint.y - mouse.y) * domeRotationSpeed
  //       )
  //     }

  //     updateClippingPlane()
  //     mouseControl = true

  //     if (clippingPlane.intersectsBox(scene.boundingBox))
  //       controlInitialPosition.copy(controllers.position)

  //     controllersLastSnapAxis.copy(new Vector3())
  //   }
  // }

  // const endControls = (noRotate) => {
  //   const center = updateClippingPlaneMiddlePoint()

  //   if (center) {
  //     controllers.position.copy(center)
  //   }

  //   if (!clippingPlane.intersectsBox(scene.boundingBox))
  //     controllers.position.copy(controlInitialPosition)

  //   updateClippingPlane()

  //   controllerSelected = null

  //   controls.noRotate = noRotate
  //   controls.update()

  //   controllers.children.forEach((controller) => {
  //     if (controller.material) controller.material.color = baseColor
  //   })

  //   mouseControl = false
  // }

  /**
   * To axis
   * @param normal Normal
   */
  const toAxis = (normal: Vector3): void => {
    if (lastAxis.equals(normal)) {
      // Flip
      flip()
    } else {
      // Set center
      const center = new Vector3()
      scene.boundingBox.getCenter(center)
      controllers.position.copy(center)

      // Clipping plane
      clippingPlane.setFromNormalAndCoplanarPoint(normal, controllers.position)
      lastAxis.copy(normal)

      // Look at
      normal.multiplyScalar(-1)
      const lookAt = new Vector3().copy(controllers.position).add(normal)
      controllers.lookAt(lookAt)
    }
  }

  /**
   * Flip
   */
  const flip = (): void => {
    // Controllers
    controllers.rotateX(Math.PI)

    // Clipping plane
    const normal = clippingPlane.normal.multiplyScalar(-1)
    clippingPlane.setFromNormalAndCoplanarPoint(normal, controllers.position)
  }

  /**
   * Dispose
   */
  const dispose = (): void => {
    // Event listener
    renderer.domElement.removeEventListener('mousedown', onMouseDown)
    renderer.domElement.removeEventListener('mousemove', onMouseMove)
    renderer.domElement.removeEventListener('mouseup', onMouseUp)

    // // Meshes
    // controller.geometry.dispose()
    // controller.material.dispose()
  }

  // Event listener
  renderer.domElement.addEventListener('mousedown', onMouseDown)
  renderer.domElement.addEventListener('mousemove', onMouseMove)
  renderer.domElement.addEventListener('mouseup', onMouseUp)

  return {
    getClippingPlane,
    toggleVisible,
    start,
    stop,
    toAxis,
    flip,
    dispose
  }
}

export { SectionViewHelper }
