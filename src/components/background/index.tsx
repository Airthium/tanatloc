/** @module Components.Background */

import { useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  TetrahedronGeometry,
  Vector3,
  WebGLRenderer
} from 'three'
import WebGL from 'three/examples/jsm/capabilities/WebGL'

import style from './index.module.css'

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
  const mount = useRef<HTMLDivElement>(null)

  // Mount
  useEffect(() => {
    if (!WebGL.isWebGLAvailable()) {
      router.push('/webgl').catch()
      return
    }

    const div = mount.current
    /* istanbul ignore next */
    if (!div) return

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
    renderer.setPixelRatio(window.devicePixelRatio ?? 1)

    // Mount
    div.appendChild(renderer.domElement)

    // Tetrahedra
    const rotationX: number[] = []
    const rotationY: number[] = []
    const rotationZ: number[] = []

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
      setTimeout(() => {
        requestAnimationFrame(animate)
      }, 1000 / 30)
    }

    // Start
    animate()

    // Event listener
    window.addEventListener('resize', resize)

    // Unmount
    return () => {
      // Remove event listener
      window.removeEventListener('resize', resize)

      // Unmount renderer
      div.removeChild(renderer.domElement)

      // Clear scene
      ;(
        scene.children as Mesh<TetrahedronGeometry, MeshBasicMaterial>[]
      ).forEach((child) => {
        child.geometry.dispose()
        child.material.dispose()
        scene.remove(child)
      })
    }
  }, [router])

  /**
   * Render
   */
  return <div className={style.background} ref={mount} />
}

export default Background
