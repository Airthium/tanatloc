/** @module Components.Notfound */

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { Button, Layout, Typography } from 'antd'
import {
  BufferAttribute,
  Clock,
  Color,
  ConeGeometry,
  DirectionalLight,
  Float32BufferAttribute,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  PointLight,
  Scene,
  WebGLRenderer
} from 'three'
import { css } from '@emotion/react'

import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader'
import WebGL from 'three/examples/jsm/capabilities/WebGL'

import Side from '@/components/assets/side'

import style from '@/components/notfound/index.style'

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
      router.push('/webgl')
      return
    }

    const div = mount.current
    /* istanbul ignore next */
    if (!div) return

    // Size
    const width = div.clientWidth
    const height = div.clientHeight

    // Renderer
    const renderer = new WebGLRenderer({ antialias: true })
    renderer.setClearColor('#fad114')
    renderer.setSize(width, height)
    div.appendChild(renderer.domElement)

    // Scene
    const scene = new Scene()

    // Camera
    const camera = new PerspectiveCamera()
    camera.aspect = width / height

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
        const position = geometry.getAttribute('position')
        geometry.setAttribute(
          'color',
          new BufferAttribute(new Float32Array(position.count * 3), 3)
        )
        const color = geometry.attributes.color
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

        // Scene
        scene.add(mesh)

        // Camera
        const sphere = geometry.boundingSphere!
        camera.position.set(
          sphere.center.x + sphere.radius,
          sphere.center.y + 2 * sphere.radius,
          sphere.center.z + sphere.radius
        )
        camera.lookAt(mesh.position)
      },
      (err) => console.error(err)
    )

    const clock = new Clock()

    /**
     * Animate
     */
    const animate = async () => {
      const timeElapsed = clock.getDelta()
      scene.children.forEach((child) => {
        if (child.type === 'Mesh') child.rotation.y += 0.2 * timeElapsed
      })

      renderer.render(scene, camera)

      await new Promise((resolve) => setTimeout(resolve, 1000 / 30))
      requestAnimationFrame(animate)
    }

    // Start
    animate()

    // Free
    return () => {
      // TODO
      // free memory
    }
  }, [router])

  /**
   * Render
   */
  return (
    <Layout>
      <Layout.Content>
        {/* <Typography
          css={css({
            position: 'absolute',
            zIndex: '2',
            color: '#fff',
            fontSize: '20rem',
            fontWeight: 'bold',
            textAlign: 'center',
            left: '50%',
            transform: 'translate(-50%, 0%)'
          })}
        >
          404
        </Typography> */}
        <div
          ref={mount}
          css={css({
            width: '100%',
            height: '100%',
            zIndex: 0
            // '> *': {
            //   maxHeight: '750px',
            //   maxWidth: '100%'
            // }
          })}
        />
        {/* <div
          css={css({
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          })}
        >
          <Typography.Title level={1} style={{ textAlign: 'center' }}>
            Page not found
          </Typography.Title>
          <Typography.Title level={1} style={{ textAlign: 'center' }}>
            The requested URL was not found on the server
          </Typography.Title>
          <Button
            type="primary"
            css={css({
              margin: 'auto',
              fontSize: '30px',
              height: '60px',
              marginTop: '30px',
              fontWeight: 'bold'
            })}
            onClick={() => router.push('/dashboard')}
          >
            Return to dashboard
          </Button>
        </div> */}
      </Layout.Content>
    </Layout>
  )
}

export default NotFound
