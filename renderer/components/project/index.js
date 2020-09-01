// /** @module renderer/components/project */

import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { extend, Canvas, useFrame, useThree } from 'react-three-fiber'
import { TrackballControls } from '../../../src/lib/three/TrackballControls'
extend({ TrackballControls })

const CameraControls = () => {
  const {
    camera,
    gl: { domElement }
  } = useThree()

  const controls = useRef()

  useFrame(() => controls.current.update())

  return (
    <trackballControls
      ref={controls}
      args={[camera, domElement]}
      rotation={4}
    />
  )
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

  // Pixel ratio
  let pixelRatio = 1
  if (typeof window !== 'undefined') pixelRatio = window.devicePixelRatio

  return (
    <Canvas colorManagement pixelRatio={pixelRatio}>
      <CameraControls />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
      <SphereMesh position={[0, -1.2, 0]} />
      <SphereMesh position={[0, 1.2, 0]} />
      <Sphere position={[0, 0, -1.2]} />
    </Canvas>
  )
}

export default Project
