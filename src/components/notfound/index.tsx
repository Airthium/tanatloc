/** @module Components.Notfound */

import { useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { Button, Layout, Typography } from 'antd'
import {
  AmbientLight,
  BufferAttribute,
  Clock,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  Vector3,
  WebGLRenderer
} from 'three'

import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import WebGL from 'three/examples/jsm/capabilities/WebGL'

import style from '@/components/notfound/index.module.css'

/**
 * 404
 * @returns NotFound
 */
const NotFound = (): JSX.Element => {
  // Router
  const router = useRouter()
  const mount = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!WebGL.isWebGLAvailable()) {
      ;(async () => {
        await router.push('/webgl')
      })()
      return
    }

    const div = mount.current
    /* istanbul ignore next */
    if (!div) return

    // Clock
    const clock = new Clock()

    // Size
    let width = div.clientWidth
    let height = div.clientHeight

    // Renderer
    const renderer = new WebGLRenderer({ antialias: true, alpha: true })
    renderer.setClearColor(0x000000, 0)
    renderer.setSize(width, height)
    div.appendChild(renderer.domElement)

    // Scene
    const scene = new Scene()

    // Camera
    const camera = new PerspectiveCamera()
    camera.aspect = width / height
    camera.far = 5000

    // Ambient light
    const ambiant = new AmbientLight(0xffffff, 0.5)
    scene.add(ambiant)

    // Light
    const light1 = new PointLight(0xffffff, 0.5, 0)
    light1.position.set(0, 400, 1500)
    scene.add(light1)
    const light2 = new PointLight(0xffffff, 0.5, 0)
    light2.position.set(1500, 400, 0)
    scene.add(light2)

    // Group
    const group = new Group()
    scene.add(group)

    // Load geometry
    const loader = new GLTFLoader()

    // Load
    loader.load(
      '/models/cone.glb',
      (glb) => {
        const cone = glb.scene.children[0] as Mesh

        // Geometry
        const geometry = cone.geometry

        // Color
        const position = geometry.getAttribute('position') as BufferAttribute
        geometry.setAttribute(
          'color',
          new BufferAttribute(new Float32Array(position.count * 3), 3)
        )
        const color = geometry.getAttribute('color') as BufferAttribute
        for (let i = 0; i < position.count; ++i) {
          const y = position.getY(i)
          if ((y > 400 && y < 500) || (y > 600 && y < 700)) {
            color.setXYZ(i, 1, 1, 1)
          } else {
            color.setXYZ(i, 248 / 255, 116 / 255, 46 / 255)
          }
        }

        // Material
        const material = new MeshBasicMaterial({
          color: 0xffffff,
          vertexColors: true,
          wireframe: true
        })

        // Mesh
        const mesh = new Mesh(geometry, material)
        mesh.userData = {
          type: 'Cone'
        }

        // Group
        group.add(mesh)

        // Camera
        const sphere = geometry.boundingSphere!
        camera.position.set(
          sphere.center.x + 2 * sphere.radius,
          sphere.center.y + 1.5 * sphere.radius,
          sphere.center.z + 2 * sphere.radius
        )
        camera.lookAt(mesh.position)
      },
      (err) => console.error(err)
    )

    // Load font
    const fontLoader = new FontLoader()

    // Load
    fontLoader.load(
      'fonts/saira/Saira_Black_Regular.json',
      (font) => {
        // Geometry
        const text = new TextGeometry('404', {
          font: font,
          size: 300,
          height: 10,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 10,
          bevelSize: 8,
          bevelOffset: 0,
          bevelSegments: 5
        })

        // Material
        const material = new MeshStandardMaterial({
          color: 0xffffff,
          metalness: 0.75,
          roughness: 0.5
        })

        // Mesh
        const mesh = new Mesh(text, material)
        mesh.userData = {
          type: 'Text'
        }

        // Position
        text.computeBoundingBox()
        const dimensions = new Vector3()
        dimensions.subVectors(text.boundingBox!.max, text.boundingBox!.min)
        mesh.position.set(
          -100 - dimensions.x / 2,
          400 - dimensions.y / 2,
          -100 - dimensions.z / 2
        )
        mesh.rotation.y = Math.PI / 4

        // Group
        group.add(mesh)
      },
      () => {},
      (err) => {
        console.error('An error happened')
        console.error(err)
      }
    )

    /**
     * Animate
     */
    const animate = () => {
      setTimeout(() => requestAnimationFrame(animate), 1000 / 30)

      const timeElapsed = clock.getDelta()

      const group = scene.children.filter((child) => child.type === 'Group')[0]
      group?.rotateY(0.2 * timeElapsed)

      renderer.render(scene, camera)
    }

    // Start
    animate()

    /**
     * On resize
     */
    const onResize = () => {
      width = div.clientWidth
      height = div.clientHeight

      camera.aspect = width / height
      camera.updateProjectionMatrix()

      renderer.setSize(width, height)
    }

    // Event
    window.addEventListener('resize', onResize)

    onResize()

    // Free
    return () => {
      // Scene
      scene.children.forEach((child) => {
        if (child.type === 'Group')
          child.children.forEach((subChild) => {
            const mesh = subChild as Mesh
            mesh.geometry?.dispose()
          })
      })
      scene.clear()

      // Event
      window.removeEventListener('resize', onResize)
    }
  }, [router])

  /**
   * Home
   */
  const home = useCallback((): void => {
    ;(async () => {
      await router.push('/')
    })()
  }, [router])

  /**
   * Render
   */
  return (
    <Layout className={style.index}>
      <Layout.Content className={style.content}>
        <div ref={mount} className={style.three} />
        <div className={style.description}>
          <Typography.Title level={1} style={{ textAlign: 'center' }}>
            Page not found
          </Typography.Title>
          <Typography.Title level={3} style={{ textAlign: 'center' }}>
            The requested URL was not found on the server
          </Typography.Title>
          <Button
            type="primary"
            className={style.descriptionButton}
            onClick={home}
          >
            Return to Home
          </Button>
        </div>
      </Layout.Content>
    </Layout>
  )
}

export default NotFound
