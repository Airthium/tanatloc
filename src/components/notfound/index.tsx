/** @module Components.Notfound */

import { useRouter } from 'next/router'
import { Layout, Typography } from 'antd'
import {
  AmbientLight,
  CylinderGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  TetrahedronGeometry,
  Vector3,
  WebGLRenderer
} from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Side from '@/components/assets/side'
import Menu from '@/components/indexpage/menu'

import style from '@/components/indexpage/index.style'
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
  const [loaded, setLoaded] = useState(false)
  const mount = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (loaded) return
    if (!WebGL.isWebGLAvailable()) {
      router.push('/webgl')
      return
    }

    const div = mount.current
    /* istanbul ignore next */
    if (!div) return
    const loader = new GLTFLoader()
    loader.load(
      'models/cone.glb',
      (gltf: GLTF) => {
        let width = div.clientWidth
        let height = div.clientHeight

        const renderer = new WebGLRenderer({ antialias: true })
        renderer.setClearColor(0xffffff, 0)
        renderer.setSize(width, height)
        div.appendChild(renderer.domElement)

        // Scene
        const scene = new Scene()

        // Camera
        const camera = new PerspectiveCamera()
        camera.position.set(0, -2000, 0)
        camera.lookAt(scene.position)

        // MESH
        gltf.scene.rotateX((90 * Math.PI) / 180)
        scene.add(gltf.scene)
        console.log(scene)

        const ambientLight = new AmbientLight(0x404040)
        scene.add(ambientLight)
        // const light = new PointLight( 0xff0000, 1, 100 );
        // light.position.set( 50, 50, 50 );
        // scene.add( light );
        renderer.render(scene, camera)
        setLoaded(true)
      },
      () => undefined,
      (err) => console.log(err)
    )
  }, [router])

  /**
   * Render
   */
  return (
    <Layout css={style.index}>
      <Menu />
      <div
        ref={mount}
        css={css({
          left: 0,
          top: 0,
          width: '1000px',
          height: '800px',
          zIndex: 0
        })}
      />
      <Layout.Content>
        <Side
          left={
            <>
              <Typography.Title level={1}></Typography.Title>
              <Typography.Title level={1}>404</Typography.Title>
              <Typography.Title level={1}>Page not found</Typography.Title>
              <Typography.Title level={1}></Typography.Title>
            </>
          }
          right={<></>}
        />
        <Side
          left={
            <>
              <Typography.Title level={2}>
                The page you are trying to reach does not exist
              </Typography.Title>
            </>
          }
          right={
            <Typography.Title
              level={2}
              underline={true}
              onClick={() => router.push('/')}
              style={{ cursor: 'pointer' }}
            >
              Come back home
            </Typography.Title>
          }
        />
      </Layout.Content>
    </Layout>
  )
}

export default NotFound
