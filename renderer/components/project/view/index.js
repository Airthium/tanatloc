/** @module renderer/components/project/view */

import { useRef, useState, useEffect } from 'react'
import { Button, Divider, Drawer, Layout, Switch, Tooltip } from 'antd'
import {
  BorderlessTableOutlined,
  CompressOutlined,
  ControlOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  SelectOutlined,
  PlusOutlined,
  RadiusUprightOutlined,
  MinusOutlined
} from '@ant-design/icons'
import {
  AmbientLight,
  Box3,
  BoxGeometry,
  Mesh,
  MeshStandardMaterial,
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

const ThreeView = () => {
  // Ref
  const mount = useRef(null)
  const scene = useRef()
  const camera = useRef()
  const renderer = useRef()
  const controls = useRef()
  const gridHelper = useRef()
  const selectionHelper = useRef()

  // State
  const [controlVisible, setControlVisible] = useState(false)
  const [transparent, setTransparent] = useState(false)

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
    pointLight1.position.set(10, 50, 0)
    const pointLight2 = new PointLight('#ffffff')
    pointLight2.position.set(-10, -50, 0)
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
      camera.current,
      scene.current,
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
    }
  }, [])

  const computeSceneBoundingSphere = () => {
    const box = new Box3()
    scene.current.children.forEach((child) => {
      if (child.visible && child.type === 'Mesh') {
        const childBox = child.geometry.boundingBox
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
  const zoomIn = () => {
    zoom(1)
    zoomInProgress = requestAnimationFrame(zoomIn)
  }

  const zoomOut = () => {
    zoom(-1)
    zoomInProgress = requestAnimationFrame(zoomOut)
  }

  const zoomStop = () => {
    cancelAnimationFrame(zoomInProgress)
    zoomInProgress = null
  }

  const zoomToFit = () => {
    const sphere = scene.current.boundingSphere
    if (!sphere) return

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
    camera.current.updateProjectionMatrix()
  }

  const addCube = () => {
    const geometry = new BoxGeometry(
      10 * Math.random(),
      10 * Math.random(),
      10 * Math.random()
    )
    geometry.translate(
      -5 + 10 * Math.random(),
      -5 + 10 * Math.random(),
      -5 + 10 * Math.random()
    )
    geometry.computeBoundingBox()
    geometry.computeBoundingSphere()
    const material = new MeshStandardMaterial({
      color: 0xff00ff,
      opacity: transparent ? 0.5 : 1,
      depthWrite: !transparent
    })
    const cube = new Mesh(geometry, material)
    scene.current.add(cube)

    computeSceneBoundingSphere()
    gridHelper.current.update()
  }

  // TODO to remove
  useEffect(() => {
    addCube()
    zoomToFit()
  }, [])

  const removeCube = () => {
    const children = scene.current.children.filter(
      (child) => child.type === 'Mesh'
    )
    scene.current.remove(children.pop())

    computeSceneBoundingSphere()
    gridHelper.current.update()
  }

  const toggleGrid = (checked) => {
    gridHelper.current.setVisible(checked)
  }

  useEffect(() => {
    scene.current.children.forEach((child) => {
      if (child.type === 'Mesh') {
        child.material.opacity = transparent ? 0.5 : 1
        child.material.depthWrite = !transparent
      }
    })
  }, [transparent, scene.current])

  return (
    <div
      style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0 }}
      ref={mount}
    >
      <Layout className="View-controls">
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
          bodyStyle={{
            display: 'flex',
            flexDirection: 'column',
            padding: '10px'
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
                  checked={transparent}
                  checkedChildren={<RadiusUprightOutlined />}
                  unCheckedChildren={<RadiusUprightOutlined />}
                  onChange={(checked) => setTransparent(checked)}
                />
              </Tooltip>
            </div>
          </div>
          <Divider />
          <div className="drawer-group">
            <div className="drawer-subgroup">
              <Tooltip title="Zoom out">
                <Button
                  icon={<ZoomOutOutlined />}
                  onMouseDown={zoomOut}
                  onMouseUp={zoomStop}
                  onMouseOut={zoomStop}
                />
              </Tooltip>
              <Tooltip title="Zoom to fit">
                <Button icon={<CompressOutlined />} onClick={zoomToFit} />
              </Tooltip>
              <Tooltip title="Zoom in">
                <Button
                  icon={<ZoomInOutlined />}
                  onMouseDown={zoomIn}
                  onMouseUp={zoomStop}
                  onMouseOut={zoomStop}
                />
              </Tooltip>
            </div>
            <div className="drawer-subgroup">
              <Tooltip title="Zoom to selection">
                <Button
                  icon={<SelectOutlined />}
                  onClick={() => selectionHelper.current.start()}
                />
              </Tooltip>
            </div>
          </div>
          <Divider />
          <div className="drawer-group">
            <Button icon={<PlusOutlined />} onClick={addCube} />
            <Button icon={<MinusOutlined />} onClick={removeCube} />
          </div>
        </Drawer>
      </Layout>
    </div>
  )
}

const View = () => {
  return <ThreeView />
}

export default View
