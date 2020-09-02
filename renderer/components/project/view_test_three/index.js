import {
  AmbientLight,
  BoxGeometry,
  Color,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  WebGLRenderer
} from 'three'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import { useRef, useEffect } from 'react'

const View = () => {
  const canvasRef = useRef()

  let { canvas, scene, camera, renderer, controls, render, addMesh } = {}
  useEffect(() => {
    console.log('useEffect')
    canvas = canvasRef.current

    let width = canvas.parentNode.clientWidth
    let height = canvas.parentNode.clientHeight

    canvas.width = width
    canvas.height = height

    // Scene
    scene = new Scene()
    scene.background = new Color(0xffffff)

    // Camera
    camera = new PerspectiveCamera(5, width / height, 0.1, 100000)
    camera.position.z = 100
    scene.add(camera)

    // Lights
    const ambientLight = new AmbientLight()

    const pointLight = new PointLight()
    pointLight.position.set(10, 10, 10)

    scene.add(ambientLight)
    scene.add(pointLight)

    // Renderer
    renderer = new WebGLRenderer({
      powerPreference: 'high-performance',
      canvas: canvas
    })
    renderer.setPixelRatio(window.devicePixelRatio || 1)
    renderer.setSize(width, height)

    // Controls
    controls = new TrackballControls(camera, canvas)
    controls.rotateSpeed = 4.5
    controls.panSpeed = 0.1

    // // Box
    // const geometry = new BoxGeometry(1, 1, 1)
    // const material = new MeshStandardMaterial({
    //   wireframe: true,
    //   color: 'orange'
    // })
    // const cube = new Mesh(geometry, material)
    // scene.add(cube)

    addMesh = (mesh) => {
      scene.add(mesh)
    }

    const resize = () => {
      console.log('resize')
      width = canvas.parentNode.clientWidth
      height = canvas.parentNode.clientHeight

      canvas.width = width
      canvas.height = height

      camera.aspect = width / height
      camera.updateProjectionMatrix()

      renderer.setSize(width, height)
    }
    window.addEventListener('resize', resize)

    // Render
    render = () => {
      requestAnimationFrame(render)
      controls.update()
      renderer.render(scene, camera)
    }

    render()
  }, [])

  // Add mesh
  useEffect(() => {
    const geometry = new BoxGeometry(1, 1, 1)
    const material = new MeshStandardMaterial({
      wireframe: true,
      color: 'orange'
    })
    const cube = new Mesh(geometry, material)
    addMesh(cube)
  }, [addMesh])

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} />
    </div>
  )
}

export default View
