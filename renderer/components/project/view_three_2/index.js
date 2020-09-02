import { useRef, useEffect, useState } from 'react'
import { Layout, Button } from 'antd'
import { CompressOutlined } from '@ant-design/icons'
import {
  AmbientLight,
  PointLight,
  AxesHelper,
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshStandardMaterial,
  Mesh,
  Sphere
} from 'three'
import { TrackballControls } from '../../../../src/lib/three/controls/TrackballControls'
import { AxisHelper } from '../../../../src/lib/three/helpers/AxisHelper'
import { OrthographicCamera } from 'three/build/three.module'

const Vis = () => {
  const mount = useRef(null)
  // const [isAnimating, setAnimating] = useState(true)
  const [zoomToFit, setZoomToFit] = useState(false)
  const [add, addCube] = useState(false)
  const [remove, removeCube] = useState(false)

  const scene = useRef()
  const camera = useRef()
  const renderer = useRef()
  const controls = useRef()
  useEffect(() => {
    let width = mount.current.clientWidth
    let height = mount.current.clientHeight
    // let frameId

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
      antialias: true
    })
    renderer.current.setClearColor('#ffffff')
    renderer.current.setSize(width, height)
    renderer.current.setPixelRatio(window.devicePixelRatio || 1)
    renderer.current.autoClear = false
    mount.current.appendChild(renderer.current.domElement)

    // Axis
    const axisHelper = new AxisHelper()
    const axisHelperScene = new Scene()
    axisHelperScene.add(axisHelper)
    const axisHelperCamera = new OrthographicCamera()

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

      renderer.current.setViewport(0, 0, 128, 128)
      renderer.current.render(axisHelperScene, camera.current)
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
      /*frameId = */ requestAnimationFrame(animate)
    }

    // const start = () => {
    //   if (!frameId) {
    //     frameId = requestAnimationFrame(animate)
    //   }
    // }

    // const stop = () => {
    //   cancelAnimationFrame(frameId)
    //   frameId = null
    // }

    // Event listeners
    window.addEventListener('resize', handleResize)

    // controls.addEventListener('start', () => {
    //   console.log('start')
    //   start()
    // })
    // controls.addEventListener('end', () => {
    //   console.log('stop')
    //   stop()
    // })
    // controls.addEventListener('change', () => {
    //   console.log('change')
    // })

    // Start rendering
    animate()

    // Unmount
    return () => {
      stop()
      window.removeEventListener('resize', handleResize)
      mount.current.removeChild(renderer.current.domElement)

      // scene.current.remove(cube)
      // geometry.dispose()
      // material.dispose()
    }
  }, [])

  // Zoom to fit
  useEffect(() => {
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
  }, [zoomToFit])

  /**
   * Add cube
   */
  useEffect(() => {
    const geometry = new BoxGeometry(
      10 * Math.random(),
      10 * Math.random(),
      10 * Math.random()
    )
    const material = new MeshStandardMaterial({
      /*wireframe: true,*/ color: 0xff00ff
    })
    const cube = new Mesh(geometry, material)
    scene.current.add(cube)
  }, [add])

  /**
   * remove cube
   */
  useEffect(() => {
    scene.current.children.pop()
  }, [remove])

  return (
    <div
      style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0 }}
      ref={mount}
    >
      <Layout style={{ position: 'absolute' }}>
        <Button
          icon={<CompressOutlined />}
          onClick={() => setZoomToFit(!zoomToFit)}
        >
          Zoom to fit
        </Button>
        <Button onClick={() => addCube(!add)}>Add cube</Button>
        <Button onClick={() => removeCube(!remove)}>Remove last</Button>
      </Layout>
    </div>
  )
}

const View = () => {
  return <Vis />
}

export default View
