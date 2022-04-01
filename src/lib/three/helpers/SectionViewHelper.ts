import {
  Box3,
  BufferGeometry,
  Color,
  Curve,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  Object3D,
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

  // Raycaster
  const raycaster = new Raycaster()

  // Variables
  let lastAxis = defaultNormal
  let highlighted: Mesh<BufferGeometry, MeshBasicMaterial> | undefined

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
    const radius = 0.3

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
    controller.scale.copy(size)
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
    // controls.reset()
  }

  /**
   * Disable controls
   */
  const disableControls = (): void => {
    controls.enabled = false
  }

  /**
   * On mouse move
   * @param event Event
   */
  const onMouseMove = (event: MouseEvent): void => {
    if (!controller.visible) return

    const mouse = globalToLocal(event)
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObject(controller)
    if (intersects.length) {
      highlight(intersects[0].object as Mesh<BufferGeometry, MeshBasicMaterial>)
      disableControls()
    } else {
      highlight()
      enableControls()
    }
  }

  /**
   * On mouse down
   */
  const onMouseDown = (): void => {
    if (!controller.visible) return

    if (highlighted) {
      const type = highlighted.type
      console.log(type)
    }
  }

  /**
   * On mouse up
   */
  const onMouseUp = (): void => {
    if (!controller.visible) return
  }

  renderer.domElement.addEventListener('pointermove', onMouseMove)
  renderer.domElement.addEventListener('pointerdown', onMouseDown)
  renderer.domElement.addEventListener('pointerup', onMouseUp)

  return { getClippingPlane, toggleVisible, start, stop, toAxis, flip, dispose }
}

export { SectionViewHelper }
