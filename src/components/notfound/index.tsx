/** @module Components.Notfound */

import { useRouter } from 'next/router'
import { Button, Layout, Typography } from 'antd'
import {
  Clock,
  ConeGeometry,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  WebGLRenderer
} from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Side from '@/components/assets/side'
import Menu from '@/components/indexpage/menu'

import style from '@/components/notfound/index.style'
import { useEffect, useRef, useState } from 'react'
import WebGL from 'three/examples/jsm/capabilities/WebGL'
import { css } from '@emotion/react'

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
    // create a cone
    const geometry = new ConeGeometry(5, 10, 32)
    const material = new MeshStandardMaterial({
      color: 0xffa500,
      metalness: 0.5
    })
    const cone = new Mesh(geometry, material)
    cone.position.set(0, -10, 0)
    cone.scale.set(0.6, 0.6, 0.6)

    // create a light
    const light = new PointLight(0xffffff, 3, 100)
    light.position.set(2.5, 5, 5)

    // add cone and light to the scene
    const scene = new Scene()
    scene.add(cone)
    scene.add(light)

    // create a camera
    const camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )

    // set the camera position so that it points at the cone
    camera.position.set(0, -10, 13)
    camera.lookAt(cone.position)

    // create a renderer
    const renderer = new WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor('#fad114')

    // add the renderer to the page
    div.appendChild(renderer.domElement)

    const clock = new Clock()

    function animate() {
      // update the rotation of the cones based on the time elapsed since the last frame
      const timeElapsed = clock.getDelta()
      cone.rotation.y += 0.2 * timeElapsed
      // render the scene
      renderer.render(scene, camera)

      // request the next animation frame
      requestAnimationFrame(animate)
    }

    // start animating
    animate()

    // render the scene
    renderer.render(scene, camera)
  }, [router])

  /**
   * Render
   */
  return (
    <Layout css={style.index}>
      <Menu />
      <Layout.Content css={style.content}>
        <Typography
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
        </Typography>
        <div
          ref={mount}
          css={css({
            left: 0,
            top: 0,
            maxHeight: '600px',
            zIndex: 0,
            '> *': {
              maxHeight: '750px',
              maxWidth: '100%'
            }
          })}
        ></div>
        <div
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
        </div>
      </Layout.Content>
    </Layout>
  )
}

export default NotFound
