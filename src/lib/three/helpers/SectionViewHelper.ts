/** @module Lib.Three.Helpers.SectionViewHelper */

import {
  Box3,
  BufferGeometry,
  Color,
  Curve,
  DoubleSide,
  Euler,
  Group,
  Line3,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Plane,
  PlaneGeometry,
  Raycaster,
  Scene,
  SphereGeometry,
  TubeGeometry,
  Vector2,
  Vector3,
  WebGLRenderer
} from 'three'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'

export interface ISectionViewHelper {
  getClippingPlane: () => Plane
  toggleVisible: () => void
  start: () => void
  stop: () => void
  toAxis: (normal: Vector3) => void
  flip: () => void

  dispose: () => void
}

export interface IController extends Omit<Group, 'type'> {
  type: Group['type'] | 'SectionViewHelper'
}

/**
 * Section view helper
 * @param renderer Renderer
 * @param scene Scene
 * @param camera Camera
 * @param controls Controls
 * @returns SectionViewHelper
 */
const SectionViewHelper = (
  renderer: WebGLRenderer,
  scene: Scene & { boundingBox: Box3 },
  camera: PerspectiveCamera,
  controls: TrackballControls
): ISectionViewHelper => {
  // Base color
  const baseColor = new Color('#fad114')

  // Highlight color
  const highlightColor = new Color('#E98A15')

  // Default normal
  const defaultNormal = new Vector3(-1, 0, 0)

  // Clipping plane
  const clippingPlane = new Plane(defaultNormal)

  // Dome rotation speed
  const domeRotationSpeed = 5

  // Arc rotation speed
  const arcRotationSpeed = 1

  // Camera directions
  const cameraDirections = {
    up: new Vector3(),
    forward: new Vector3(),
    right: new Vector3()
  }

  // Initial position
  const initialPosition = new Vector3()

  // Control intersection
  const controlIntersection = new Vector3()

  // Control rotation
  const controlRotation = new Euler()

  // Control rotation axis
  const controlRotationAxis = new Vector3()

  // Control mouse
  const controlMouse = new Vector2()

  // Control plane
  const controlPlane = new Plane()

  // Control offset
  const controlOffset = new Vector3()

  // Control normal
  const controlNormal = new Vector3()

  // Control line
  const controlLine = new Line3()

  // Control line direction
  const controlLineDirections = {
    up: new Vector3(),
    forward: new Vector3(),
    right: new Vector3()
  }

  // Raycaster
  const raycaster = new Raycaster()

  // Variables
  let lastAxis = defaultNormal
  let highlighted: Mesh<BufferGeometry, MeshBasicMaterial> | undefined
  let isDown: boolean
  let control: Mesh

  // Controller
  const controller: IController = new Group()
  controller.type = 'SectionViewHelper'
  controller.visible = false
  scene.add(controller)

  /**
   * Build plane
   */
  const buildPlane = (): void => {
    const geometry = new PlaneGeometry(1, 1)
    const material = new MeshBasicMaterial({
      color: baseColor,
      side: DoubleSide,
      transparent: true,
      opacity: 0.5
    })
    const plane = new Mesh(geometry, material)
    plane.type = 'Plane'

    controller.add(plane)
  }
  buildPlane()

  /**
   * Build dome
   */
  const buildDome = (): void => {
    const radius = 0.2
    const geometry = new SphereGeometry(radius, 32, 32, Math.PI, -Math.PI)
    const material = new MeshBasicMaterial({
      color: baseColor,
      side: DoubleSide,
      transparent: true,
      opacity: 0.5
    })
    const dome = new Mesh(geometry, material)
    dome.type = 'Dome'

    controller.add(dome)
  }
  buildDome()

  /**
   * Build arcs
   */
  const buildArcs = (): void => {
    const radius = 0.2

    // Arc curve
    class ArcCurve extends Curve<Vector3> {
      radius: number
      constructor(_radius: number) {
        super()
        this.radius = _radius
      }

      getPoint(t: number): Vector3 {
        return new Vector3().set(
          this.radius * Math.cos(Math.PI * t),
          this.radius * Math.sin(Math.PI * t),
          0
        )
      }
    }

    const curve = new ArcCurve(radius)
    {
      const geometry = new TubeGeometry(curve, 32, radius * 0.1, 32)
      const material = new MeshBasicMaterial({
        color: baseColor,
        side: DoubleSide,
        transparent: true,
        opacity: 0.5
      })
      const arcX = new Mesh(geometry, material)
      arcX.rotateX(Math.PI / 2)
      arcX.type = 'ArcX'

      controller.add(arcX)
    }

    {
      const geometry = new TubeGeometry(curve, 32, radius * 0.1, 32)
      const material = new MeshBasicMaterial({
        color: baseColor,
        side: DoubleSide,
        transparent: true,
        opacity: 0.5
      })
      const arcY = new Mesh(geometry, material)
      arcY.rotateX(Math.PI / 2)
      arcY.rotateY(Math.PI / 2)
      arcY.type = 'ArcY'

      controller.add(arcY)
    }
  }
  buildArcs()

  /**
   * Set scale
   */
  const setScale = (): void => {
    const size = new Vector3()
    scene.boundingBox.getSize(size)
    size.multiplyScalar(1.2)
    const maxSize = Math.max(Math.max(size.x, size.y), size.z)
    controller.scale.setScalar(maxSize)
  }

  /**
   * Set center
   */
  const setCenter = (): void => {
    const center = new Vector3()
    scene.boundingBox.getCenter(center)
    controller.position.copy(center)
  }

  /**
   * Get clipping plane
   * @returns Plane
   */
  const getClippingPlane = (): Plane => clippingPlane

  /**
   * Toggle visible
   */
  const toggleVisible = (): void => {
    const visible = controller.visible
    controller.visible = !visible
  }

  /**
   * Start
   */
  const start = () => {
    renderer.localClippingEnabled = true

    // Controller
    controller.visible = true
    setScale()
    setCenter()
    const lookAt = new Vector3().copy(controller.position).sub(defaultNormal)
    controller.lookAt(lookAt)

    // Clipping plane
    clippingPlane.setFromNormalAndCoplanarPoint(
      defaultNormal,
      controller.position
    )
  }

  /**
   * Stop
   */
  const stop = () => {
    renderer.localClippingEnabled = false

    controller.visible = false
  }

  /**
   * To axis
   * @param normal Normal
   */
  const toAxis = (normal: Vector3): void => {
    setCenter()

    if (lastAxis.equals(normal)) {
      flip()
      return
    }
    // Controllers
    const lookAt = new Vector3().copy(controller.position).sub(normal)
    controller.lookAt(lookAt)

    // Clipping plane
    clippingPlane.setFromNormalAndCoplanarPoint(normal, controller.position)

    lastAxis.copy(normal)
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
   * Dispose
   */
  const dispose = () => {
    controller.traverse((child) => {
      if (
        child.type === 'Plane' ||
        child.type === 'Dome' ||
        child.type === 'ArcX' ||
        child.type === 'ArcY'
      ) {
        const mesh = child as Mesh<BufferGeometry, MeshBasicMaterial>
        mesh.geometry.dispose()
        mesh.material.dispose()
      }
    })

    renderer.domElement.removeEventListener('pointermove', onMouseMove)
    renderer.domElement.removeEventListener('pointerdown', onMouseDown)
    renderer.domElement.removeEventListener('pointerup', onMouseUp)
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
   * Highlight
   * @param mesh Mesh
   */
  const highlight = (mesh?: Mesh<BufferGeometry, MeshBasicMaterial>): void => {
    if (highlighted) {
      highlighted.material.color.set(baseColor)
    }

    highlighted = mesh

    if (mesh) {
      mesh.material.color.set(highlightColor)
    }
  }

  /**
   * Enable controls
   */
  const enableControls = (): void => {
    controls.enabled = true
  }

  /**
   * Disable controls
   */
  const disableControls = (): void => {
    controls.enabled = false
  }

  /**
   * Set camera directions
   */
  const setCameraDirections = (): void => {
    camera.getWorldDirection(cameraDirections.forward)
    cameraDirections.forward.normalize()
    cameraDirections.up.copy(camera.up).normalize()
    cameraDirections.right
      .crossVectors(cameraDirections.up, cameraDirections.forward)
      .normalize()
  }

  /**
   * Update clipping plane
   */
  const updateClippingPlane = () => {
    const normal = new Vector3(0, 0, 1)
      .applyQuaternion(controller.quaternion)
      .multiplyScalar(-1)
    clippingPlane.setFromNormalAndCoplanarPoint(normal, controller.position)
  }

  /**
   * On mouse move
   * @param event Event
   */
  const onMouseMove = (event: MouseEvent): void => {
    if (!controller.visible) return

    const mouse = globalToLocal(event)
    raycaster.setFromCamera(mouse, camera)
    if (isDown) {
      // Move
      const intersection = new Vector3()
      raycaster.ray.intersectPlane(controlPlane, intersection)

      if (control.type === 'Plane') planeMove(intersection)
      else if (control.type === 'Dome') domeMove(mouse)
      else arcMove(intersection)

      updateClippingPlane()
    } else {
      // Highlight
      const intersects = raycaster.intersectObject(controller)
      if (intersects.length) {
        disableControls()

        control = intersects[0].object as Mesh
        highlight(control as Mesh<BufferGeometry, MeshBasicMaterial>)

        controlIntersection.copy(intersects[0].point)
        setCameraDirections()
      } else {
        control = null
        highlight()
        enableControls()
      }
    }
  }

  /**
   * Plane control
   */
  const planeControl = () => {
    // Control plane
    controlPlane.setFromNormalAndCoplanarPoint(
      cameraDirections.forward,
      controlIntersection
    )

    // Position
    initialPosition.copy(controller.position)

    // Initial intersection
    const intersection = new Vector3()
    raycaster.ray.intersectPlane(controlPlane, intersection)

    // Control offset
    controlOffset.copy(intersection).sub(initialPosition)

    // Control normal
    controlNormal.copy(controlOffset).normalize()

    // Control line
    controlLine.set(
      initialPosition,
      new Vector3().copy(initialPosition).add(clippingPlane.normal)
    )
  }

  /**
   * Plane move
   * @param point Point
   */
  const planeMove = (point: Vector3): void => {
    // Translate
    point.sub(controlOffset)
    const controlPoint = new Vector3()
    controlLine.closestPointToPoint(point, false, controlPoint)
    controller.position.copy(controlPoint)
  }

  /**
   * Dome control
   * @param mouse Mouse
   */
  const domeControl = (mouse: Vector2): void => {
    // Rotation
    controlRotation.copy(controller.rotation)

    // Mouse
    controlMouse.copy(mouse)
  }

  /**
   * Dome move
   * @param mouse Mouse
   */
  const domeMove = (mouse: Vector2): void => {
    // Rotation
    controller.rotation.copy(controlRotation)
    controller.rotateOnWorldAxis(
      cameraDirections.up,
      -(controlMouse.x - mouse.x) * domeRotationSpeed
    )
    controller.rotateOnWorldAxis(
      cameraDirections.right,
      -(controlMouse.y - mouse.y) * domeRotationSpeed
    )
  }

  /**
   * Arc control
   */
  const arcControl = (): void => {
    // Rotation axis
    control.getWorldDirection(controlRotationAxis)

    // Rotation
    controlRotation.copy(controller.rotation)

    // Control offset
    controlOffset.copy(controlIntersection).sub(controller.position)

    // Control normal
    controlNormal.copy(controlOffset).normalize()

    // Control line directions
    controlLineDirections.up.copy(controlNormal)
    controlLineDirections.right.copy(controlRotationAxis)
    controlLineDirections.forward.crossVectors(
      controlLineDirections.right,
      controlLineDirections.up
    )

    // Control line
    controlLine.set(
      controlIntersection,
      new Vector3().copy(controlIntersection).add(controlLineDirections.forward)
    )

    // Control plane
    controlPlane.setFromNormalAndCoplanarPoint(
      cameraDirections.forward,
      controlIntersection
    )
  }

  /**
   * Arc move
   * @param point Point
   */
  const arcMove = (point: Vector3): void => {
    // Distance to target
    const distanceToTarget = controls.object.position.distanceTo(
      controls.target
    )

    const controlPoint = new Vector3()
    controlLine.closestPointToPoint(point, false, controlPoint)

    const distance = controlIntersection.distanceTo(controlPoint)

    controlPoint.sub(controlIntersection)
    const controlCross = new Vector3()
      .copy(controlNormal)
      .cross(controlPoint)
      .normalize()
    const sign = Math.sign(controlRotationAxis.dot(controlCross))

    const rotation =
      (sign * distance * arcRotationSpeed) / (distanceToTarget / 100)

    controller.rotation.copy(controlRotation)
    controller.rotateOnWorldAxis(controlRotationAxis, rotation)
  }

  /**
   * Set control
   * @param mouse Mouse
   */
  const setControl = (mouse: Vector2): void => {
    switch (control.type) {
      case 'Plane':
        planeControl()
        break
      case 'Dome':
        domeControl(mouse)
        break
      case 'ArcX':
        arcControl()
        break
      case 'ArcY':
        arcControl()
        break
      default:
        break
    }
  }

  /**
   * On mouse down
   */
  const onMouseDown = (event: MouseEvent): void => {
    if (!controller.visible) return

    if (control) {
      isDown = true

      const mouse = globalToLocal(event)
      setControl(mouse)
    }
  }

  /**
   * On mouse up
   */
  const onMouseUp = (): void => {
    if (!controller.visible) return

    isDown = false
    highlight()
  }

  renderer.domElement.addEventListener('pointermove', onMouseMove)
  renderer.domElement.addEventListener('pointerdown', onMouseDown)
  renderer.domElement.addEventListener('pointerup', onMouseUp)

  return { getClippingPlane, toggleVisible, start, stop, toAxis, flip, dispose }
}

export { SectionViewHelper }
