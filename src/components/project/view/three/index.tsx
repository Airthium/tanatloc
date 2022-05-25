/** @module Components.Project.View.Three */

import { useRouter } from 'next/router'
import {
  useRef,
  useState,
  useEffect,
  MutableRefObject,
  Dispatch,
  useCallback,
  useContext
} from 'react'
import {
  Button,
  Divider,
  Dropdown,
  Layout,
  Menu,
  Spin,
  Switch,
  Tooltip
} from 'antd'
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
  RetweetOutlined
} from '@ant-design/icons'
import {
  AmbientLight,
  Box3,
  Object3D,
  PerspectiveCamera,
  PointLight,
  Scene,
  Sphere,
  Vector2,
  Vector3,
  WebGLRenderer
} from 'three'
import { v4 } from 'uuid'

import { ErrorNotification } from '@/components/assets/notification'

import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import WebGL from 'three/examples/jsm/capabilities/WebGL'

import { AxisHelper } from '@/lib/three/helpers/AxisHelper'
import { NavigationHelper } from '@/lib/three/helpers/NavigationHelper'
import { GridHelper, IGridHelper } from '@/lib/three/helpers/GridHelper'
import { SelectionHelper } from '@/lib/three/helpers/SelectionHelper'
import {
  ISectionViewHelper,
  SectionViewHelper
} from '@/lib/three/helpers/SectionViewHelper'
import {
  ColorbarHelper,
  IColorbarHelper
} from '@/lib/three/helpers/ColorbarHelper'

import { IPart, PartLoader } from '@/lib/three/loaders/PartLoader'

import { ISelectAction, SelectContext } from '@/context/select'
import {
  highlight,
  select,
  unhighlight,
  unselect,
  setPart
} from '@/context/select/actions'

import { IFrontProject } from '@/api/index.d'
import AvatarAPI from '@/api/avatar'

/**
 * Props
 */
export interface IProps {
  loading: boolean
  project: Pick<IFrontProject, 'id' | 'title'>
  part?: { uuid: string; buffer: Buffer }
}

/**
 * Errors
 */
export const errors = {
  load: 'Load part error',
  snapshot: 'Snapshot error',
  saveScreenshot: 'Unable to save screenshot'
}

/**
 * Zoom factor
 */
const zoomFactor = 0.01

/**
 * Compute scene bounding box
 * @param scene Scene
 */
