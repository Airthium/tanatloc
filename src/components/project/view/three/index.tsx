/** @module Components.Project.View.Three */

import { useRouter } from 'next/router'
import {
  useRef,
  useState,
  useEffect,
  Dispatch,
  useCallback,
  useContext
} from 'react'
import { Button, Divider, Dropdown, Layout, Spin, Switch, Tooltip } from 'antd'
import {
  BorderlessTableOutlined,
  CompressOutlined,
  EyeInvisibleOutlined,
  FundProjectionScreenOutlined,
  LoadingOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  SelectOutlined,
  RadiusUprightOutlined,
  ScissorOutlined,
  StopOutlined,
  RetweetOutlined,
  TableOutlined,
  BgColorsOutlined
} from '@ant-design/icons'
import {
  AmbientLight,
  Box3,
  BufferAttribute,
  Float32BufferAttribute,
  Mesh,
  Object3D,
  PerspectiveCamera,
  PointLight,
  Scene,
  Sphere,
  Vector3,
  WebGLRenderer
} from 'three'
import { v4 } from 'uuid'

import { IFrontProject } from '@/api/index.d'
import { IGeometryPart } from '@/lib/index.d'

import useCustomEffect from '@/components/utils/useCustomEffect'

import { ErrorNotification } from '@/components/assets/notification'

import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import WebGL from 'three/examples/jsm/capabilities/WebGL'

import { AxisHelper } from '@/lib/three/helpers/AxisHelper'
import { NavigationHelper } from '@/lib/three/helpers/NavigationHelper'
import { GridHelper, IGridHelper } from '@/lib/three/helpers/GridHelper'
import {
  ISelectionHelper,
  SelectionHelper
} from '@/lib/three/helpers/SelectionHelper'
import {
  ISectionViewHelper,
  SectionViewHelper
} from '@/lib/three/helpers/SectionViewHelper'
import {
  ColorbarHelper,
  IColorbarHelper
} from '@/lib/three/helpers/ColorbarHelper'
import { IPointHelper, PointHelper } from '@/lib/three/helpers/PointHelper'

import { IPart, PartLoader } from '@/lib/three/loaders/PartLoader'

import { ISelectAction, SelectContext } from '@/context/select'
import {
  highlight,
  select,
  unhighlight,
  unselect,
  setPoint
} from '@/context/select/actions'

import AvatarAPI from '@/api/avatar'

import globalStyle from '@/styles/index.module.css'
import style from './index.module.css'

/**
 * Props
 */
export interface IProps {
  loading: boolean
  project: Pick<IFrontProject, 'id' | 'title'>
  parts: IGeometryPart[]
}

/**
 * Errors
 */
export const errors = {
  load: 'Error while loading part',
  snapshot: 'Error while taking snapshot',
  saveScreenshot: 'Unable to save screenshot'
}

/**
 * Zoom factor
 */
const zoomFactor = 0.01

/**
 * First zoom to fit
 */
let alreadyZoomToFit = false

/**
 * Compute scene bounding box
 * @param scene Scene
 */
export const _computeSceneBoundingSphere = (
  scene: Scene & { boundingBox?: Box3; boundingSphere?: Sphere }
): void => {
  const box = new Box3()
  scene.children.forEach((child) => {
    if (child.visible && child.type === 'Part') {
      const part = child as IPart
      const childBox: Box3 = part.boundingBox
      const min = new Vector3(
        Math.min(box.min.x, childBox.min.x),
        Math.min(box.min.y, childBox.min.y),
        Math.min(box.min.z, childBox.min.z)
      )
      const max = new Vector3(
        Math.max(box.max.x, childBox.max.x),
        Math.max(box.max.y, childBox.max.y),
        Math.max(box.max.z, childBox.max.z)
      )
      box.set(min, max)
    }
  })

  const sphere = new Sphere()
  box.getBoundingSphere(sphere)

  scene.boundingBox = box
  scene.boundingSphere = sphere
}

/**
 * Zoom
 * @param camera Camera
 * @param controls Controls
 * @param direction Direction
 */
export const _zoom = (
  camera: PerspectiveCamera,
  controls: TrackballControls,
  direction: 1 | -1
): void => {
  const targetDistance = controls.object.position.distanceTo(controls.target)
  const zoomDistance = targetDistance * direction * zoomFactor
  const translation = controls.target
    .clone()
    .sub(camera.position)
    .normalize()
    .multiplyScalar(zoomDistance)

  camera.position.add(translation)
}

