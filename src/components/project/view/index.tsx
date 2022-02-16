/** @module Components.Project.View */

import { useRef, useState, useEffect, MutableRefObject } from 'react'
import {
  Button,
  Divider,
  Layout,
  Radio,
  Space,
  Spin,
  Switch,
  Tooltip
} from 'antd'
import {
  BorderlessTableOutlined,
  CompressOutlined,
  DragOutlined,
  EyeInvisibleOutlined,
  FundProjectionScreenOutlined,
  LoadingOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  SelectOutlined,
  RadiusUprightOutlined,
  ScissorOutlined,
  StopOutlined,
  SyncOutlined,
  RetweetOutlined
} from '@ant-design/icons'
import {
  AmbientLight,
  Box3,
  PerspectiveCamera,
  PointLight,
  Scene,
  Sphere,
  Vector2,
  Vector3,
  WebGLRenderer
} from 'three'
import { v4 } from 'uuid'

import { IGeometry, ISimulation, ISimulationTaskFile } from '@/database/index.d'
import { IProjectWithData } from '@/lib/index.d'

import { Error as ErrorNotification } from '@/components/assets/notification'

import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'

import { AxisHelper } from '@/lib/three/helpers/AxisHelper'
import { NavigationHelper } from '@/lib/three/helpers/NavigationHelper'
import { GridHelper } from '@/lib/three/helpers/GridHelper'
import { SelectionHelper } from '@/lib/three/helpers/SelectionHelper'
import { SectionViewHelper } from '@/lib/three/helpers/SectionViewHelper'
import { ColorbarHelper } from '@/lib/three/helpers/ColorbarHelper'

import { PartLoader } from '@/lib/three/loaders/PartLoader'

import AvatarAPI from '@/api/avatar'
import GeometryAPI from '@/api/geometry'
import ResultAPI from '@/api/result'

import { useSelector, useDispatch } from 'react-redux'
import { highlight, select, unselect } from '@/store/select/action'
import { SelectState } from '@/store/select/reducer'

export interface IThreeProps {
  loading: boolean
  project: IProjectWithData
  part: {}
}

/**
 * Errors
 * @memberof Components.Project.View
 */
const errors = {
  partError: 'Unable to load part'
}

/**
 * ThreeView
 * @memberof Components.Project.View
 * @param {Object} props Props `{ loading, project, part }`
 */
