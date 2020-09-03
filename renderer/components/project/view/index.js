import { useRef, useState, useEffect } from 'react'
import { Button, Divider, Drawer, Layout, Tooltip } from 'antd'
import {
  CloseOutlined,
  CompressOutlined,
  ControlOutlined,
  ZoomInOutlined,
  ZoomOutOutlined
} from '@ant-design/icons'
import {
  AmbientLight,
  BoxGeometry,
  Mesh,
  MeshStandardMaterial,
  PCFShadowMap,
  PerspectiveCamera,
  PointLight,
  Scene,
  Sphere,
  WebGLRenderer
} from 'three'
import { TrackballControls } from '../../../../src/lib/three/controls/TrackballControls'
import { AxisHelper } from '../../../../src/lib/three/helpers/AxisHelper'
import { NavigationHelper } from '../../../../src/lib/three/helpers/NavigationHelper'
// import { ZoomSelectionHelper } from '../../../../src/lib/three/helpers/ZoomSelectionHelper'

const Vis = () => {
  const mount = useRef(null)
  const scene = useRef()
  const camera = useRef()
  const renderer = useRef()
  const controls = useRef()

  const [controlVisible, setControlVisible] = useState(false)

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
    camera.current.position.z = 4

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
    // renderer.current.shadowMap.enabled = true
    // renderer.current.shadowMap.type = PCFShadowMap
    mount.current.appendChild(renderer.current.domElement)

    // Axis
    const axisHelper = new AxisHelper(renderer.current, camera.current, {
      offsetWidth: width - 150,
      offsetHeight: 0,
      width: 150,
      height: 150
    })

    // NavigationHelper
    const navigationHelper = new NavigationHelper(
      renderer.current,
      camera.current,
      {
        offsetWidth: width - 150,
        offsetHeight: height - 210,
        width: 150,
        height: 150
      }
    )

    // ZoomSelectionHelper
    // const zoomSelectionHelper = new ZoomSelectionHelper(renderer.current)

    // Controls
    controls.current = new TrackballControls(camera.current, mount.current)
    controls.current.rotateSpeed = 3
    controls.current.panSpeed = 0.1

    /**
     * Render scene
     */
    const renderScene = () => {
      controls.current.update()

      renderer.current.clear()

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

      mount.current.removeChild(renderer.current.domElement)

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
    const material = new MeshStandardMaterial({ color: 0xff00ff })
    const cube = new Mesh(geometry, material)
    scene.current.add(cube)
  }

  const removeCube = () => {
    if (scene.current.children.length > 3) scene.current.children.pop()
  }

  return (
    <div
      style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0 }}
      ref={mount}
    >
      <Layout
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '60px',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          padding: '0 10px',
          backgroundColor: 'transparent'
        }}
      >
        <Tooltip title="Controls">
          <Button
            icon={<ControlOutlined />}
            onClick={() => setControlVisible(!controlVisible)}
          />
        </Tooltip>
        <Drawer
          visible={controlVisible}
          closable={false}
          mask={false}
          maskClosable={false}
          placement="right"
          getContainer={false}
          style={{ position: 'absolute' }}
          bodyStyle={{
            display: 'flex',
            alignItems: 'center',
            padding: '0 10px'
          }}
          width="100%"
        >
          <Button
            icon={<CloseOutlined />}
            onClick={() => setControlVisible(!controlVisible)}
          />
          <Divider type="vertical" />
          <Button
            icon={<ZoomOutOutlined />}
            onMouseDown={zoomOut}
            onMouseUp={zoomStop}
            onMouseOut={zoomStop}
          />
          <Button icon={<CompressOutlined />} onClick={zoomToFit} />
          <Button
            icon={<ZoomInOutlined />}
            onMouseDown={zoomIn}
            onMouseUp={zoomStop}
            onMouseOut={zoomStop}
          />
          <Divider type="vertical" />
          <Button onClick={addCube}>Add cube</Button>
          <Divider type="vertical" />
          <Button onClick={removeCube}>Remove last</Button>
        </Drawer>
      </Layout>
    </div>
  )
}

const View = () => {
  return <Vis />
}

export default View
