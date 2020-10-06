/** @module renderer/components/project/view */

import { useRef, useState, useEffect } from 'react'
import { Button, Divider, Drawer, Layout, Radio, Switch, Tooltip } from 'antd'
import {
  BorderlessTableOutlined,
  CompressOutlined,
  ControlOutlined,
  DragOutlined,
  EyeInvisibleOutlined,
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
  Vector3,
  WebGLRenderer
} from 'three/build/three.module'

import { TrackballControls } from '../../../../src/lib/three/controls/TrackballControls'
import { AxisHelper } from '../../../../src/lib/three/helpers/AxisHelper'
import { NavigationHelper } from '../../../../src/lib/three/helpers/NavigationHelper'
import { GridHelper } from '../../../../src/lib/three/helpers/GridHelper'
import { SelectionHelper } from '../../../../src/lib/three/helpers/SelectionHelper'
import { SectionViewHelper } from '../../../../src/lib/three/helpers/SectionViewHelper'

import { PartLoader } from '../../../../src/lib/three/loaders/PartLoader'

import { get } from '../../../../src/api/part'

/**
 * ThreeView
 */
const ThreeView = ({ part }) => {
  // Ref
  const mount = useRef(null)
  const scene = useRef()
  const camera = useRef()
  const renderer = useRef()
  const controls = useRef()
  const gridHelper = useRef()
  const selectionHelper = useRef()
  const sectionViewHelper = useRef()

  // State
  const [controlVisible, setControlVisible] = useState(false)
  const [transparent, setTransparent] = useState(false)
  const [sectionView, setSectionView] = useState(false)
  const [transform, setTransform] = useState('translate')

  // Zoom factor
  const zoomFactor = 0.01

  // Mount
  useEffect(() => {
    let width = mount.current.clientWidth
    let height = mount.current.clientHeight
    let frameId

    // Scene
    scene.current = new Scene()

    // Camera
    camera.current = new PerspectiveCamera(50, width / height, 0.1, 1000)
    camera.current.position.z = 10

    // Light
    const ambientLight = new AmbientLight('#999999')
    const pointLight1 = new PointLight('#ffffff')
    pointLight1.decay = 2
    pointLight1.position.set(5, 1, 1)
    const pointLight2 = new PointLight('#ffffff')
    pointLight2.decay = 2
    pointLight2.position.set(-5, 1, 1)
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
    mount.current.appendChild(renderer.current.domElement)

    // Controls
    controls.current = new TrackballControls(camera.current, mount.current)
    controls.current.rotateSpeed = 3
    controls.current.panSpeed = 0.1

    // Axis
    const axisHelper = AxisHelper(renderer.current, camera.current, {
      offsetWidth: width - 150,
      offsetHeight: 0,
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
        offsetWidth: 0,
        offsetHeight: 0,
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

    /**
     * Render scene
     */
    const renderScene = () => {
      controls.current.update()

      renderer.current.setViewport(0, 0, width, height)
      renderer.current.render(scene.current, camera.current)

      axisHelper.render()

      navigationHelper.render()
    }

    /**
     * Handle resize
     */
    const handleResize = () => {
      width = mount.current.clientWidth
      height = mount.current.clientHeight
      renderer.current.setSize(width, height)
      camera.current.aspect = width / height
      camera.current.updateProjectionMatrix()

      axisHelper.resize({
        newOffsetWidth: width - 150,
        newOffsetHeight: 0,
        newWidth: 150,
        newHeight: 150
      })

      navigationHelper.resize({
        newOffsetWidth: 0,
        newOffsetHeight: 0,
        newWidth: 150,
        newHeight: 150
      })

      renderScene()
    }

    /**
     * Animate
     */
    const animate = () => {
      renderScene()
      /*frameId = */ requestAnimationFrame(animate)
    }

    /**
     * Start animate
     */
    const start = () => {
      // if (!frameId) {
      frameId = requestAnimationFrame(animate)
      // }
    }

    /**
     * Stop animate
     */
    const stop = () => {
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

      mount.current.removeChild(renderer.current.domElement)

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
        child.dispose()
        scene.current.remove(child)
      }
    })

    if (part) loadPart()
  }, [part])

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
    if (!sphere || sphere.radius === 0) return

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
      if (child.type === 'PointLight')
        child.position.normalize().multiplyScalar(1.5 * distance)
    })
  }

  /**
   * Load part
   * TODO WIP
   */
  const loadPart = async () => {
    //load
    const loader = PartLoader()
    const mesh = loader.load(
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
   * Render
   */
  return (
    <Layout className="View no-scroll">
      <Layout.Content className="View-content no-scroll">
        <div ref={mount} className="View-canvas" />
      </Layout.Content>
      <div className="View-controls">
        <Tooltip title="Controls">
          <Button
            icon={<ControlOutlined />}
            onClick={() => setControlVisible(!controlVisible)}
          />
        </Tooltip>
        <Drawer
          className="View-controls-drawer"
          title="Controls"
          visible={controlVisible}
          onClose={() => setControlVisible(!controlVisible)}
          mask={false}
          maskClosable={false}
          placement="right"
          getContainer={false}
          headerStyle={{
            borderLeft: '1px solid #f0f0f0'
          }}
          bodyStyle={{
            display: 'flex',
            flexDirection: 'column',
            padding: '10px',
            borderLeft: '1px solid #f0f0f0'
          }}
          width="100%"
        >
          <div className="drawer-group">
            <div className="drawer-subgroup">
              <Tooltip title="Display grid">
                <Switch
                  defaultChecked
                  checkedChildren={<BorderlessTableOutlined />}
                  unCheckedChildren={<BorderlessTableOutlined />}
                  onChange={toggleGrid}
                />
              </Tooltip>
            </div>
            <div className="drawer-subgroup">
              <Tooltip title="Set transparency">
                <Switch
                  className="transparent"
                  checked={transparent}
                  checkedChildren={<RadiusUprightOutlined />}
                  unCheckedChildren={<RadiusUprightOutlined />}
                  onChange={toggleTransparent}
                />
              </Tooltip>
            </div>
          </div>

          <Divider />

          <div className="drawer-group">
            <div className="drawer-subgroup">
              <Tooltip title="Zoom out" placement="left">
                <Button
                  icon={<ZoomOutOutlined />}
                  onMouseDown={zoomOut}
                  onMouseUp={zoomStop}
                  onMouseOut={zoomStop}
                />
              </Tooltip>
              <Tooltip title="Zoom to fit" placement="left">
                <Button icon={<CompressOutlined />} onClick={zoomToFit} />
              </Tooltip>
              <Tooltip title="Zoom in" placement="left">
                <Button
                  icon={<ZoomInOutlined />}
                  onMouseDown={zoomIn}
                  onMouseUp={zoomStop}
                  onMouseOut={zoomStop}
                />
              </Tooltip>
            </div>
            <div className="drawer-subgroup">
              <Tooltip title="Zoom to selection" placement="left">
                <Button
                  icon={<SelectOutlined />}
                  onClick={() => selectionHelper.current.start()}
                />
              </Tooltip>
            </div>
          </div>

          <Divider />

          <div className="drawer-group">
            {sectionView ? (
              <>
                <div className="drawer-subgroup">
                  <Tooltip title="Stop" placement="left">
                    <Button
                      icon={<StopOutlined />}
                      onClick={toggleSectionView}
                    />
                  </Tooltip>
                  <Radio.Group
                    onChange={handleTransform}
                    value={transform}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginTop: '10px'
                    }}
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
                <div className="drawer-subgroup">
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
              </>
            ) : (
              <Tooltip title="Section view">
                <Button
                  icon={<ScissorOutlined />}
                  onClick={toggleSectionView}
                />
              </Tooltip>
            )}
          </div>

          <Divider />

          <div className="drawer-group">
            <Button
              onClick={() =>
                scene.current.children
                  .filter((c) => c.type === 'Part')[0]
                  .startSelection(renderer.current, camera.current, 'face')
              }
            >
              Start
            </Button>
            <Button
              onClick={() =>
                scene.current.children
                  .filter((c) => c.type === 'Part')[0]
                  .stopSelection()
              }
            >
              Stop
            </Button>
          </div>
        </Drawer>
      </div>
    </Layout>
  )
}

