import {
  Color,
  BufferGeometryLoader,
  Box3,
  Group,
  Vector3,
  Sphere,
  LineBasicMaterial,
  Line,
  CatmullRomCurve3,
  TubeBufferGeometry,
  Mesh,
  MeshPhysicalMaterial,
  DoubleSide
} from 'three/build/three.module.js'

const GeometryLoader = (geometryObject, clippingPlanes) => {
  if (!geometryObject.part) return

  const solidColor = new Color('gray')
  const faceColor = new Color('grey')
  const edgeColor = new Color('black')

  const boundingBox = new Box3()

  const part = geometryObject.part

  const object = new Group()
  const solids = new Group()
  const faces = new Group()
  const edges = new Group()

  object.name = 'geometry'
  object.uuid = geometryObject.id
  object.add(solids, faces, edges)

  if (part.solids)
    part.solids.forEach((solid) => {
      const mesh = loadElement(solid, solidColor, clippingPlanes)
      boundingBox.expandByObject(mesh)
      mesh.name = 'solid'
      solids.add(mesh)
    })

  if (part.faces)
    part.faces.forEach((face) => {
      const mesh = loadElement(face, faceColor, clippingPlanes)
      boundingBox.expandByObject(mesh)
      mesh.name = 'face'
      faces.add(mesh)
    })

  if (part.edges)
    part.edges.forEach((edge) => {
      const mesh = loadElement(edge, edgeColor, clippingPlanes, true)
      boundingBox.expandByObject(mesh)
      mesh.name = 'edge'
      edges.add(mesh)
    })

  object.boundingBox = boundingBox
  object.center = new Vector3()
  object.size = new Vector3()
  object.boundingSphere = new Sphere()
  object.boundingBox.getCenter(object.center)
  object.boundingBox.getSize(object.size)
  object.boundingBox.getBoundingSphere(object.boundingSphere)

  return object
}

const loadElement = (element, defaultColor, clippingPlanes, isEdge) => {
  const loader = new BufferGeometryLoader()

  const buffer = JSON.parse(Buffer.from(element.buffer).toString())
  const geometry = loader.parse(buffer)

  let color = defaultColor
  if (geometry.attributes.color) {
    color = new Color(
      geometry.attributes.color.array[0],
      geometry.attributes.color.array[1],
      geometry.attributes.color.array[2]
    )
  }

  let mesh
  if (isEdge) {
    const material = new LineBasicMaterial({
      color: color,
      linewidth: 2,
      side: DoubleSide,
      clippingPlanes: clippingPlanes
    })
    mesh = new Line(geometry, material)
    // Add selection helper
    const points = []
    const positions = geometry.attributes.position
    const itemSize = positions.itemSize
    const count = positions.count
    for (let i = 0; i < count; ++i) {
      points.push(
        new Vector3(
          positions.array[i * itemSize + 0],
          positions.array[i * itemSize + 1],
          positions.array[i * itemSize + 2]
        )
      )
    }
    const curve = new CatmullRomCurve3(points)
    const edgeHelperGeometry = new TubeBufferGeometry(
      curve,
      count,
      0.5,
      8,
      false
    )
    const edgeHelperMaterial = new LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.5,
      side: DoubleSide,
      clippingPlanes: clippingPlanes
    })
    const edgeHelper = new Mesh(edgeHelperGeometry, edgeHelperMaterial)
    edgeHelper.visible = false
    edgeHelper.material.originalColor = mesh.material.color
    mesh.add(edgeHelper)
  } else {
    const material = new MeshPhysicalMaterial({
      color: color,
      side: DoubleSide,
      clippingPlanes: clippingPlanes,
      clipShadows: true,
      transparent: true,
      opacity: 1,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1
    })
    mesh = new Mesh(geometry, material)
    // const edges = new THREE.EdgesGeometry(geometry, 50)
    // mesh = new THREE.LineSegments(edges, material) // TODO - VIEW test it
  }
  mesh.material.originalColor = mesh.material.color
  mesh.label = buffer.label
  mesh.uuid = buffer.uuid

  return mesh
}

// GeometryLoader.prototype = Object.create({})
// GeometryLoader.prototype.contructor = GeometryLoader

export { GeometryLoader }
