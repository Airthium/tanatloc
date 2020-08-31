/** @module renderer/components/project */

import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { Layout } from 'antd'
import { extend, Canvas, useThree, useFrame } from 'react-three-fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
extend({ OrbitControls, TrackballControls })

const CameraControls = () => {
  const {
    camera,
    gl: { domElement }
  } = useThree()

  const controls = useRef()

  useFrame(() => controls.current.update())

  return <orbitControls ref={controls} args={[camera, domElement]} />
  //trackballControls rotateSpeed={3}
}

const Box = (props) => {
  const mesh = useRef()

  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial
        attach="material"
        color={hovered ? 'hotpink' : 'orange'}
      />
    </mesh>
  )
}

const Sphere = (props) => {
  const mesh = useRef()

  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <sphereBufferGeometry attach="geometry" args={[0.5, 20, 20]} />
      <meshStandardMaterial
        attach="material"
        color={hovered ? 'hotpink' : 'orange'}
      />
    </mesh>
  )
}

const SphereMesh = (props) => {
  const mesh = useRef()

  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <sphereBufferGeometry attach="geometry" args={[0.5, 20, 20]} />
      <meshPhongMaterial
        wireframe={true}
        attach="material"
        color={hovered ? 'hotpink' : 'orange'}
      />
    </mesh>
  )
}

const Project = () => {
  // Router
  const router = useRouter()
  const { id } = router.query
  console.log('project id: ' + id)

  console.log(window.devicePixelRatio)

  return (
    <Layout>
      <Canvas colorManagement pixelRatio={window.devicePixelRatio}>
        <CameraControls />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} />
        <SphereMesh position={[0, -1.2, 0]} />
        <SphereMesh position={[0, 1.2, 0]} />
        <Sphere position={[0, 0, -1.2]} />
      </Canvas>
    </Layout>
  )
}

export default Project
