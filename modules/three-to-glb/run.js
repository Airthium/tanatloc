const path = require('path')
const fs = require('fs')
const THREE = require('three')
const Canvas = require('canvas')
const { Blob, FileReader } = require('vblob')
const gltfPipeline = require('gltf-pipeline')

// Global scope (fake)
global.window = global
global.Blob = Blob
global.FileReader = FileReader
global.THREE = THREE
global.document = {
  createElement: (nodeName) => {
    if (nodeName !== 'canvas') throw new Error(`Cannot create node ${nodeName}`)
    const canvas = new Canvas(256, 256)
    return canvas
  }
}

require('three/examples/js/exporters/GLTFExporter')

const solidColor = new THREE.Color('gray')
const faceColor = new THREE.Color('gray')
const edgeColor = new THREE.Color('black')

const loadPart = (location, name) => {
  const partFile = path.join(location, name)
  const partData = fs.readFileSync(partFile)
  const part = JSON.parse(partData)

  // Load solids
  if (part.solids) {
    part.solids.map((solid) => {
      const file = path.join(location, solid.path)
      solid.buffer = fs.readFileSync(file)
      delete solid.path
    })
  }

  // Load faces
  if (part.faces) {
    part.faces.map((face) => {
      const file = path.join(location, face.path)
      face.buffer = fs.readFileSync(file)
      delete face.path
    })
  }

  // Load edges
  if (part.edges) {
    part.edges.map(async (edge) => {
      const file = path.join(location, edge.path)
      edge.buffer = fs.readFileSYnc(file)
      delete edge.path
    })
  }

  return part
}

const load = (part) => {
  const type = part.type

  const object = new THREE.Group()
  object.type = 'Part'

  // Solids
  const solids = new THREE.Group()
  type === 'geometry' &&
    part.solids &&
    part.solids.forEach((solid) => {
      const mesh = loadElement(type, solid, solidColor)
      solids.add(mesh)
    })
  object.add(solids)

  // Faces
  const faces = new THREE.Group()
  part.faces &&
    part.faces.forEach((face) => {
      const mesh = loadElement(type, face, faceColor)
      faces.add(mesh)
    })
  object.add(faces)

  object.uuid = part.uuid

  return object
}

const loadElement = (type, element, color) => {
  const loader = new THREE.BufferGeometryLoader()
  const buffer = element.buffer
  const json = JSON.parse(Buffer.from(buffer).toString())
  const geometry = loader.parse(json)

  // Convert mm to m
  // Meshes and results are already converted
  if (type === 'geometry') {
    const position = geometry.getAttribute('position')
    position.array = position.array.map((p) => p * 1e-3)
    geometry.setAttribute('position', position)
  }

  // Color
  const colorAttribute = geometry.getAttribute('color')
  if (colorAttribute) {
    color = new THREE.Color(
      colorAttribute.array[0],
      colorAttribute.array[1],
      colorAttribute.array[2]
    )
  }

  if (type === 'geometry') {
    geometry.computeBoundingBox()
    geometry.computeBoundingSphere()

    const material = new THREE.MeshStandardMaterial({
      color: color,
      side: THREE.DoubleSide
    })

    const mesh = new THREE.Mesh(geometry, material)
    mesh.uuid = buffer.uuid

    return mesh
  }
}

/**
 * Convert part
 */
const convert = async (location, name) => {
  // Load part
  const part = loadPart(location, name)

  // Load mesh
  const mesh = load(part)

  const exporter = new THREE.GLTFExporter()
  const glft = await new Promise((resolve) =>
    exporter.parse(
      mesh,
      (content) => {
        resolve(content)
      },
      { binary: false }
    )
  )

  console.log(glft)

  // // GLB
  // const glb = await gltfPipeline.gltfToGlb(glft)

  // console.log(glb.glb.toString())

  // return glb
}

convert(process.argv[2], process.argv[3])
