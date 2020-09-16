/** @module renderer/components/background */

import { useRef, useEffect } from 'react'
import {
  Mesh,
  MeshDepthMaterial,
  PerspectiveCamera,
  Scene,
  TetrahedronGeometry,
  WebGLRenderer
} from 'three/build/three.module'

const Background = () => {
  // Ref
  const mount = useRef(null)

  // Mount
  useEffect(() => {
    let frameId

    let width = mount.current.clientWidth
    let height = mount.current.clientHeight

    // Scene
    const scene = new Scene()

    // Camera
    const camera = new PerspectiveCamera(10, width / height, 0.1, 1000)
    camera.position.z = 10

    // Renderer
    const renderer = new WebGLRenderer({
      antialias: true,
      alpha: true
    })
    renderer.setClearColor('#ffffff', 0)
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio || 1)

    // Mount
    mount.current.appendChild(renderer.domElement)

    // Tetrahedra
    // Rotations
    const rotationX = []
    const rotationY = []
    const rotationZ = []
    // Visible height
    const offset = camera.position.z
    const hFOV = (camera.fov * Math.PI) / 180
    const h = 2 * Math.tan(hFOV / 2) * offset
    const w = h * camera.aspect
    for (let i = 0; i < 100; ++i) {
      const geometry = new TetrahedronGeometry(0.1 * Math.random())
      geometry.translate(
        -w / 2 + w * Math.random(),
        -h / 2 + h * Math.random(),
        0
      )
      rotationX.push(-0.005 + 0.01 * Math.random())
      rotationY.push(-0.005 + 0.01 * Math.random())
      rotationZ.push(-0.005 + 0.01 * Math.random())
      const material = new MeshDepthMaterial({
        wireframe: true,
        transparent: true,
        opacity: 0.2
      })
      const mesh = new Mesh(geometry, material)
      scene.add(mesh)
    }

    /**
     * Resize
     */
    const resize = () => {
      if (mount.current) {
        width = mount.current.clientWidth
        height = mount.current.clientHeight
        renderer.setSize(width, height)
        camera.aspect = width / height
        camera.updateProjectionMatrix()
      }
    }

    /**
     * Render scene
     */
    const renderScene = () => {
      scene.children.forEach((child, index) => {
        child.rotation.x += rotationY[index]
        child.rotation.y += rotationX[index]
        child.rotation.z += rotationZ[index]
      })

      renderer.render(scene, camera)
    }

    /**
     * Animate
     */
    const animate = () => {
      renderScene()
      frameId = requestAnimationFrame(animate)
    }

    /**
     * Stop
     */
    const stop = () => {
      cancelAnimationFrame(frameId)
    }

    // Start
    animate()

    // Event listener
    window.addEventListener('resize', resize)

    // Unmount
    return () => {
      // Stop
      stop()

      // Remove event listener
      window.removeEventListener('resize', resize)

      // Unmount renderer
      mount.current.removeChild(renderer.domElement)

      // Clear scene
      scene.children.forEach((child) => scene.remove(child))
    }
  }, [])

  return <div className="Background" ref={mount} />
}

export default Background