const ThreeView = ({ loading, project, part }: IThreeProps): JSX.Element => {
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
  const [transparent, setTransparent]: [boolean, Function] = useState(false)
  const [sectionView, setSectionView]: [boolean, Function] = useState(false)
  const [transform, setTransform]: [string, Function] = useState('translate')
  const [screenshot, setScreenshot]: [boolean, Function] = useState(false)

  // Store
  const {
    selectEnabled,
    selectType,
    selectPart,
    selectHighlighted,
    selectSelected
  } = useSelector((state: { select: SelectState }) => ({
    selectEnabled: state.select.enabled,
    selectType: state.select.type,
    selectPart: state.select.part,
    selectHighlighted: state.select.highlighted,
    selectSelected: state.select.selected
  }))
  const dispatch = useDispatch()

  // Zoom factor
  const zoomFactor = 0.01

  // Mount
  useEffect(() => {
    const currentMount = mount.current

    let width = currentMount.clientWidth
    let height = currentMount.clientHeight
    let frameId: number

    // Scene
    scene.current = new Scene()

    // Camera
    camera.current = new PerspectiveCamera(50, width / height, 0.1, 1000)
    camera.current.position.z = 10

    // Light
    const ambientLight = new AmbientLight('#999999')
    const pointLight1 = new PointLight('#ffffff')
    pointLight1.decay = 5
    pointLight1.position.set(5, 5, 5)
    const pointLight2 = new PointLight('#ffffff')
    pointLight2.decay = 5
    pointLight2.position.set(-5, -5, -5)
    scene.current.add(ambientLight)
    scene.current.add(pointLight1)
    scene.current.add(pointLight2)

    // Renderer
    renderer.current = new WebGLRenderer({
      antialias: true,
      alpha: true
    })
    renderer.current.setClearColor('#ffffff')
    renderer.current.setSize(width, height)
    renderer.current.setPixelRatio(window.devicePixelRatio || 1)
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
    gridHelper.current = GridHelper(scene.current)

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
    colorbarHelper.current = ColorbarHelper(renderer.current, scene.current)
    colorbarHelper.current.setVisible(false)

    /**
     * Render scene
     */
    const renderScene = () => {
      controls.current.update()

      renderer.current.setViewport(0, 0, width, height)
      renderer.current.render(scene.current, camera.current)

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
      renderer.current.setSize(width, height)
      camera.current.aspect = width / height
      camera.current.updateProjectionMatrix()

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
      cancelAnimationFrame(frameId)
      frameId = null
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
      scene.current.children.forEach((child) => {
        scene.current.remove(child)
      })

      // Dispose
      axisHelper.dispose()
      navigationHelper.dispose()
      gridHelper.current.dispose()
      sectionViewHelper.current.dispose()
      selectionHelper.current.dispose()
    }
  }, [])

  useEffect(() => {
    // Clean scene
    scene.current.children.forEach((child) => {
      if (child.type === 'Part') {
        scene.current.remove(child)
        child.dispose()
      }
    })

    if (part) loadPart()
    else {
      // Scene
      computeSceneBoundingSphere()

      // Grid
      gridHelper.current.update()
    }
  }, [part])

  // Enable / disable selection
  useEffect(() => {
    scene.current.children.forEach((child) => {
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
    scene.current.children.forEach((child) => {
      if (child.type === 'Part' && child.uuid === selectPart) {
        // Highlight
        child.highlight(selectHighlighted)

        // Selection
        const selected = child.getSelected()

        // Unselect
        const minus = selected.filter((s) => !selectSelected.includes(s))
        minus.forEach((m) => {
          child.unselect(m)
        })

        // Select
        const plus = selectSelected.filter((s) => !selected.includes(s))
        plus.forEach((p) => {
          child.select(p)
        })
      }
    })
  }, [selectHighlighted, selectSelected])

  /**
   * Compute scene bounding box
   */
  const computeSceneBoundingSphere = () => {
    const box = new Box3()
    scene.current.children.forEach((child) => {
      if (child.visible && child.type === 'Part') {
        const childBox = child.boundingBox
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

    scene.current.boundingBox = box
    scene.current.boundingSphere = sphere
  }

  /**
   * Zoom
   * @param {Object} direction Direction
   */
  const zoom = (direction) => {
    const targetDistance = controls.current.object.position.distanceTo(
      controls.current.target
    )
    const zoomDistance = targetDistance * direction * zoomFactor
    const translation = controls.current.target
      .clone()
      .sub(camera.current.position)
      .normalize()
      .multiplyScalar(zoomDistance)

    camera.current.position.add(translation)
  }

  let zoomInProgress = null
  /**
   * Zoom in
   */
  const zoomIn = () => {
    zoom(1)
    zoomInProgress = requestAnimationFrame(zoomIn)
  }

  /**
   * Zoom out
   */
  const zoomOut = () => {
    zoom(-1)
    zoomInProgress = requestAnimationFrame(zoomOut)
  }

  /**
   * Zoom stop
   */
  const zoomStop = () => {
    cancelAnimationFrame(zoomInProgress)
    zoomInProgress = null
  }

  /**
   * Zoom to fit
   */
  const zoomToFit = () => {
    const sphere = scene.current.boundingSphere

    // Center
    const center = sphere.center

    // Direction
    const maxSize = 2 * sphere.radius
    const fitHeight =
      maxSize / (2 * Math.atan((Math.PI * camera.current.fov) / 360))
    const fitWidth = fitHeight / camera.current.aspect
    const distance = 1.1 * Math.max(fitHeight, fitWidth)
    const direction = controls.current.target
      .clone()
      .sub(camera.current.position)
      .normalize()
      .multiplyScalar(distance)

    // Controls
    controls.current.target.copy(center)

    // Camera
    camera.current.position.copy(center).sub(direction)
    camera.current.near = distance / 100
    camera.current.far = distance * 100
    camera.current.updateProjectionMatrix()

    // Lights
    scene.current.children.forEach((child) => {
      if (child.type === 'PointLight') {
        const position = child.position
        const max = Math.max(
          Math.max(Math.abs(position.x), Math.abs(position.y)),
          Math.abs(position.z)
        )
        child.position.multiplyScalar((1.5 * distance) / max)
      }
    })
  }

  /**
   * Load part
   */
  const loadPart = async () => {
    // Events
    const mouseMoveEvent = (child, uuid) => {
      child.highlight(uuid)
      setTimeout(() => dispatch(highlight(uuid)), 1)
    }
    const mouseDownEvent = (child, uuid) => {
      const selected = child.getSelected()
      if (selected.includes(uuid)) {
        child.unselect(uuid)
        setTimeout(() => dispatch(unselect(uuid)), 1)
      } else {
        child.select(uuid)
        setTimeout(() => dispatch(select(uuid)), 1)
      }
    }

    // Load
    const loader = PartLoader(mouseMoveEvent, mouseDownEvent)
    const mesh = await loader.load(
      part,
      transparent,
      sectionViewHelper.current.getClippingPlane()
    )

    // Scene
    scene.current.add(mesh)
    computeSceneBoundingSphere()

    // Grid
    gridHelper.current.update()

    // Zoom
    zoomToFit()

    // Colorbar
    if (mesh?.children[1]?.children[0]?.userData.lut) {
      colorbarHelper.current.setLUT(mesh.children[1].children[0].userData.lut)
      colorbarHelper.current.setVisible(true)
    } else {
      colorbarHelper.current.setVisible(false)
    }
  }

  /**
   * Toggle grid
   * @param {boolean} checked Checked
   */
  const toggleGrid = (checked) => {
    gridHelper.current.setVisible(checked)
  }

  const toggleTransparent = (checked) => {
    setTransparent(checked)
    scene.current.children.forEach((child) => {
      if (child.type === 'Part') {
        child.setTransparent(checked)
      }
    })
  }

  /**
   * Toggle section view
   */
  const toggleSectionView = () => {
    const active = !sectionView
    setSectionView(active)
    active
      ? sectionViewHelper.current.start()
      : sectionViewHelper.current.stop()
  }

  /**
   * Handle transform mode
   * @param {Object} event Event
   */
  const handleTransform = (event) => {
    const mode = event.target.value

    setTransform(mode)

    sectionViewHelper.current.setMode(mode)
  }

  /**
   * Take screenshot
   */
  const takeScreenshot = async () => {
    setScreenshot(true)

    try {
      const initialWidth = renderer.current.domElement.width
      const initialHeight = renderer.current.domElement.height

      const initialAspect = camera.current.aspect

      // Snap render
      const snapWidth = 2 * 260
      const snapHeight = 2 * 156

      renderer.current.domElement.width = snapWidth
      renderer.current.domElement.height = snapHeight

      camera.current.aspect = snapWidth / snapHeight
      camera.current.updateProjectionMatrix()

      renderer.current.clear()
      renderer.current.setViewport(0, 0, snapWidth, snapHeight)
      renderer.current.render(scene.current, camera.current)

      const image = renderer.current.domElement.toDataURL()

      // Resize
      renderer.current.domElement.width = initialWidth
      renderer.current.domElement.height = initialHeight

      camera.current.aspect = initialAspect
      camera.current.updateProjectionMatrix()

      // API
      await AvatarAPI.add(
        {
          name: 'snapshot',
          uid: 'snapshot_' + v4(),
          data: image
        },
        project
      )
    } catch (err) {
      ErrorNotification('Snapshot error', err)
    } finally {
      setScreenshot(false)
    }
  }

  /**
   * Render
   */
  return (
    <Layout className="View no-scroll">
      <Layout.Header className="View-header">
        <div className="View-controls-main">
          <div className="View-controls-first">
            <Tooltip title="Take snasphot" placement="right">
              <Button
                loading={screenshot}
                icon={<FundProjectionScreenOutlined />}
                onClick={takeScreenshot}
              />
            </Tooltip>

            <Divider className="no-margin" />

            <Tooltip title="Display grid" placement="right">
              <Switch
                defaultChecked
                checkedChildren={<BorderlessTableOutlined />}
                unCheckedChildren={<BorderlessTableOutlined />}
                onChange={toggleGrid}
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
                onMouseDown={zoomOut}
                onMouseUp={zoomStop}
                onMouseOut={zoomStop}
              />
            </Tooltip>
            <Tooltip title="Zoom to fit" placement="right">
              <Button icon={<CompressOutlined />} onClick={zoomToFit} />
            </Tooltip>
            <Tooltip title="Zoom in" placement="right">
              <Button
                icon={<ZoomInOutlined />}
                onMouseDown={zoomIn}
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
                <Button
                  icon={<ScissorOutlined />}
                  onClick={toggleSectionView}
                />
              </Tooltip>
            )}
          </div>

          {sectionView && (
            <div className="View-controls-second">
              <div className="View-controls-second-left">
                <Tooltip title="Stop" placement="left">
                  <Button icon={<StopOutlined />} onClick={toggleSectionView} />
                </Tooltip>
                <Radio.Group
                  onChange={handleTransform}
                  value={transform}
                  className="View-controls-radio"
                >
                  <Tooltip title="Translate" placement="left">
                    <Radio value="translate">
                      <DragOutlined />
                    </Radio>
                  </Tooltip>
                  <Tooltip title="Rotate" placement="left">
                    <Radio value="rotate">
                      <SyncOutlined />
                    </Radio>
                  </Tooltip>
                </Radio.Group>
              </div>
              <div className="View-controls-second-right">
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
                      sectionViewHelper.current.toAxis(new Vector3(1, 0, 0))
                    }
                  >
                    X
                  </Button>
                </Tooltip>
                <Tooltip title="Snap to Y" placement="left">
                  <Button
                    className="ant-btn-icon-only"
                    onClick={() =>
                      sectionViewHelper.current.toAxis(new Vector3(0, 1, 0))
                    }
                  >
                    Y
                  </Button>
                </Tooltip>
                <Tooltip title="Snap to Z" placement="left">
                  <Button
                    className="ant-btn-icon-only"
                    onClick={() =>
                      sectionViewHelper.current.toAxis(new Vector3(0, 0, 1))
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
              </div>
            </div>
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

export interface IViewProps {
  project: IProjectWithData
  simulation?: ISimulation
  geometry?: IGeometry & { needCleanup?: boolean }
  result?: ISimulationTaskFile
}

/**
 * View
 * @memberof Components.Project.View
 * @param props Props
 */
const View = ({
  project,
  simulation,
  geometry,
  result
}: IViewProps): JSX.Element => {
  // State
  const [part, setPart]: [{ uuid?: string; buffer: Buffer }, Function] =
    useState()
  const [previous, setPrevious]: [any, Function] = useState()
  const [loading, setLoading]: [boolean, Function] = useState(false)

  // Part
  useEffect(() => {
    if (simulation && result) {
      if (result.glb !== previous?.glb) {
        setPrevious(result)
        loadPart(result, 'result')
      }
    } else if (geometry) {
      if (geometry.id !== previous?.id) {
        setPrevious(geometry)
        loadPart(geometry, 'geometry')
      }
    }
  }, [simulation, geometry, result])

  /**
   * Load part
   * @param {Object} file File
   */
  const loadPart = async (
    file: {
      needCleanup?: boolean
      id?: string
      originPath?: string
      glb?: string
    },
    type: string
  ) => {
    setLoading(true)
    try {
      if (file.needCleanup) {
        // Cleanup
        setPart()
      } else {
        // Load

        const partContent =
          type === 'geometry'
            ? await GeometryAPI.getPart({ id: file.id })
            : await ResultAPI.load(
                { id: simulation.id },
                { originPath: file.originPath, glb: file.glb }
              )

        setPart(partContent)
      }
    } catch (err) {
      ErrorNotification(errors.partError, err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Render
   */
  return <ThreeView loading={loading} project={project} part={part} />
}

export default View
