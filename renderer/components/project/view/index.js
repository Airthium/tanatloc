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
} from 'three/build/three.module.js'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import { useRef, useEffect } from 'react'

const View = () => {
  const canvasRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current

    const width = canvas.parentNode.clientWidth
    const height = canvas.parentNode.clientHeight

    canvas.width = width
    canvas.height = height

    // Scene
    const scene = new Scene()
    scene.background = new Color(0xffffff)

    // Camera
    const camera = new PerspectiveCamera(5, width / height, 0.1, 100000)
    camera.position.z = 100
    scene.add(camera)

    // Lights
    const ambientLight = new AmbientLight(0xffffff, 1)

    const pointLight = new PointLight(0xffffff, 1, 0)
    pointLight.position.set(10, 10, 10)

    scene.add(ambientLight)
    scene.add(pointLight)

    // Renderer
    const renderer = new WebGLRenderer({
      powerPreference: 'high-performance',
      canvas: canvas
    })
    renderer.setPixelRatio(window.devicePixelRatio || 1)
    renderer.setSize(width, height)

    // Controls
    const controls = new TrackballControls(camera, canvas)
    controls.rotateSpeed = 4.5
    controls.panSpeed = 0.1

    // Box
    const geometry = new BoxGeometry(1, 1, 1)
    const material = new MeshStandardMaterial({ color: 'orange' })
    const cube = new Mesh(geometry, material)
    scene.add(cube)

    // Animate
    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()
  }, [])

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} />
    </div>
  )
}

export default View