let zoomInProgress: number | undefined = undefined

/**
 * Zoom to fit
 */
export const _zoomToFit = (
  scene: Scene & { boundingSphere: Sphere },
  camera: PerspectiveCamera,
  controls: TrackballControls
): void => {
  const onePart = scene.children.find((child) => child.type === 'Part')
  if (!onePart) return

  alreadyZoomToFit = true

  const sphere = scene.boundingSphere

  // Center
  const center = sphere.center

  // Direction
  const maxSize = 2 * sphere.radius
  const fitHeight = maxSize / (2 * Math.atan((Math.PI * camera.fov) / 360))
  const fitWidth = fitHeight / camera.aspect
  const distance = 1.1 * Math.max(fitHeight, fitWidth)
  const direction = controls.target
    .clone()
    .sub(camera.position)
    .normalize()
    .multiplyScalar(distance)

  // Controls
  controls.target.copy(center)
  controls.minDistance = distance / 10
  controls.maxDistance = distance * 10

  // Camera
  camera.position.copy(center).sub(direction)
  camera.near = distance / 100
  camera.far = distance * 100
  camera.updateProjectionMatrix()
}

/**
 * Load part
 * @param part Part
 * @param options Options
 * @param scene Scene
 * @param camera Camera
 * @param controls Controls
 * @param helpers Helpers
 * @param dispatch Dispatch
 */
export const _loadPart = async (
  part: IGeometryPart,
  scene: Scene & { boundingSphere: Sphere },
  camera: PerspectiveCamera,
  controls: TrackballControls,
  options: {
    transparent: boolean
    displayMesh: boolean
  },
  helpers: {
    gridHelper: IGridHelper
    sectionViewHelper: ISectionViewHelper
    pointHelper: IPointHelper
  },
  dispatch: Dispatch<ISelectAction>
): Promise<void> => {
  // Events
  const mouseMoveEvent = (
    child: IPart,
    uuid?: string,
    label?: number,
    point?: Vector3
  ): void => {
    if (uuid) {
      child.highlight(uuid)
      setTimeout(() => dispatch(highlight({ uuid, label: label! })), 1)
    } else if (point) {
      dispatch(setPoint({ x: point.x, y: point.y, z: point.z }))
    } else {
      child.unhighlight()
      setTimeout(() => dispatch(unhighlight()), 1)
    }
  }
  const mouseDownEvent = (child: IPart, uuid: string, number: number) => {
    const selected = child.getSelected()
    if (selected.find((s) => s.uuid === uuid)) {
      child.unselect(uuid)
      setTimeout(() => dispatch(unselect({ uuid, label: number })), 1)
    } else {
      child.select(uuid)
      setTimeout(() => dispatch(select({ uuid, label: number })), 1)
    }
  }

  // Load
  const loader = PartLoader(mouseMoveEvent, mouseDownEvent)
  const mesh = await loader.load(
    part,
    options.transparent,
    options.displayMesh,
    helpers.sectionViewHelper.getClippingPlane()
  )

  // Scene
  scene.add(mesh)
  _computeSceneBoundingSphere(scene)

  // Zoom
  if (!alreadyZoomToFit) _zoomToFit(scene, camera, controls)

  // Grid
  helpers.gridHelper.update()
  helpers.gridHelper.update()
  helpers.gridHelper.setVisible(true)

  // Point
  helpers.pointHelper.build()
}

/**
 * Compute colors
 * @param scene Scene
 * @param colorbarHelper ColorbarHelper
 */
const _computeColors = (
  scene: Scene,
  colorbarHelper: IColorbarHelper
): void => {
  colorbarHelper.dispose()
  colorbarHelper.setVisible(false)

  // Colorbar
  for (const child of scene.children) {
    if (child.type === 'Part' && child.userData.type === 'result') {
      const mesh = child.children[0] as Mesh
      colorbarHelper.addLUT(mesh.userData.lut)
      colorbarHelper.setVisible(true)
    }
  }

  // Colors
  for (const child of scene.children) {
    if (child.type === 'Part' && child.userData.type === 'result') {
      const mesh = child.children[0] as Mesh

      const data = mesh.geometry.getAttribute('data') as BufferAttribute
      const vertexColors = new Float32Array(data.count * 3)
      for (let i = 0; i < data.count; i++) {
        const vertexColor = colorbarHelper.getColor(data.array[i])

        vertexColors[3 * i + 0] = vertexColor.r
        vertexColors[3 * i + 1] = vertexColor.g
        vertexColors[3 * i + 2] = vertexColor.b
      }
      mesh.geometry.setAttribute(
        'color',
        new Float32BufferAttribute(vertexColors, 3)
      )
    }
  }
}