export const computeSceneBoundingSphere = (
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
export const zoom = (
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
 * Zoom in
 * @param camera Camera
 * @param controls Controls
 */
export const zoomIn = (
  camera: PerspectiveCamera,
  controls: TrackballControls
): void => {
  zoom(camera, controls, 1)
  const zoomInAnimationFrame = () => zoomIn(camera, controls)
  zoomInProgress = requestAnimationFrame(zoomInAnimationFrame)
}

/**
 * Zoom out
 * @param camera Camera
 * @param controls Controls
 */
export const zoomOut = (
  camera: PerspectiveCamera,
  controls: TrackballControls
): void => {
  zoom(camera, controls, -1)
  const zoomOutAnimationFrame = () => zoomOut(camera, controls)
  zoomInProgress = requestAnimationFrame(zoomOutAnimationFrame)
}

/**
 * Zoom stop
 */
export const zoomStop = (): void => {
  zoomInProgress && cancelAnimationFrame(zoomInProgress)
  zoomInProgress = undefined
}

/**
 * Zoom to fit
 * @param scene Scene
 * @param camera Camera
 * @param controls Controls
 */
export const zoomToFit = (
  scene: Scene & { boundingSphere: Sphere },
  camera: PerspectiveCamera,
  controls: TrackballControls
): void => {
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
 * @param transparent Transparent
 * @param scene Scene
 * @param camera Camera
 * @param controls Controls
 * @param helpers Helpers
 * @param dispatch Dispatch
 */
export const loadPart = async (
  part: { uuid: string; buffer: Buffer },
  transparent: boolean,
  scene: Scene & { boundingSphere: Sphere },
  camera: PerspectiveCamera,
  controls: TrackballControls,
  helpers: {
    gridHelper: IGridHelper
    sectionViewHelper: ISectionViewHelper
    colorbarHelper: IColorbarHelper
  },
  dispatch: Dispatch<ISelectAction>
): Promise<void> => {
  // Events
  const mouseMoveEvent = (
    child: IPart,
    uuid?: string,
    number?: number
  ): void => {
    if (uuid) {
      child.highlight(uuid)
      setTimeout(() => dispatch(highlight({ uuid, label: number! })), 1)
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
    transparent,
    helpers.sectionViewHelper.getClippingPlane()
  )
  dispatch(setPart(mesh))

  // Scene
  scene.add(mesh)
  computeSceneBoundingSphere(scene)

  // Grid
  helpers.gridHelper.update()

  // Zoom
  zoomToFit(scene, camera, controls)

  // Colorbar
  if (mesh?.children[1]?.children[0]?.userData.lut) {
    helpers.colorbarHelper.setLUT(mesh.children[1].children[0].userData.lut)
    helpers.colorbarHelper.setVisible(true)
  } else {
    helpers.colorbarHelper.setVisible(false)
  }

  helpers.gridHelper.update()
  helpers.gridHelper.setVisible(true)
}

/**
 * Toggle grid
 * @param gridHelper Grid helper
 * @param checked Checked
 */
export const toggleGrid = (gridHelper: IGridHelper, checked: boolean) => {
  gridHelper.setVisible(checked)
}

/**
 * Take screenshot
 * @param project Project
 * @param scene Scene
 * @param camera Camera
 * @param renderer Renderer
 */
export const takeScreenshot = async (
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
export const downloadScreenshot = (
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

    var a = document.createElement('a')
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
const ThreeView = ({ loading, project, part }: IProps): JSX.Element => {
  // Ref
  const mount: MutableRefObject<any> = useRef(null)
  const scene: MutableRefObject<any> = useRef()
  const camera: MutableRefObject<any> = useRef()
  const renderer: MutableRefObject<any> = useRef()
  const outlinePass: MutableRefObject<any> = useRef()
  const effectComposer: MutableRefObject<any> = useRef()
  const controls: MutableRefObject<any> = useRef()
  const gridHelper: MutableRefObject<any> = useRef()
  const selectionHelper: MutableRefObject<any> = useRef()
  const sectionViewHelper: MutableRefObject<any> = useRef()
  const colorbarHelper: MutableRefObject<any> = useRef()

  // State
  const [transparent, setTransparent] = useState<boolean>(false)
  const [sectionView, setSectionView] = useState<boolean>(false)
  const [screenshot, setScreenshot] = useState<boolean>(false)
  const [savingScreenshot, setSavingScreenshot] = useState<boolean>(false)

  // Data
  const router = useRouter()

  // Context
  const {
    enabled: selectEnabled,
    type: selectType,
    part: selectPart,
    highlighted: selectHighlighted,
    selected: selectSelected,
    dispatch
  } = useContext(SelectContext)

  // Mount
  useEffect(() => {
    if (!WebGL.isWebGLAvailable()) {
      router.push('/webgl')
      return
    }

    const currentMount = mount.current

    let width = currentMount.clientWidth
    let height = currentMount.clientHeight
    let frameId: number | undefined

    // Scene
    scene.current = new Scene()

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

    // Render pass
    const renderPass = new RenderPass(scene.current, camera.current)

    // Outline pass
    outlinePass.current = new OutlinePass(
      new Vector2(width, height),
      scene.current,
      camera.current
    )
    outlinePass.current.visibleEdgeColor.set('#FAD114')
    outlinePass.current.hiddenEdgeColor.set('#FAD114')

    // Effect composer
    effectComposer.current = new EffectComposer(renderer.current)
    effectComposer.current.addPass(renderPass)
    effectComposer.current.addPass(outlinePass.current)

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

    /**
     * Render scene
     */
    const renderScene = () => {
      controls.current.update()

      renderer.current.setViewport(0, 0, width, height)
      renderer.current.render(scene.current, camera.current)

      gridHelper.current.update()

      effectComposer.current.render()

      axisHelper.render()

      navigationHelper.render()

      colorbarHelper.current.render()
    }

    /**
     * Handle resize
     */
    const handleResize = (): void => {
      width = currentMount.clientWidth
      height = currentMount.clientHeight
      camera.current.aspect = width / height
      camera.current.updateProjectionMatrix()

      renderer.current.setSize(width, height)

      effectComposer.current.setSize(width, height)

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
      /*frameId = */ requestAnimationFrame(animate)
    }

    /**
     * Start animate
     */
    const start = (): void => {
      frameId = requestAnimationFrame(animate)
    }

    /**
     * Stop animate
     */
    const stop = (): void => {
      frameId && cancelAnimationFrame(frameId)
      frameId = undefined
    }

    // Event listeners
    window.addEventListener('resize', handleResize)

    // First rendering
    start()

    // Unmount
    return () => {
      stop()

      window.removeEventListener('resize', handleResize)

      currentMount.removeChild(renderer.current.domElement)

      // Clean scene
      scene.current.children.forEach((child: Object3D) => {
        scene.current.remove(child)
      })

      // Dispose
      axisHelper.dispose()
      navigationHelper.dispose()
      gridHelper.current.dispose()
      sectionViewHelper.current.dispose()
      selectionHelper.current.dispose()
    }
  }, [router])

  useEffect(() => {
    if (!scene.current) return

    // Check part update
    const currentPart = scene.current.children.find(
      (child: IPart) => child.type === 'Part' && child.uuid === part?.uuid
    )
    if (currentPart) return

    // Clean scene
    scene.current.children.forEach((child: IPart) => {
      if (child.type === 'Part') {
        scene.current.remove(child)
        child.dispose()
      }
    })

    if (part) {
      // Load
      loadPart(
        { uuid: part.uuid, buffer: part.buffer },
        transparent,
        scene.current,
        camera.current,
        controls.current,
        {
          gridHelper: gridHelper.current,
          sectionViewHelper: sectionViewHelper.current,
          colorbarHelper: colorbarHelper.current
        },
        dispatch
      )
        .then(() => {
          // Dimension
          // TODO
          // if (part.dimension === 2) {
          //   // Set camera
          //   const normal = new Vector3(0, 0, 1)
          //   const up = new Vector3(0, 1, 0)

          //   const center = new Vector3()
          //   scene.current.boundingBox.getCenter(center)

          //   const distance = camera.current.position.distanceTo(
          //     controls.current.target
          //   )
          //   const interval = normal.clone().multiplyScalar(distance)
          //   const newPosition = center.add(interval)

          //   camera.current.position.copy(newPosition)
          //   camera.current.up.copy(up)

          //   // Stop rotate
          //   controls.current.noRotate = true
          // } else {
          // Activate rotate
          controls.current.noRotate = false
          // }
        })
        .catch((err) => {
          ErrorNotification(errors.load, err)
          computeSceneBoundingSphere(scene.current)
        })
    } else {
      // Scene
      computeSceneBoundingSphere(scene.current)

      // Grid
      gridHelper.current.update()
    }
  }, [part, transparent, dispatch])

  // Enable / disable selection
  useEffect(() => {
    if (!scene.current) return

    scene.current.children.forEach((child: IPart) => {
      if (child.type === 'Part' && child.uuid === selectPart) {
        if (selectEnabled)
          child.startSelection(
            renderer.current,
            camera.current,
            outlinePass.current,
            selectType
          )
        else {
          child.stopSelection()
        }
      }
    })
  }, [selectEnabled, selectPart, selectType])

  useEffect(() => {
    if (!scene.current) return

    scene.current.children.forEach((child: IPart) => {
      if (child.type === 'Part' && child.uuid === selectPart) {
        // Highlight
        child.highlight(selectHighlighted?.uuid)

        // Selection
        const selected = child.getSelected()

        // Select
        const plus = selectSelected.filter(
          (s) => !selected.find((ss) => ss.uuid === s.uuid)
        )
        plus.forEach((p) => {
          p.uuid && child.select(p.uuid)
        })

        // Unselect
        const minus = selected.filter(
          (s) => !selectSelected.find((ss) => ss.uuid === s.uuid)
        )
        minus.forEach((m) => {
          child.unselect(m.uuid)
        })
      }
    })
  }, [selectPart, selectHighlighted, selectSelected])

  /**
   * Toggle transparent
   * @param checked Checked
   */
  const toggleTransparent = useCallback((checked: boolean) => {
    setTransparent(checked)
    scene.current.children.forEach((child: IPart) => {
      if (child.type === 'Part') {
        child.setTransparent(checked)
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
      ? sectionViewHelper.current.start()
      : sectionViewHelper.current.stop()
  }, [sectionView])

  /**
   * Render
   */
  return (
    <Layout className="View no-scroll">
      <Layout.Header className="View-header">
        <div className="View-controls-main">
          <Tooltip title="Take snasphot" placement="right">
            <Dropdown
              placement="bottom"
              overlay={
                <Menu
                  items={[
                    {
                      key: 'project',
                      label: (
                        <Button
                          type="text"
                          loading={screenshot}
                          onClick={async () => {
                            setScreenshot(true)
                            try {
                              await takeScreenshot(
                                project,
                                scene.current,
                                camera.current,
                                renderer.current
                              )
                            } finally {
                              setScreenshot(false)
                            }
                          }}
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
                          loading={savingScreenshot}
                          onClick={() => {
                            setSavingScreenshot(true)
                            try {
                              downloadScreenshot(
                                project,
                                scene.current,
                                camera.current,
                                renderer.current
                              )
                            } finally {
                              setSavingScreenshot(false)
                            }
                          }}
                        >
                          Export image
                        </Button>
                      )
                    }
                  ]}
                />
              }
            >
              <Button icon={<FundProjectionScreenOutlined />} />
            </Dropdown>
          </Tooltip>

          <Divider className="no-margin" />

          <Tooltip title="Display grid" placement="right">
            <Switch
              defaultChecked
              checkedChildren={<BorderlessTableOutlined />}
              unCheckedChildren={<BorderlessTableOutlined />}
              onChange={(checked) => toggleGrid(gridHelper.current, checked)}
            />
          </Tooltip>
          <Tooltip title="Set transparency" placement="right">
            <Switch
              className="transparent"
              checked={transparent}
              checkedChildren={<RadiusUprightOutlined />}
              unCheckedChildren={<RadiusUprightOutlined />}
              onChange={toggleTransparent}
            />
          </Tooltip>

          <Divider className="no-margin" />

          <Tooltip title="Zoom out" placement="right">
            <Button
              icon={<ZoomOutOutlined />}
              onMouseDown={() => zoomOut(camera.current, controls.current)}
              onMouseUp={zoomStop}
              onMouseOut={zoomStop}
            />
          </Tooltip>
          <Tooltip title="Zoom to fit" placement="right">
            <Button
              icon={<CompressOutlined />}
              onClick={() =>
                zoomToFit(scene.current, camera.current, controls.current)
              }
            />
          </Tooltip>
          <Tooltip title="Zoom in" placement="right">
            <Button
              icon={<ZoomInOutlined />}
              onMouseDown={() => zoomIn(camera.current, controls.current)}
              onMouseUp={zoomStop}
              onMouseOut={zoomStop}
            />
          </Tooltip>
          <Tooltip title="Zoom to selection" placement="right">
            <Button
              icon={<SelectOutlined />}
              onClick={() =>
                selectionHelper.current.isEnabled()
                  ? selectionHelper.current.end()
                  : selectionHelper.current.start()
              }
            />
          </Tooltip>

          <Divider className="no-margin" />

          {!sectionView && (
            <Tooltip title="Section view" placement="right">
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
                  onClick={() => sectionViewHelper.current.toggleVisible()}
                />
              </Tooltip>
              <Tooltip title="Snap to X" placement="left">
                <Button
                  className="ant-btn-icon-only"
                  onClick={() =>
                    sectionViewHelper.current.toAxis(new Vector3(-1, 0, 0))
                  }
                >
                  X
                </Button>
              </Tooltip>
              <Tooltip title="Snap to Y" placement="left">
                <Button
                  className="ant-btn-icon-only"
                  onClick={() =>
                    sectionViewHelper.current.toAxis(new Vector3(0, -1, 0))
                  }
                >
                  Y
                </Button>
              </Tooltip>
              <Tooltip title="Snap to Z" placement="left">
                <Button
                  className="ant-btn-icon-only"
                  onClick={() =>
                    sectionViewHelper.current.toAxis(new Vector3(0, 0, -1))
                  }
                >
                  Z
                </Button>
              </Tooltip>
              <Tooltip title="Flip" placement="left">
                <Button
                  onClick={() => sectionViewHelper.current.flip()}
                  icon={<RetweetOutlined />}
                />
              </Tooltip>
            </>
          )}
        </div>
      </Layout.Header>
      <Layout.Content className="View-content no-scroll">
        <div
          style={{ display: loading ? 'flex' : 'none' }}
          className="View-loading"
        >
          <Spin
            indicator={
              <LoadingOutlined
                className="View-loading-spin"
                style={{ fontSize: 80 }}
                spin
              />
            }
          />
        </div>
        <div ref={mount} className="View-canvas" />
      </Layout.Content>
    </Layout>
  )
}

export default ThreeView
