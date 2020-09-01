import { useEffect, useRef } from 'react'
import { DoubleSide } from 'three'
import { extend, Canvas, useThree, useFrame } from 'react-three-fiber'
import { TrackballControls } from '../../../../src/lib/three/TrackballControls'
extend({ TrackballControls })

import solid0 from '../../../public/test/geometry/cube/solid_0'

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
      rotateSpeed={4}
    />
  )
}

const Geometry = (props) => {
  const position = new Float32Array(solid0.data.attributes.position.array)
  const normal = new Float32Array(solid0.data.attributes.normal.array)
  const color = new Float32Array(solid0.data.attributes.color.array)

  return (
    <mesh {...props}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attachObject={['attributes', 'position']}
          count={position.length / 3}
          array={position}
          itemSize={3}
        />
        <bufferAttribute
          attachObject={['attributes', 'normal']}
          count={normal.length / 3}
          array={normal}
          itemSize={3}
        />
        <bufferAttribute
          attachObject={['attributes', 'color']}
          count={color.length / 3}
          array={color}
          itemSize={3}
        />
      </bufferGeometry>
      <meshStandardMaterial side={DoubleSide} attach="material" />
    </mesh>
  )
}

// const Sphere = (props) => {
//   const mesh = useRef()

//   const [hovered, setHover] = useState(false)
//   const [active, setActive] = useState(false)

//   return (
//     <mesh
//       {...props}
//       ref={mesh}
//       scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
//       onClick={() => setActive(!active)}
//       onPointerOver={() => setHover(true)}
//       onPointerOut={() => setHover(false)}
//     >
//       <sphereBufferGeometry attach="geometry" args={[0.5, 20, 20]} />
//       <meshStandardMaterial
//         attach="material"
//         color={hovered ? 'hotpink' : 'orange'}
//       />
//     </mesh>
//   )
// }

// const SphereMesh = (props) => {
//   const mesh = useRef()

//   const [hovered, setHover] = useState(false)
//   const [active, setActive] = useState(false)

//   return (
//     <mesh
//       {...props}
//       ref={mesh}
//       scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
//       onClick={() => setActive(!active)}
//       onPointerOver={() => setHover(true)}
//       onPointerOut={() => setHover(false)}
//     >
//       <sphereBufferGeometry attach="geometry" args={[0.5, 20, 20]} />
//       <meshPhongMaterial
//         wireframe={true}
//         attach="material"
//         color={hovered ? 'hotpink' : 'orange'}
//       />
//     </mesh>
//   )
// }

const View = () => {
  // Pixel ratio
  let pixelRatio = 1
  if (typeof window !== 'undefined') pixelRatio = window.devicePixelRatio

  return (
    <Canvas camera={{ far: 100000 }} colorManagement pixelRatio={pixelRatio}>
      {cameraControls}
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Geometry />
    </Canvas>
  )
}

export default View