/**
 * Take screenshot
 * @param project Project
 * @param scene Scene
 * @param camera Camera
 * @param renderer Renderer
 */
export const _takeScreenshot = async (
  project: IProps['project'],
  scene: Scene,
  camera: PerspectiveCamera,
  renderer: WebGLRenderer
) => {
  try {
    const initialWidth = renderer.domElement.width
    const initialHeight = renderer.domElement.height

    const initialAspect = camera.aspect

    // Snap render
    const snapWidth = 2 * 260
    const snapHeight = 2 * 156

    renderer.domElement.width = snapWidth
    renderer.domElement.height = snapHeight

    camera.aspect = snapWidth / snapHeight
    camera.updateProjectionMatrix()

    renderer.clear()
    renderer.setViewport(0, 0, snapWidth, snapHeight)
    renderer.render(scene, camera)

    const image = renderer.domElement.toDataURL()

    // Resize
    renderer.domElement.width = initialWidth
    renderer.domElement.height = initialHeight

    camera.aspect = initialAspect
    camera.updateProjectionMatrix()

    // API
    await AvatarAPI.add(
      {
        name: 'snapshot',
        uid: 'snapshot_' + v4(),
        data: image
      },
      { id: project.id }
    )
  } catch (err) {
    ErrorNotification(errors.snapshot, err)
  }
}

/**
 * Export screenshot
 * @param project Project
 * @param scene Scene
 * @param camera Camera
 * @param renderer Renderer
 */
export const _downloadScreenshot = (
  project: IProps['project'],
  scene: Scene,
  camera: PerspectiveCamera,
  renderer: WebGLRenderer
) => {
  try {
    const initialWidth = renderer.domElement.width
    const initialHeight = renderer.domElement.height
    renderer.clear()
    renderer.setViewport(0, 0, initialWidth, initialHeight)
    renderer.render(scene, camera)

    const image = renderer.domElement.toDataURL()

    const a = document.createElement('a')
    a.href = image.replace('image/png', 'image/octet-stream')
    a.download = project.title + '_' + new Date().toLocaleDateString() + '.png'
    a.click()
  } catch (err) {
    ErrorNotification(errors.saveScreenshot, err)
  }
}

/**
 * Three view
 * @param props Props
 * @returns ThreeView
 */
