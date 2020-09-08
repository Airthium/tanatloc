/** @module renderer/components/project/view */

import { useRouter } from 'next/router'
import { useRef, useState, useEffect } from 'react'
import { Button, Divider, Drawer, Layout, Tooltip } from 'antd'
import {
  CompressOutlined,
  ControlOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  SelectOutlined,
  PlusOutlined,
  MinusOutlined,
  ArrowLeftOutlined,
  MenuOutlined
} from '@ant-design/icons'
import {
  AmbientLight,
  BoxGeometry,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  Sphere,
  WebGLRenderer
} from 'three/build/three.module'
import { TrackballControls } from '../../../../src/lib/three/controls/TrackballControls'
import { AxisHelper } from '../../../../src/lib/three/helpers/AxisHelper'
import { NavigationHelper } from '../../../../src/lib/three/helpers/NavigationHelper'
import { SelectionHelper } from '../../../../src/lib/three/helpers/SelectionHelper'

const ThreeView = () => {
  // Ref
  const mount = useRef(null)
  const scene = useRef()
  const camera = useRef()
  const renderer = useRef()
  const controls = useRef()
  const selectionHelper = useRef()

  // Router
  const router = useRouter()

  // State
  const [menuVisible, setMenuVisible] = useState(false)
  const [controlVisible, setControlVisible] = useState(false)

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
    // mount.current.appendChild(renderer.current.domElement)
    //TODO restore that

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
      camera.current,
      controls.current,
      {
        offsetWidth: 0,
        offsetHeight: 0,
        width: 150,
        height: 150
      }
    )

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
      frameId = requestAnimationFrame(animate)
    }

    /**
     * Start animate
     */
    const start = () => {
      if (!frameId) {
        frameId = requestAnimationFrame(animate)
      }
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

      // mount.current.removeChild(renderer.current.domElement)
      // TODO restore that

      // Clean scene
      scene.current.children.forEach((child) => {
        scene.current.remove(child)
      })
    }
  }, [])

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
    const meshes = scene.current.children
    const sphere = new Sphere()

    meshes.forEach((mesh) => {
      if (
        mesh.type === 'AmbientLight' ||
        mesh.type === 'PointLight' ||
        mesh.type === 'AxisHelper'
      )
        return

      const boundingSphere = mesh.geometry.boundingSphere
      sphere.radius = Math.max(sphere.radius, boundingSphere.radius)
      sphere.center = sphere.center
        .add(boundingSphere.center)
        .multiplyScalar(1 / 2)
    })

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
    geometry.computeBoundingSphere()
    const material = new MeshStandardMaterial({ color: 0xff00ff })
    const cube = new Mesh(geometry, material)
    scene.current.add(cube)
  }

  useEffect(() => {
    addCube()
    zoomToFit()
  }, [])

  const removeCube = () => {
    if (scene.current.children.length > 3) scene.current.children.pop()
  }

  return (
    <div
      style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0 }}
      ref={mount}
    >
      <Layout className="View-menu">
        <Tooltip title="Menu">
          <Button
            icon={<MenuOutlined />}
            onClick={() => setMenuVisible(!menuVisible)}
          />
        </Tooltip>
        <Drawer
          className="View-menu-drawer"
          title="Menu"
          visible={menuVisible}
          onClose={() => setMenuVisible(!menuVisible)}
          mask={false}
          maskClosable={false}
          placement="left"
          getContainer={false}
          bodyStyle={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '10px'
          }}
          width="100%"
        >
          <div className="View-drawer-group">
            <Tooltip title="Dashboard">
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => router.push('/dashboard')}
              />
            </Tooltip>
          </div>
          <Divider />
          <div className="View-drawer-group">
            <Tooltip title="New simulation">
              <Button icon={<PlusOutlined />} />
            </Tooltip>
          </div>
        </Drawer>
      </Layout>

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
          <div className="View-drawer-group">
            <div className="View-drawer-subgroup">
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
            <div className="View-drawer-subgroup">
              <Tooltip title="Zoom to selection">
                <Button
                  icon={<SelectOutlined />}
                  onClick={() => selectionHelper.current.start()}
                />
              </Tooltip>
            </div>
          </div>
          <Divider />
          <div className="View-drawer-group">
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
