/** @module Components.Notfound */

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { Button, Layout, Typography } from 'antd'
import {
  Clock,
  ConeGeometry,
  Material,
  Mesh,
  MeshBasicMaterial,
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

    console.log(width)
    console.log(height)

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
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/three/libs/draco/')
    loader.setDRACOLoader(dracoLoader)
    const ktx2Loader = new KTX2Loader()
    ktx2Loader.setTranscoderPath('node_modules/three//examples/js/libs/basis/')
    loader.setKTX2Loader(ktx2Loader)

    loader.load(
      '/models/cone.glb',
      (glb) => {
        const cone = glb.scene.children[0] as Mesh

        // Material
        ;(cone.material as MeshBasicMaterial).wireframe = true

        // Scene
        scene.add(cone)

        // Camera
        const sphere = cone.geometry.boundingSphere!
        camera.position.set(
          sphere.center.x + sphere.radius,
          sphere.center.y + 2 * sphere.radius,
          sphere.center.z + sphere.radius
        )
        camera.lookAt(cone.position)
      },
      (err) => console.error(err)
    )

    // // create a cone
    // const geometry = new ConeGeometry(5, 10, 32)
    // const material = new MeshStandardMaterial({
    //   color: 0xffa500,
    //   metalness: 0.5
    // })
    // const cone = new Mesh(geometry, material)
    // cone.position.set(0, -10, 0)
    // cone.scale.set(0.6, 0.6, 0.6)

    // // create a light
    // const light = new PointLight(0xffffff, 3, 100)
    // light.position.set(2.5, 5, 5)

    // add cone and light to the scene

    // scene.add(cone)
    // scene.add(light)

    // // create a camera
    // const camera = new PerspectiveCamera(
    //   75,
    //   window.innerWidth / window.innerHeight,
    //   0.1,
    //   1000
    // )

    // set the camera position so that it points at the cone
    // camera.position.set(0, -10, 13)
    // camera.lookAt(cone.position)

    // create a renderer
    // const renderer = new WebGLRenderer()
    // renderer.setSize(window.innerWidth, window.innerHeight)
    // renderer.setClearColor('#fad114')

    // // add the renderer to the page
    // div.appendChild(renderer.domElement)

    const clock = new Clock()

    function animate() {
      // update the rotation of the cones based on the time elapsed since the last frame
      const timeElapsed = clock.getDelta()
      scene.children.forEach((child) => {
        child.rotation.y += 0.2 * timeElapsed
      })
      // cone.rotation.y += 0.2 * timeElapsed
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