const ThreeView = ({ loading, project, parts }: IProps): JSX.Element => {
  // Ref
  const mount = useRef<HTMLDivElement>(null)
  const scene = useRef<Scene & { boundingBox: Box3; boundingSphere: Sphere }>()
  const camera = useRef<PerspectiveCamera>()
  const renderer = useRef<WebGLRenderer>()
  const controls = useRef<TrackballControls>()
  const gridHelper = useRef<IGridHelper>()
  const selectionHelper = useRef<ISelectionHelper>()
  const sectionViewHelper = useRef<ISectionViewHelper>()
  const colorbarHelper = useRef<IColorbarHelper>()
  const pointHelper = useRef<IPointHelper>()

  // State
  const [transparent, setTransparent] = useState<boolean>(false)
  const [displayMesh, setDisplayMesh] = useState<boolean>(true)
  const [sectionView, setSectionView] = useState<boolean>(false)
  const [screenshot, setScreenshot] = useState<boolean>(false)
  const [savingScreenshot, setSavingScreenshot] = useState<boolean>(false)

  // Data
  const router = useRouter()

  // Context
  const {
    enabled: selectEnabled,
    part: selectPart,
    highlighted: selectHighlighted,
    selected: selectSelected,
    point: selectPoint,
    type: selectType,
    dispatch
  } = useContext(SelectContext)

  // Mount
  useEffect(() => {
    if (!WebGL.isWebGLAvailable()) {
      router.push('/webgl')
      return
    }

    const currentMount = mount.current!

    let width = currentMount.clientWidth
    let height = currentMount.clientHeight

    // Scene
    scene.current = new Scene() as Scene & {
      boundingBox: Box3
      boundingSphere: Sphere
    }
    scene.current.boundingBox = new Box3()
    scene.current.boundingSphere = new Sphere()

    // Camera
    camera.current = new PerspectiveCamera(50, width / height, 0.1, 1000)
    camera.current.position.z = 10

    // Light
    const ambientLight = new AmbientLight('#aaa', 0.75)
    scene.current.add(ambientLight)

    const pointLight1 = new PointLight('#fff', 0.5)
    pointLight1.decay = 2

    camera.current.add(pointLight1)

    scene.current.add(camera.current)

    // Renderer
    renderer.current = new WebGLRenderer({
      antialias: true,
      alpha: true
    })
    renderer.current.setClearColor('#ffffff')
    renderer.current.setSize(width, height)
    renderer.current.setPixelRatio(window.devicePixelRatio || 1)
    renderer.current.shadowMap.enabled = true
    renderer.current.autoClear = false
    currentMount.appendChild(renderer.current.domElement)

    // Controls
    controls.current = new TrackballControls(camera.current, currentMount)
    controls.current.rotateSpeed = 3
    controls.current.panSpeed = 0.1

    // Axis
    const axisHelper = AxisHelper(renderer.current, camera.current, {
      offsetWidth: width - 155,
      offsetHeight: height - 155,
      width: 150,
      height: 150
    })

    // NavigationHelper
    const navigationHelper = NavigationHelper(
      renderer.current,
      scene.current,
      camera.current,
      controls.current,
      {
        offsetWidth: width - 155,
        offsetHeight: height - 155,
        width: 150,
        height: 150
      }
    )

    // GridHelper
    gridHelper.current = GridHelper(
      renderer.current,
      scene.current,
      camera.current,
      controls.current
    )

    // SelectionHelper
    selectionHelper.current = SelectionHelper(
      renderer.current,
      scene.current,
      camera.current,
      controls.current
    )

    // SectionViewHelper
    sectionViewHelper.current = SectionViewHelper(
      renderer.current,
      scene.current,
      camera.current,
      controls.current
    )

    // ColorbarHelper
    colorbarHelper.current = ColorbarHelper(renderer.current)
    colorbarHelper.current.setVisible(false)

    // PointHelper
    pointHelper.current = PointHelper(scene.current)

    /**
     * Render scene
     */
    const renderScene = () => {
      controls.current!.update()

      renderer.current!.setViewport(0, 0, width, height)
      renderer.current!.render(scene.current!, camera.current!)

      gridHelper.current!.update()

      axisHelper.render()

      navigationHelper.render()

      colorbarHelper.current!.render()
    }

    /**
     * Handle resize
     */
    const handleResize = (): void => {
      width = currentMount.clientWidth
      height = currentMount.clientHeight
      camera.current!.aspect = width / height
      camera.current!.updateProjectionMatrix()

      renderer.current!.setSize(width, height)

      axisHelper.resize({
        newOffsetWidth: width - 155,
        newOffsetHeight: height - 155,
        newWidth: 150,
        newHeight: 150
      })

      navigationHelper.resize({
        newOffsetWidth: width - 155,
        newOffsetHeight: height - 155,
        newWidth: 150,
        newHeight: 150
      })

      renderScene()
    }

    /**
     * Animate
     */
    const animate = (): void => {
      renderScene()
      setTimeout(() => requestAnimationFrame(animate), 1000 / 30)
    }

    /**
     * Start animate
     */
    const start = (): void => {
      requestAnimationFrame(animate)
    }

    // Event listeners
    window.addEventListener('resize', handleResize)

    // First rendering
    start()

    // Unmount
    return () => {
      alreadyZoomToFit = false

      window.removeEventListener('resize', handleResize)

      currentMount.removeChild(renderer.current!.domElement)

      // Clean scene
      scene.current!.children.forEach((child: Object3D) => {
        scene.current!.remove(child)
      })

      // Dispose
      axisHelper.dispose()
      navigationHelper.dispose()
      gridHelper.current!.dispose()
      sectionViewHelper.current!.dispose()
      selectionHelper.current!.dispose()
      colorbarHelper.current!.dispose()
      pointHelper.current!.dispose()
    }
  }, [router])

  // Parts
  useCustomEffect(() => {
    if (!scene.current) return
    const sceneChildren = scene.current.children

    // Check parts
    if (!parts.length) {
      // Bounding sphere
      _computeSceneBoundingSphere(scene.current)

      // Grid
      gridHelper.current!.update()

      // PointHelper
      pointHelper.current?.build()
    }

    // Check part to add
    const toAdd = parts.filter(
      (part) => !sceneChildren.find((child) => child.uuid === part.summary.uuid)
    )

    // Check parts to remove
    const toRemove = sceneChildren
      .filter(
        (child) => !parts.find((part) => part.summary.uuid === child.uuid)
      )
      .filter((child) => child.type === 'Part')

    // Remove
    toRemove.forEach((child) => {
      const part = child as IPart
      scene.current?.remove(part)
      part.dispose()
    })

    // Add
    ;(async () => {
      await Promise.all(
        toAdd.map(async (part) => {
          try {
            // Load
            await _loadPart(
              part,
              scene.current!,
              camera.current!,
              controls.current!,
              {
                transparent,
                displayMesh
              },
              {
                gridHelper: gridHelper.current!,
                sectionViewHelper: sectionViewHelper.current!,
                pointHelper: pointHelper.current!
              },
              dispatch
            )
          } catch (err) {
            ErrorNotification(errors.load, err)
            _computeSceneBoundingSphere(scene.current!)
          }
        })
      )

      _computeColors(scene.current!, colorbarHelper.current!)
    })()
  }, [parts, transparent, displayMesh, dispatch])

  // Dimension
  useCustomEffect(() => {
    if (!scene.current) return

    // Dimension
    if (parts[0]?.summary.dimension === 2) {
      _computeSceneBoundingSphere(scene.current)

      // Set camera
      const normal = new Vector3(0, 0, 1)
      const up = new Vector3(0, 1, 0)

      const center = new Vector3()
      scene.current.boundingBox.getCenter(center)

      const distance = camera.current!.position.distanceTo(
        controls.current!.target
      )
      const interval = normal.clone().multiplyScalar(distance)
      const newPosition = center.add(interval)

      camera.current!.position.copy(newPosition)
      camera.current!.up.copy(up)

      // Stop rotate
      controls.current!.noRotate = true
    } else {
      // Activate rotate
      controls.current!.noRotate = false
    }
  }, [parts])

  // Enable / disable selection
  useEffect(() => {
    if (!scene.current) return

    scene.current.children.forEach((child) => {
      if (child.type === 'Part' && child.userData.uuid === selectPart) {
        const partChild = child as IPart
        if (selectEnabled)
          partChild.startSelection(
            renderer.current!,
            camera.current!,
            selectType!
          )
        else {
          partChild.stopSelection()
        }
      }
    })
  }, [selectEnabled, selectPart, selectType])

  // Highlight / Select
  useEffect(() => {
    if (!scene.current) return

    scene.current.children.forEach((child) => {
      if (child.type === 'Part' && child.uuid === selectPart) {
        const partChild = child as IPart
        // Highlight
        partChild.highlight(selectHighlighted?.uuid)

        // Selection
        const selected = partChild.getSelected()

        // Select
        const plus = selectSelected.filter(
          (s) => !selected.find((ss) => ss.uuid === s.uuid)
        )
        plus.forEach((p) => {
          p.uuid && partChild.select(p.uuid)
        })

        // Unselect
        const minus = selected.filter(
          (s) => !selectSelected.find((ss) => ss.uuid === s.uuid)
        )
        minus.forEach((m) => {
          partChild.unselect(m.uuid)
        })
      }
    })
  }, [selectPart, selectHighlighted, selectSelected])

  // Point
  useEffect(() => {
    if (!scene.current) return

    pointHelper.current?.update(
      selectPoint
        ? new Vector3(selectPoint.x, selectPoint.y, selectPoint.z)
        : undefined
    )
  }, [selectPoint])

  /**
   * Toggle transparent
   * @param checked Checked
   */
  const toggleTransparent = useCallback((checked: boolean) => {
    setTransparent(checked)
    scene.current!.children.forEach((child) => {
      if (child.type === 'Part') {
        const partChild = child as IPart
        partChild.setTransparent(checked)
      }
    })
  }, [])

  const toggleDisplayMesh = useCallback((checked: boolean) => {
    setDisplayMesh(checked)
    scene.current!.children.forEach((child) => {
      if (child.type === 'Part') {
        const partChild = child as IPart
        partChild.setDisplayMesh(checked)
      }
    })
  }, [])

  /**
   * Toggle section view
   */
  const toggleSectionView = useCallback(() => {
    const active = !sectionView
    setSectionView(active)
    active
      ? sectionViewHelper.current!.start()
      : sectionViewHelper.current!.stop()
  }, [sectionView])

  /**
   * Take screenshot
   */
  const takeScreenshot = useCallback(async () => {
    setScreenshot(true)
    try {
      await _takeScreenshot(
        project,
        scene.current!,
        camera.current!,
        renderer.current!
      )
    } finally {
      setScreenshot(false)
    }
  }, [project])

  /**
   * Download screenshot
   */
  const downloadScreenshot = useCallback(() => {
    setSavingScreenshot(true)
    try {
      _downloadScreenshot(
        project,
        scene.current!,
        camera.current!,
        renderer.current!
      )
    } finally {
      setSavingScreenshot(false)
    }
  }, [project])

  /**
   * Toggle grid
   * @param gridHelper Grid helper
   * @param checked Checked
   */
  const toggleGrid = useCallback((checked: boolean) => {
    gridHelper.current?.setVisible(checked)
  }, [])

  /**
   * Zoom in
   */
  const zoomIn = useCallback((): void => {
    _zoom(camera.current!, controls.current!, 1)
    const zoomInAnimationFrame = () => zoomIn()
    zoomInProgress = requestAnimationFrame(zoomInAnimationFrame)
  }, [])

  /**
   * Zoom out
   */
  const zoomOut = useCallback((): void => {
    _zoom(camera.current!, controls.current!, -1)
    const zoomOutAnimationFrame = () => zoomOut()
    zoomInProgress = requestAnimationFrame(zoomOutAnimationFrame)
  }, [])

  /**
   * Zoom stop
   */
  const zoomStop = useCallback((): void => {
    zoomInProgress && cancelAnimationFrame(zoomInProgress)
    zoomInProgress = undefined
  }, [])

  /**
   * Zoom to fit
   */
  const zoomToFit = useCallback((): void => {
    _zoomToFit(scene.current!, camera.current!, controls.current!)
  }, [])

  /**
   * Snap to X
   */
  const snapToX = useCallback((): void => {
    sectionViewHelper.current!.toAxis(new Vector3(-1, 0, 0))
  }, [])

  /**
   * Snap to Y
   */
  const snapToY = useCallback((): void => {
    sectionViewHelper.current!.toAxis(new Vector3(0, -1, 0))
  }, [])

  /**
   * Snap to Z
   */
  const snapToZ = useCallback((): void => {
    sectionViewHelper.current!.toAxis(new Vector3(0, 0, -1))
  }, [])

  /**
   * On colormap
   * @param props { key }
   */
  const onColormap = useCallback((props: { key: string }): void => {
    colorbarHelper.current?.setColorMap(props.key)
    _computeColors(scene.current!, colorbarHelper.current!)
  }, [])

  /**
   * Render
   */
  return (
    <Layout className={`${globalStyle.noScroll} ${style.view}`}>
      <Layout.Header className={style.head}>
        <Tooltip title="Take snapshot" placement="left">
          <Dropdown
            placement="bottom"
            menu={{
              items: [
                {
                  key: 'project',
                  label: (
                    <Button
                      type="text"
                      className={`${globalStyle.fullWidth} ${globalStyle.noBackground}`}
                      loading={screenshot}
                      onClick={takeScreenshot}
                    >
                      Project snapshot
                    </Button>
                  )
                },
                {
                  key: 'image',
                  label: (
                    <Button
                      type="text"
                      className={`${globalStyle.fullWidth} ${globalStyle.noBackground}`}
                      loading={savingScreenshot}
                      onClick={downloadScreenshot}
                    >
                      Export image
                    </Button>
                  )
                }
              ]
            }}
          >
            <Button icon={<FundProjectionScreenOutlined />} />
          </Dropdown>
        </Tooltip>

        <Divider style={{ margin: 0 }} />

        <Tooltip title="Display grid" placement="left">
          <Switch
            defaultChecked
            checkedChildren={<BorderlessTableOutlined />}
            unCheckedChildren={<BorderlessTableOutlined />}
            onChange={toggleGrid}
          />
        </Tooltip>
        <Tooltip title="Set transparency" placement="left">
          <Switch
            checked={transparent}
            checkedChildren={<RadiusUprightOutlined />}
            unCheckedChildren={<RadiusUprightOutlined />}
            onChange={toggleTransparent}
          />
        </Tooltip>

        <Divider style={{ margin: 0 }} />

        <Tooltip title="Zoom out" placement="left">
          <Button
            icon={<ZoomOutOutlined />}
            onMouseDown={zoomOut}
            onMouseUp={zoomStop}
            onMouseOut={zoomStop}
          />
        </Tooltip>
        <Tooltip title="Zoom in" placement="left">
          <Button
            icon={<ZoomInOutlined />}
            onMouseDown={zoomIn}
            onMouseUp={zoomStop}
            onMouseOut={zoomStop}
          />
        </Tooltip>
        <Tooltip title="Zoom to fit" placement="left">
          <Button icon={<CompressOutlined />} onClick={zoomToFit} />
        </Tooltip>
        <Tooltip title="Zoom to selection" placement="left">
          <Button
            icon={<SelectOutlined />}
            onClick={
              selectionHelper.current?.isEnabled()
                ? selectionHelper.current?.end
                : selectionHelper.current?.start
            }
          />
        </Tooltip>

        <Divider style={{ margin: 0 }} />

        {!sectionView && (
          <Tooltip title="Section view">
            <Button icon={<ScissorOutlined />} onClick={toggleSectionView} />
          </Tooltip>
        )}

        {sectionView && (
          <>
            <Tooltip title="Stop" placement="left">
              <Button icon={<StopOutlined />} onClick={toggleSectionView} />
            </Tooltip>

            <Tooltip title="Hide plane" placement="left">
              <Button
                icon={<EyeInvisibleOutlined />}
                onClick={sectionViewHelper.current!.toggleVisible}
              />
            </Tooltip>
            <Tooltip title="Snap to X" placement="left">
              <Button className="ant-btn-icon-only" onClick={snapToX}>
                X
              </Button>
            </Tooltip>
            <Tooltip title="Snap to Y" placement="left">
              <Button className="ant-btn-icon-only" onClick={snapToY}>
                Y
              </Button>
            </Tooltip>
            <Tooltip title="Snap to Z" placement="left">
              <Button className="ant-btn-icon-only" onClick={snapToZ}>
                Z
              </Button>
            </Tooltip>
            <Tooltip title="Flip" placement="left">
              <Button
                onClick={sectionViewHelper.current!.flip}
                icon={<RetweetOutlined />}
              />
            </Tooltip>
          </>
        )}

        {parts.filter((part) => part.summary.type === 'result').length ? (
          <>
            <Divider className="no-margin" />

            <Tooltip title="Display result mesh" placement="right">
              <Switch
                checked={displayMesh}
                checkedChildren={<TableOutlined />}
                unCheckedChildren={<TableOutlined />}
                onChange={toggleDisplayMesh}
              />
            </Tooltip>

            <Tooltip title="Colormap" placement="right">
              <Dropdown
                placement="bottom"
                menu={{
                  items: [
                    {
                      key: 'rainbow',
                      label: 'Rainbow'
                    },
                    {
                      key: 'cooltowarm',
                      label: 'Cool to warm'
                    },
                    {
                      key: 'blackbody',
                      label: 'Black body'
                    },
                    {
                      key: 'grayscale',
                      label: 'Gray scale'
                    }
                  ],
                  onClick: onColormap
                }}
              >
                <Button icon={<BgColorsOutlined />} />
              </Dropdown>
            </Tooltip>
          </>
        ) : null}
      </Layout.Header>
      <Layout.Content className={`${globalStyle.noScroll} ${style.content}`}>
        <div
          style={{ display: loading ? 'flex' : 'none' }}
          className={style.loading}
        >
          <Spin indicator={<LoadingOutlined style={{ fontSize: 80 }} spin />} />
        </div>
        <div ref={mount} className={style.canvas} />
      </Layout.Content>
    </Layout>
  )
}

export default ThreeView