const View = ({ simulation, type, setPartSummary }) => {
  const [part, setPart] = useState()

  useEffect(() => {
    const scheme = simulation?.scheme
    const subScheme = scheme?.categories[type]

    if (subScheme?.file?.part) {
      loadPart(subScheme.file)
    }
  }, [simulation, type])

  const loadPart = async (file) => {
    const partContent = await get({ id: simulation.id }, file)

    // Convert buffers
    partContent.solids?.forEach((solid) => {
      solid.buffer = JSON.parse(Buffer.from(solid.buffer).toString())
    })
    partContent.faces?.forEach((face) => {
      face.buffer = JSON.parse(Buffer.from(face.buffer).toString())
    })
    partContent.edges?.forEach((edge) => {
      edge.buffer = JSON.parse(Buffer.from(edge.buffer).toString())
    })

    const summary = {
      solids: partContent.solids?.map((solid) => {
        return {
          name: solid.name,
          number: solid.number,
          uuid: solid.buffer.uuid
        }
      }),
      faces: partContent.faces?.map((face) => {
        return {
          name: face.name,
          number: face.number,
          uuid: face.buffer.uuid
        }
      }),
      edges: partContent.edges?.map((edge) => {
        return {
          name: face.name,
          number: face.number,
          uuid: face.buffer.uuid
        }
      })
    }

    setPart(partContent)
    setPartSummary(summary)
  }

  return <ThreeView part={part} />
}

export default View
