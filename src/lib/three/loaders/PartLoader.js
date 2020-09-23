/** @module src/lib/three/loaders/PartLoader */

import {
  BufferGeometryLoader,
  Color,
  DoubleSide,
  Mesh,
  MeshStandardMaterial
} from 'three/build/three.module'

const PartLoader = () => {
  // Solid color
  const solidColor = new Color('gray')
  // Face color
  const faceColor = new Color('gray')
  // Edge color
  const edgeColor = new Color('black')

  const load = (part, transparent, clippingPlane) => {
    // const object = new Group()
    // const solids =new Group()
    // const faces = new Group()
    // const edges = new Group()
    const data = part.solids[0]

    const loader = new BufferGeometryLoader()
    const geometry = loader.parse(data)
    geometry.computeBoundingBox()
    geometry.computeBoundingSphere()

    const material = new MeshStandardMaterial({
      color: solidColor,
      side: DoubleSide,
      opacity: transparent ? 0.5 : 1,
      depthWrite: !transparent,
      clippingPlanes: [clippingPlane]
    })

    const mesh = new Mesh(geometry, material)

    return mesh
  }

  return { load }
}

export { PartLoader }
