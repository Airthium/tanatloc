/** @module Components.Background */

import { useRef, useEffect } from 'react'
import { NextRouter, useRouter } from 'next/router'
import {
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  TetrahedronGeometry,
  Vector3,
  WebGLRenderer
} from 'three'

/**
 * Check WebGL
 */
export const checkWebGL = (router: NextRouter) => {
  try {
    const canvas = document.createElement('canvas')
    console.log(canvas)
    if (
      !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      )
    ) {
      return true
    } else {
      router.replace('/webgl')
      return false
    }
  } catch (e) {
    console.error('WEBGL not available ' + e)
    return false
  }
}

/**
 * Background
 * @returns Background
 */
const Background = (): JSX.Element => {
  // Router
  const router = useRouter()

  // Parameters
  const numberOfTetrahedra: number = 50
  const rotationSpeed: number = 0.005

  // Ref
  const mount = useRef(null)

  // Mount
  useEffect(() => {
    if (!checkWebGL(router)) {
      return
    }

    const div = mount.current

    let frameId: number

    let width = div.clientWidth
    let height = div.clientHeight

    // Scene
    const scene = new Scene()

    // Camera
    const camera = new PerspectiveCamera(10, width / height, 0.1, 1000)
    camera.position.z = 10

    // Renderer
    const renderer = new WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'low-power'
    })
    renderer.setClearColor('#ffffff', 0)
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio || 1)

    // Mount
    div.appendChild(renderer.domElement)

    // Tetrahedra
    const rotationX = []
    const rotationY = []
    const rotationZ = []
    // Visible height & width
    const offset = camera.position.z
    const hFOV = (camera.fov * Math.PI) / 180
    const h = 2 * Math.tan(hFOV / 2) * offset
    const w = h * camera.aspect
    // Build tetra
    for (let i = 0; i < numberOfTetrahedra; ++i) {
      const rand = Math.random()
      const material = new MeshBasicMaterial({
        color: rand * 0x0096c7 + (1 - rand) * 0xffffff,
        wireframe: true,
        transparent: Math.random() > 0.5,
        opacity: Math.random()
      })

      const geometry = new TetrahedronGeometry(
        0.1 + 0.075 * (0.5 - Math.random())
      )

      geometry.translate(
        -0.5 + 1 * w * Math.random(),
        -0.5 * h + 1 * h * Math.random(),
        0
      )

      geometry.lookAt(
        new Vector3(
          -1 + 2 * Math.random(),
          -1 + 2 * Math.random(),
          -1 + 2 * Math.random()
        )
      )
      rotationX.push(-rotationSpeed / 2 + rotationSpeed * Math.random())
      rotationY.push(-rotationSpeed / 2 + rotationSpeed * Math.random())
      rotationZ.push(-rotationSpeed / 2 + rotationSpeed * Math.random())

      const mesh = new Mesh(geometry, material)
      scene.add(mesh)
    }

    /**
     * Resize
     */
    const resize = (): void => {
      width = div.clientWidth
      height = div.clientHeight
      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    /**
     * Render scene
     */
    const renderScene = (): void => {
      scene.children.forEach(
        (
          child: { rotation: { x: number; y: number; z: number } },
          index: number
        ) => {
          child.rotation.x += rotationY[index]
          child.rotation.y += rotationX[index]
          child.rotation.z += rotationZ[index]
        }
      )

      renderer.render(scene, camera)
    }

    /**
     * Animate
     */
    const animate = (): void => {
      renderScene()
      frameId = requestAnimationFrame(animate)
    }

    /**
     * Stop
     */
    const stop = (): void => {
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
      div.removeChild(renderer.domElement)

      // Clear scene
      scene.children.forEach(
        (child: Mesh<TetrahedronGeometry, MeshBasicMaterial>) => {
          child.geometry.dispose()
          child.material.dispose()
          scene.remove(child)
        }
      )
    }
  }, [router])

  /**
   * Render
   */
  return <div className="Background" ref={mount} />
}

export default Background
