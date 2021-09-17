const run = (location, name) => {
  const path = require('path')
  const fs = require('fs')
  const THREE = require('three')
  const Canvas = require('canvas')
  const { Blob, FileReader } = require('vblob')

  // Global scope (fake)
  global.window = global
  global.Blob = Blob
  global.FileReader = FileReader
  global.THREE = THREE
  global.document = {
    createElement: (nodeName) => {
      if (nodeName !== 'canvas')
        throw new Error(`Cannot create node ${nodeName}`)
      return new Canvas(256, 256)
    }
  }

  require('three/examples/js/exporters/GLTFExporter')
  require('three/examples/js/math/Lut')

  require('three/examples/js/utils/BufferGeometryUtils')

  // Solid color
  const solidColor = new THREE.Color('gray')
  // Face color
  const faceColor = new THREE.Color('gray')

  /**
   * Load part
   * @param {string} location Location
   * @param {string} name Name
   * @return {Object} Legacy ThreeJS json
   */
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

    return part
  }

  /**
   * Load part
   * @param {Object} part Part
   * @returns {Object} ThreeJS object
   */
  const load = (part) => {
    const type = part.type

    const object = new THREE.Group()

    // Solids
    const solids = new THREE.Group()
    type === 'geometry' &&
      part.solids &&
      part.solids.forEach((solid) => {
        const mesh = loadElement(type, solid, solidColor)
        mesh.visible = false
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

  /**
   * Load part element
   * @param {string} type Type
   * @param {Object} element Element
   * @param {string} color Color
   * @returns {Object} Element
   */
  const loadElement = (type, element, color) => {
    const loader = new THREE.BufferGeometryLoader()
    const buffer = Buffer.from(element.buffer)
    const json = JSON.parse(buffer.toString())
    let geometry = loader.parse(json)

    let mesh = {}
    if (type === 'geometry') mesh = loadGeometryElement(geometry, color)
    else if (type === 'mesh') mesh = loadMeshElement(geometry, color)
    else if (type === 'result') mesh = loadResultElement(geometry, color)

    // Mesh data
    mesh.userData.uuid = json.uuid
    mesh.userData.name = element.name
    mesh.userData.number = element.number

    // Index
    mesh.geometry = THREE.BufferGeometryUtils.mergeVertices(mesh.geometry)

    return mesh
  }

  /**
   * Load geometry element
   * @param {Object} geometry Geometry
   * @param {string} color Color
   * @returns {Object} Element
   */
  const loadGeometryElement = (geometry, color) => {
    // Convert mm to m
    const position = geometry.getAttribute('position')
    position.array = position.array.map((p) => p * 1e-3)
    geometry.setAttribute('position', position)

    // Get color
    const colorAttribute = geometry.getAttribute('color')
    if (colorAttribute) {
      color = new THREE.Color(
        colorAttribute.array[0],
        colorAttribute.array[1],
        colorAttribute.array[2]
      )
      delete geometry.attributes.color
    }

    // Bounding box / sphere
    geometry.computeBoundingBox()
    geometry.computeBoundingSphere()

    // Material
    const material = new THREE.MeshStandardMaterial({
      color: color,
      side: THREE.DoubleSide
    })

    // Mesh
    return new THREE.Mesh(geometry, material)
  }

  /**
   * Load mesh element
   * @param {Object} geometry Geometry
   * @param {string} color Color
   * @returns {Object} Mesh
   */
  const loadMeshElement = (geometry, color) => {
    // Wireframe
    const wireframe = new THREE.WireframeGeometry(geometry)
    wireframe.computeBoundingBox()
    wireframe.computeBoundingSphere()

    // Material
    const material = new THREE.LineBasicMaterial({
      color: color,
      linewidth: 1
    })

    // Mesh
    return new THREE.LineSegments(wireframe, material)
  }

  /**
   * Load result element
   * @param {Object} geometry Geometry
   * @param {string} color Color
   * @returns {Object} Element
   */
  const loadResultElement = (geometry, color) => {
    // Boundaing box / sphere
    geometry.computeBoundingBox()
    geometry.computeBoundingSphere()

    // LUT
    const lut = new THREE.Lut()
    const data = geometry.getAttribute('data')
    if (data) {
      // Min / max
      const minUsingReduce = () =>
        data.array.reduce(
          (m, currentValue) => Math.min(m, currentValue),
          data.array[0]
        )
      const maxUsingReduce = () =>
        data.array.reduce(
          (m, currentValue) => Math.max(m, currentValue),
          data.array[0]
        )

      const min = minUsingReduce()
      const max = maxUsingReduce()

      if (min === max) {
        if (min === 0) {
          lut.setMin(min || -1)
          lut.setMax(max || 1)
        } else {
          lut.setMin(min - min * 0.1)
          lut.setMin(min + min * 0.1)
        }
      } else {
        lut.setMin(min)
        lut.setMax(max)
      }

      // Colors
      const vertexColors = new Float32Array(data.count * 3)
      for (let i = 0; i < data.count; ++i) {
        const vertexColor = lut.getColor(data.array[i])
        vertexColors[3 * i + 0] = vertexColor.r
        vertexColors[3 * i + 1] = vertexColor.g
        vertexColors[3 * i + 2] = vertexColor.b
      }
      geometry.setAttribute(
        'color',
        new THREE.Float32BufferAttribute(vertexColors, 3)
      )
    }
    geometry.deleteAttribute('data')

    // Material
    const material = new THREE.MeshStandardMaterial({
      vertexColors: THREE.VertexColors,
      color: color,
      side: THREE.DoubleSide
    })

    // Wireframe
    const wireframeGeometry = new THREE.WireframeGeometry(geometry)
    const wireframeMaterial = new THREE.LineBasicMaterial({
      color: color,
      linewidth: 2
    })

    const wireframe = new THREE.LineSegments(
      wireframeGeometry,
      wireframeMaterial
    )
    wireframe.geometry = THREE.BufferGeometryUtils.mergeVertices(
      wireframe.geometry
    )

    // Mesh
    const mesh = new THREE.Mesh(geometry, material)
    mesh.add(wireframe)
    mesh.lut = lut

    return mesh
  }

  /**
   * Convert
   * @param {string} location Location
   * @param {string} name Name
   */
  const convert = async (location, name) => {
    try {
      // Load part
      const part = loadPart(location, name)

      // Load mesh
      const mesh = load(part)

      // GLTF
      const exporter = new THREE.GLTFExporter()
      const gltf = await new Promise((resolve) =>
        exporter.parse(
          mesh,
          (content) => {
            resolve(content)
          },
          { onlyVisible: false, binary: false }
        )
      )

      console.log(JSON.stringify(gltf))
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = run

// convert(process.argv[2], process.argv[3])
