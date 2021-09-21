/**
 * Custom re-implementation of https://github.com/mrdoob/three.js/blob/dev/examples/js/exporters/GLTFExporter.js
 */

;(function () {
  class GLTFExporter {
    constructor() {
      this.pluginCallbacks = []
    }

    /**
     * Parse scenes and generate GLTF output
     * @param  {Scene or [threeToGlbGlobal.THREE.Scenes]} input   threeToGlbGlobal.THREE.Scene or Array of threeToGlbGlobal.THREE.Scenes
     * @param  {Function} onDone  Callback on completed
     * @param  {Object} options options
     */

    parse(input, onDone, options) {
      const writer = new GLTFWriter()
      const plugins = []

      for (let i = 0, il = this.pluginCallbacks.length; i < il; i++) {
        plugins.push(this.pluginCallbacks[i](writer))
      }

      writer.setPlugins(plugins)
      writer.write(input, onDone, options)
    }
  } //------------------------------------------------------------------------------
  // Constants
  //------------------------------------------------------------------------------

  const WEBGL_CONSTANTS = {
    POINTS: 0x0000,
    LINES: 0x0001,
    LINE_LOOP: 0x0002,
    LINE_STRIP: 0x0003,
    TRIANGLES: 0x0004,
    TRIANGLE_STRIP: 0x0005,
    TRIANGLE_FAN: 0x0006,
    UNSIGNED_BYTE: 0x1401,
    UNSIGNED_SHORT: 0x1403,
    FLOAT: 0x1406,
    UNSIGNED_INT: 0x1405,
    ARRAY_BUFFER: 0x8892,
    ELEMENT_ARRAY_BUFFER: 0x8893,
    NEAREST: 0x2600,
    LINEAR: 0x2601,
    NEAREST_MIPMAP_NEAREST: 0x2700,
    LINEAR_MIPMAP_NEAREST: 0x2701,
    NEAREST_MIPMAP_LINEAR: 0x2702,
    LINEAR_MIPMAP_LINEAR: 0x2703,
    CLAMP_TO_EDGE: 33071,
    MIRRORED_REPEAT: 33648,
    REPEAT: 10497
  }
  const THREE_TO_WEBGL = {}
  THREE_TO_WEBGL[threeToGlbGlobal.THREE.NearestFilter] = WEBGL_CONSTANTS.NEAREST
  THREE_TO_WEBGL[threeToGlbGlobal.THREE.NearestMipmapNearestFilter] =
    WEBGL_CONSTANTS.NEAREST_MIPMAP_NEAREST
  THREE_TO_WEBGL[threeToGlbGlobal.THREE.NearestMipmapLinearFilter] =
    WEBGL_CONSTANTS.NEAREST_MIPMAP_LINEAR
  THREE_TO_WEBGL[threeToGlbGlobal.THREE.LinearFilter] = WEBGL_CONSTANTS.LINEAR
  THREE_TO_WEBGL[threeToGlbGlobal.THREE.LinearMipmapNearestFilter] =
    WEBGL_CONSTANTS.LINEAR_MIPMAP_NEAREST
  THREE_TO_WEBGL[threeToGlbGlobal.THREE.LinearMipmapLinearFilter] =
    WEBGL_CONSTANTS.LINEAR_MIPMAP_LINEAR
  THREE_TO_WEBGL[threeToGlbGlobal.THREE.ClampToEdgeWrapping] =
    WEBGL_CONSTANTS.CLAMP_TO_EDGE
  THREE_TO_WEBGL[threeToGlbGlobal.THREE.RepeatWrapping] = WEBGL_CONSTANTS.REPEAT
  THREE_TO_WEBGL[threeToGlbGlobal.THREE.MirroredRepeatWrapping] =
    WEBGL_CONSTANTS.MIRRORED_REPEAT
  // https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#glb-file-format-specification

  const GLB_HEADER_BYTES = 12
  const GLB_HEADER_MAGIC = 0x46546c67
  const GLB_VERSION = 2
  const GLB_CHUNK_PREFIX_BYTES = 8
  const GLB_CHUNK_TYPE_JSON = 0x4e4f534a
  const GLB_CHUNK_TYPE_BIN = 0x004e4942 //------------------------------------------------------------------------------
  // Utility functions
  //------------------------------------------------------------------------------

  /**
   * Compare two arrays
   * @param  {Array} array1 Array 1 to compare
   * @param  {Array} array2 Array 2 to compare
   * @return {Boolean}        Returns true if both arrays are equal
   */

  function equalArray(array1, array2) {
    return (
      array1.length === array2.length &&
      array1.every(function (element, index) {
        return element === array2[index]
      })
    )
  }
  /**
   * Is identity matrix
   *
   * @param {Matrix4} matrix
   * @returns {Boolean} Returns true, if parameter is identity matrix
   */

  function isIdentityMatrix(matrix) {
    return equalArray(
      matrix.elements,
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
    )
  }
  /**
   * Get the min and max vectors from the given attribute
   * @param  {BufferAttribute} attribute Attribute to find the min/max in range from start to start + count
   * @param  {Integer} start
   * @param  {Integer} count
   * @return {Object} Object containing the `min` and `max` values (As an array of attribute.itemSize components)
   */

  function getMinMax(attribute, start, count) {
    const output = {
      min: new Array(attribute.itemSize).fill(Number.POSITIVE_INFINITY),
      max: new Array(attribute.itemSize).fill(Number.NEGATIVE_INFINITY)
    }

    for (let i = start; i < start + count; i++) {
      for (let a = 0; a < attribute.itemSize; a++) {
        let value

        if (attribute.itemSize > 4) {
          // no support for interleaved data for itemSize > 4
          value = attribute.array[i * attribute.itemSize + a]
        } else {
          if (a === 0) value = attribute.getX(i)
          else if (a === 1) value = attribute.getY(i)
          else if (a === 2) value = attribute.getZ(i)
          else if (a === 3) value = attribute.getW(i)
        }

        output.min[a] = Math.min(output.min[a], value)
        output.max[a] = Math.max(output.max[a], value)
      }
    }

    return output
  }
  /**
   * Get the required size + padding for a buffer, rounded to the next 4-byte boundary.
   * https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#data-alignment
   *
   * @param {Integer} bufferSize The size the original buffer.
   * @returns {Integer} new buffer size with required padding.
   *
   */

  function getPaddedBufferSize(bufferSize) {
    return Math.ceil(bufferSize / 4) * 4
  }

  class GLTFWriter {
    constructor() {
      this.plugins = []
      this.options = {}
      this.pending = []
      this.buffers = []
      this.byteOffset = 0
      this.buffers = []
      this.nodeMap = new Map()
      this.skins = []
      this.extensionsUsed = {}
      this.uids = new Map()
      this.uid = 0
      this.json = {
        asset: {
          version: '2.0',
          generator: 'threeToGlbGlobal.THREE.GLTFExporter'
        }
      }
      this.cache = {
        meshes: new Map(),
        attributes: new Map(),
        attributesNormalized: new Map(),
        materials: new Map(),
        textures: new Map(),
        images: new Map()
      }
    }

    setPlugins(plugins) {
      this.plugins = plugins
    }
    /**
     * Parse scenes and generate GLTF output
     * @param  {Scene or [threeToGlbGlobal.THREE.Scenes]} input   threeToGlbGlobal.THREE.Scene or Array of threeToGlbGlobal.THREE.Scenes
     * @param  {Function} onDone  Callback on completed
     * @param  {Object} options options
     */

    write(input, onDone, options) {
      this.options = Object.assign(
        {},
        {
          // default options
          binary: false,
          trs: false,
          onlyVisible: true,
          truncateDrawRange: true,
          embedImages: true,
          maxTextureSize: Infinity,
          animations: [],
          includeCustomExtensions: false
        },
        options
      )

      if (this.options.animations.length > 0) {
        // Only TRS properties, and not matrices, may be targeted by animation.
        this.options.trs = true
      }

      this.processInput(input)
      const writer = this
      Promise.all(this.pending).then(function () {
        const buffers = writer.buffers
        const json = writer.json
        const options = writer.options
        const extensionsUsed = writer.extensionsUsed // Merge buffers.

        const blob = new threeToGlbGlobal.Blob(buffers, {
          type: 'application/octet-stream'
        }) // Declare extensions.

        const extensionsUsedList = Object.keys(extensionsUsed)
        if (extensionsUsedList.length > 0)
          json.extensionsUsed = extensionsUsedList // Update bytelength of the single buffer.

        if (json.buffers && json.buffers.length > 0)
          json.buffers[0].byteLength = blob.size

        if (options.binary === true) {
          // https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#glb-file-format-specification
          const reader = new threeToGlbGlobal.FileReader()
          reader.readAsArrayBuffer(blob)

          reader.onloadend = function () {
            // Binary chunk.
            const binaryChunk = getPaddedArrayBuffer(reader.result)
            const binaryChunkPrefix = new DataView(
              new ArrayBuffer(GLB_CHUNK_PREFIX_BYTES)
            )
            binaryChunkPrefix.setUint32(0, binaryChunk.byteLength, true)
            binaryChunkPrefix.setUint32(4, GLB_CHUNK_TYPE_BIN, true) // JSON chunk.

            const jsonChunk = getPaddedArrayBuffer(
              stringToArrayBuffer(JSON.stringify(json)),
              0x20
            )
            const jsonChunkPrefix = new DataView(
              new ArrayBuffer(GLB_CHUNK_PREFIX_BYTES)
            )
            jsonChunkPrefix.setUint32(0, jsonChunk.byteLength, true)
            jsonChunkPrefix.setUint32(4, GLB_CHUNK_TYPE_JSON, true) // GLB header.

            const header = new ArrayBuffer(GLB_HEADER_BYTES)
            const headerView = new DataView(header)
            headerView.setUint32(0, GLB_HEADER_MAGIC, true)
            headerView.setUint32(4, GLB_VERSION, true)
            const totalByteLength =
              GLB_HEADER_BYTES +
              jsonChunkPrefix.byteLength +
              jsonChunk.byteLength +
              binaryChunkPrefix.byteLength +
              binaryChunk.byteLength
            headerView.setUint32(8, totalByteLength, true)
            const glbBlob = new threeToGlbGlobal.Blob(
              [
                header,
                jsonChunkPrefix,
                jsonChunk,
                binaryChunkPrefix,
                binaryChunk
              ],
              {
                type: 'application/octet-stream'
              }
            )
            const glbReader = new threeToGlbGlobal.FileReader()
            glbReader.readAsArrayBuffer(glbBlob)

            glbReader.onloadend = function () {
              onDone(glbReader.result)
            }
          }
        } else {
          if (json.buffers && json.buffers.length > 0) {
            const reader = new threeToGlbGlobal.FileReader()
            reader.readAsDataURL(blob)

            reader.onloadend = function () {
              const base64data = reader.result
              json.buffers[0].uri = base64data
              onDone(json)
            }
          } else {
            onDone(json)
          }
        }
      })
    }

    /**
     * Serializes a userData.
     *
     * @param {threeToGlbGlobal.THREE.Object3D|threeToGlbGlobal.THREE.Material} object
     * @param {Object} objectDef
     */

    serializeUserData(object, objectDef) {
      if (Object.keys(object.userData).length === 0) return
      const options = this.options
      const extensionsUsed = this.extensionsUsed

      try {
        const json = JSON.parse(JSON.stringify(object.userData))

        if (options.includeCustomExtensions && json.gltfExtensions) {
          if (objectDef.extensions === undefined) objectDef.extensions = {}

          for (const extensionName in json.gltfExtensions) {
            objectDef.extensions[extensionName] =
              json.gltfExtensions[extensionName]
            extensionsUsed[extensionName] = true
          }

          delete json.gltfExtensions
        }

        if (Object.keys(json).length > 0) objectDef.extras = json
      } catch (error) {
        console.warn(
          "threeToGlbGlobal.THREE.GLTFExporter: userData of '" +
            object.name +
            "' " +
            "won't be serialized because of JSON.stringify error - " +
            error.message
        )
      }
    }
    /**
     * Assign and return a temporal unique id for an object
     * especially which doesn't have .uuid
     * @param  {Object} object
     * @return {Integer}
     */

    getUID(object) {
      if (!this.uids.has(object)) this.uids.set(object, this.uid++)
      return this.uids.get(object)
    }
    /**
     * Checks if normal attribute values are normalized.
     *
     * @param {BufferAttribute} normal
     * @returns {Boolean}
     */

    isNormalizedNormalAttribute(normal) {
      const cache = this.cache
      if (cache.attributesNormalized.has(normal)) return false
      const v = new threeToGlbGlobal.THREE.Vector3()

      for (let i = 0, il = normal.count; i < il; i++) {
        // 0.0005 is from glTF-validator
        if (Math.abs(v.fromBufferAttribute(normal, i).length() - 1.0) > 0.0005)
          return false
      }

      return true
    }
    /**
     * Process a buffer to append to the default one.
     * @param  {ArrayBuffer} buffer
     * @return {Integer}
     */

    processBuffer(buffer) {
      const json = this.json
      const buffers = this.buffers
      if (!json.buffers)
        json.buffers = [
          {
            byteLength: 0
          }
        ] // All buffers are merged before export.

      buffers.push(buffer)
      return 0
    }
    /**
     * Process and generate a BufferView
     * @param  {BufferAttribute} attribute
     * @param  {number} componentType
     * @param  {number} start
     * @param  {number} count
     * @param  {number} target (Optional) Target usage of the BufferView
     * @return {Object}
     */

    processBufferView(attribute, componentType, start, count, target) {
      const json = this.json
      if (!json.bufferViews) json.bufferViews = [] // Create a new dataview and dump the attribute's array into it

      let componentSize

      if (componentType === WEBGL_CONSTANTS.UNSIGNED_BYTE) {
        componentSize = 1
      } else if (componentType === WEBGL_CONSTANTS.UNSIGNED_SHORT) {
        componentSize = 2
      } else {
        componentSize = 4
      }

      const byteLength = getPaddedBufferSize(
        count * attribute.itemSize * componentSize
      )
      const dataView = new DataView(new ArrayBuffer(byteLength))
      let offset = 0

      for (let i = start; i < start + count; i++) {
        for (let a = 0; a < attribute.itemSize; a++) {
          let value

          if (attribute.itemSize > 4) {
            // no support for interleaved data for itemSize > 4
            value = attribute.array[i * attribute.itemSize + a]
          } else {
            if (a === 0) value = attribute.getX(i)
            else if (a === 1) value = attribute.getY(i)
            else if (a === 2) value = attribute.getZ(i)
            else if (a === 3) value = attribute.getW(i)
          }

          if (componentType === WEBGL_CONSTANTS.FLOAT) {
            dataView.setFloat32(offset, value, true)
          } else if (componentType === WEBGL_CONSTANTS.UNSIGNED_INT) {
            dataView.setUint32(offset, value, true)
          } else if (componentType === WEBGL_CONSTANTS.UNSIGNED_SHORT) {
            dataView.setUint16(offset, value, true)
          } else if (componentType === WEBGL_CONSTANTS.UNSIGNED_BYTE) {
            dataView.setUint8(offset, value)
          }

          offset += componentSize
        }
      }

      const bufferViewDef = {
        buffer: this.processBuffer(dataView.buffer),
        byteOffset: this.byteOffset,
        byteLength: byteLength
      }
      if (target !== undefined) bufferViewDef.target = target

      if (target === WEBGL_CONSTANTS.ARRAY_BUFFER) {
        // Only define byteStride for vertex attributes.
        bufferViewDef.byteStride = attribute.itemSize * componentSize
      }

      this.byteOffset += byteLength
      json.bufferViews.push(bufferViewDef) // @TODO Merge bufferViews where possible.

      const output = {
        id: json.bufferViews.length - 1,
        byteLength: 0
      }
      return output
    }
    /**
     * Process and generate a BufferView from an image threeToGlbGlobal.Blob.
     * @param {threeToGlbGlobal.Blob} blob
     * @return {Promise<Integer>}
     */

    processBufferViewImage(blob) {
      const writer = this
      const json = writer.json
      if (!json.bufferViews) json.bufferViews = []
      return new Promise(function (resolve) {
        const reader = new threeToGlbGlobal.FileReader()
        reader.readAsArrayBuffer(blob)

        reader.onloadend = function () {
          const buffer = getPaddedArrayBuffer(reader.result)
          const bufferViewDef = {
            buffer: writer.processBuffer(buffer),
            byteOffset: writer.byteOffset,
            byteLength: buffer.byteLength
          }
          writer.byteOffset += buffer.byteLength
          resolve(json.bufferViews.push(bufferViewDef) - 1)
        }
      })
    }
    /**
     * Process attribute to generate an accessor
     * @param  {BufferAttribute} attribute Attribute to process
     * @param  {threeToGlbGlobal.THREE.BufferGeometry} geometry (Optional) Geometry used for truncated draw range
     * @param  {Integer} start (Optional)
     * @param  {Integer} count (Optional)
     * @return {Integer|null} Index of the processed accessor on the "accessors" array
     */

    processAccessor(attribute, geometry, start, count) {
      const options = this.options
      const json = this.json
      const types = {
        1: 'SCALAR',
        2: 'VEC2',
        3: 'VEC3',
        4: 'VEC4',
        16: 'MAT4'
      }
      let componentType // Detect the component type of the attribute array (float, uint or ushort)

      if (attribute.array.constructor === Float32Array) {
        componentType = WEBGL_CONSTANTS.FLOAT
      } else if (attribute.array.constructor === Uint32Array) {
        componentType = WEBGL_CONSTANTS.UNSIGNED_INT
      } else if (attribute.array.constructor === Uint16Array) {
        componentType = WEBGL_CONSTANTS.UNSIGNED_SHORT
      } else if (attribute.array.constructor === Uint8Array) {
        componentType = WEBGL_CONSTANTS.UNSIGNED_BYTE
      } else {
        throw new Error(
          'threeToGlbGlobal.THREE.GLTFExporter: Unsupported bufferAttribute component type.'
        )
      }

      if (start === undefined) start = 0
      if (count === undefined) count = attribute.count // @TODO Indexed buffer geometry with drawRange not supported yet

      if (
        options.truncateDrawRange &&
        geometry !== undefined &&
        geometry.index === null
      ) {
        const end = start + count
        const end2 =
          geometry.drawRange.count === Infinity
            ? attribute.count
            : geometry.drawRange.start + geometry.drawRange.count
        start = Math.max(start, geometry.drawRange.start)
        count = Math.min(end, end2) - start
        if (count < 0) count = 0
      } // Skip creating an accessor if the attribute doesn't have data to export

      if (count === 0) return null
      const minMax = getMinMax(attribute, start, count)
      let bufferViewTarget // If geometry isn't provided, don't infer the target usage of the bufferView. For
      // animation samplers, target must not be set.

      if (geometry !== undefined) {
        bufferViewTarget =
          attribute === geometry.index
            ? WEBGL_CONSTANTS.ELEMENT_ARRAY_BUFFER
            : WEBGL_CONSTANTS.ARRAY_BUFFER
      }

      const bufferView = this.processBufferView(
        attribute,
        componentType,
        start,
        count,
        bufferViewTarget
      )
      const accessorDef = {
        bufferView: bufferView.id,
        byteOffset: bufferView.byteOffset,
        componentType: componentType,
        count: count,
        max: minMax.max,
        min: minMax.min,
        type: types[attribute.itemSize]
      }
      if (attribute.normalized === true) accessorDef.normalized = true
      if (!json.accessors) json.accessors = []
      return json.accessors.push(accessorDef) - 1
    }
    /**
     * Process material
     * @param  {threeToGlbGlobal.THREE.Material} material Material to process
     * @return {Integer|null} Index of the processed material in the "materials" array
     */

    processMaterial(material) {
      const cache = this.cache
      const json = this.json
      if (cache.materials.has(material)) return cache.materials.get(material)

      if (material.isShaderMaterial) {
        console.warn(
          'GLTFExporter: threeToGlbGlobal.THREE.ShaderMaterial not supported.'
        )
        return null
      }

      if (!json.materials) json.materials = [] // @QUESTION Should we avoid including any attribute that has the default value?

      const materialDef = {
        pbrMetallicRoughness: {}
      }

      if (
        material.isMeshStandardMaterial !== true &&
        material.isMeshBasicMaterial !== true
      ) {
        console.warn(
          'GLTFExporter: Use MeshStandardMaterial or MeshBasicMaterial for best results.'
        )
      } // pbrMetallicRoughness.baseColorFactor

      const color = material.color.toArray().concat([material.opacity])

      if (!equalArray(color, [1, 1, 1, 1])) {
        materialDef.pbrMetallicRoughness.baseColorFactor = color
      }

      if (material.isMeshStandardMaterial) {
        materialDef.pbrMetallicRoughness.metallicFactor = material.metalness
        materialDef.pbrMetallicRoughness.roughnessFactor = material.roughness
      } else {
        materialDef.pbrMetallicRoughness.metallicFactor = 0.5
        materialDef.pbrMetallicRoughness.roughnessFactor = 0.5
      } // pbrMetallicRoughness.metallicRoughnessTexture

      if (material.metalnessMap || material.roughnessMap) {
        if (material.metalnessMap === material.roughnessMap) {
          const metalRoughMapDef = {
            index: this.processTexture(material.metalnessMap)
          }
          this.applyTextureTransform(metalRoughMapDef, material.metalnessMap)
          materialDef.pbrMetallicRoughness.metallicRoughnessTexture =
            metalRoughMapDef
        } else {
          console.warn(
            'threeToGlbGlobal.THREE.GLTFExporter: Ignoring metalnessMap and roughnessMap because they are not the same Texture.'
          )
        }
      } // pbrMetallicRoughness.baseColorTexture or pbrSpecularGlossiness diffuseTexture

      if (material.map) {
        const baseColorMapDef = {
          index: this.processTexture(material.map)
        }
        this.applyTextureTransform(baseColorMapDef, material.map)
        materialDef.pbrMetallicRoughness.baseColorTexture = baseColorMapDef
      }

      if (material.emissive) {
        // note: emissive components are limited to stay within the 0 - 1 range to accommodate glTF spec. see #21849 and #22000.
        const emissive = material.emissive
          .clone()
          .multiplyScalar(material.emissiveIntensity)
        const maxEmissiveComponent = Math.max(
          emissive.r,
          emissive.g,
          emissive.b
        )

        if (maxEmissiveComponent > 1) {
          emissive.multiplyScalar(1 / maxEmissiveComponent)
          console.warn(
            'threeToGlbGlobal.THREE.GLTFExporter: Some emissive components exceed 1; emissive has been limited'
          )
        }

        if (maxEmissiveComponent > 0) {
          materialDef.emissiveFactor = emissive.toArray()
        } // emissiveTexture

        if (material.emissiveMap) {
          const emissiveMapDef = {
            index: this.processTexture(material.emissiveMap)
          }
          this.applyTextureTransform(emissiveMapDef, material.emissiveMap)
          materialDef.emissiveTexture = emissiveMapDef
        }
      } // normalTexture

      if (material.normalMap) {
        const normalMapDef = {
          index: this.processTexture(material.normalMap)
        }

        if (material.normalScale && material.normalScale.x !== 1) {
          // glTF normal scale is univariate. Ignore `y`, which may be flipped.
          // Context: https://github.com/mrdoob/three.js/issues/11438#issuecomment-507003995
          normalMapDef.scale = material.normalScale.x
        }

        this.applyTextureTransform(normalMapDef, material.normalMap)
        materialDef.normalTexture = normalMapDef
      } // occlusionTexture

      if (material.aoMap) {
        const occlusionMapDef = {
          index: this.processTexture(material.aoMap),
          texCoord: 1
        }

        if (material.aoMapIntensity !== 1.0) {
          occlusionMapDef.strength = material.aoMapIntensity
        }

        this.applyTextureTransform(occlusionMapDef, material.aoMap)
        materialDef.occlusionTexture = occlusionMapDef
      } // alphaMode

      if (material.transparent) {
        materialDef.alphaMode = 'BLEND'
      } else {
        if (material.alphaTest > 0.0) {
          materialDef.alphaMode = 'MASK'
          materialDef.alphaCutoff = material.alphaTest
        }
      } // doubleSided

      if (material.side === threeToGlbGlobal.THREE.DoubleSide)
        materialDef.doubleSided = true
      if (material.name !== '') materialDef.name = material.name
      this.serializeUserData(material, materialDef)

      this._invokeAll(function (ext) {
        ext.writeMaterial && ext.writeMaterial(material, materialDef)
      })

      const index = json.materials.push(materialDef) - 1
      cache.materials.set(material, index)
      return index
    }
    /**
     * Process mesh
     * @param  {threeToGlbGlobal.THREE.Mesh} mesh Mesh to process
     * @return {Integer|null} Index of the processed mesh in the "meshes" array
     */

    processMesh(mesh) {
      const cache = this.cache
      const json = this.json
      const meshCacheKeyParts = [mesh.geometry.uuid]

      if (Array.isArray(mesh.material)) {
        for (let i = 0, l = mesh.material.length; i < l; i++) {
          meshCacheKeyParts.push(mesh.material[i].uuid)
        }
      } else {
        meshCacheKeyParts.push(mesh.material.uuid)
      }

      const meshCacheKey = meshCacheKeyParts.join(':')
      if (cache.meshes.has(meshCacheKey)) return cache.meshes.get(meshCacheKey)
      const geometry = mesh.geometry
      let mode // Use the correct mode

      if (mesh.isLineSegments) {
        mode = WEBGL_CONSTANTS.LINES
      } else if (mesh.isLineLoop) {
        mode = WEBGL_CONSTANTS.LINE_LOOP
      } else if (mesh.isLine) {
        mode = WEBGL_CONSTANTS.LINE_STRIP
      } else if (mesh.isPoints) {
        mode = WEBGL_CONSTANTS.POINTS
      } else {
        mode = mesh.material.wireframe
          ? WEBGL_CONSTANTS.LINES
          : WEBGL_CONSTANTS.TRIANGLES
      }

      if (geometry.isBufferGeometry !== true) {
        throw new Error(
          'threeToGlbGlobal.THREE.GLTFExporter: Geometry is not of type threeToGlbGlobal.THREE.BufferGeometry.'
        )
      }

      const meshDef = {}
      const attributes = {}
      const primitives = []
      const targets = [] // Conversion between attributes names in threejs and gltf spec

      const nameConversion = {
        uv: 'TEXCOORD_0',
        uv2: 'TEXCOORD_1',
        color: 'COLOR_0',
        skinWeight: 'WEIGHTS_0',
        skinIndex: 'JOINTS_0'
      }
      const originalNormal = geometry.getAttribute('normal')

      if (
        originalNormal !== undefined &&
        !this.isNormalizedNormalAttribute(originalNormal)
      ) {
        console.warn(
          'threeToGlbGlobal.THREE.GLTFExporter: Creating normalized normal attribute from the non-normalized one.'
        )
        geometry.setAttribute(
          'normal',
          this.createNormalizedNormalAttribute(originalNormal)
        )
      } // @QUESTION Detect if .vertexColors = true?
      // For every attribute create an accessor

      let modifiedAttribute = null

      for (let attributeName in geometry.attributes) {
        // Ignore morph target attributes, which are exported later.
        if (attributeName.substr(0, 5) === 'morph') continue
        const attribute = geometry.attributes[attributeName]
        attributeName =
          nameConversion[attributeName] || attributeName.toUpperCase() // Prefix all geometry attributes except the ones specifically
        // listed in the spec; non-spec attributes are considered custom.

        const validVertexAttributes =
          /^(POSITION|NORMAL|TANGENT|TEXCOORD_\d+|COLOR_\d+|JOINTS_\d+|WEIGHTS_\d+)$/
        if (!validVertexAttributes.test(attributeName))
          attributeName = '_' + attributeName

        if (cache.attributes.has(this.getUID(attribute))) {
          attributes[attributeName] = cache.attributes.get(
            this.getUID(attribute)
          )
          continue
        } // JOINTS_0 must be UNSIGNED_BYTE or UNSIGNED_SHORT.

        modifiedAttribute = null
        const array = attribute.array

        if (
          attributeName === 'JOINTS_0' &&
          !(array instanceof Uint16Array) &&
          !(array instanceof Uint8Array)
        ) {
          console.warn(
            'GLTFExporter: Attribute "skinIndex" converted to type UNSIGNED_SHORT.'
          )
          modifiedAttribute = new threeToGlbGlobal.THREE.BufferAttribute(
            new Uint16Array(array),
            attribute.itemSize,
            attribute.normalized
          )
        }

        const accessor = this.processAccessor(
          modifiedAttribute || attribute,
          geometry
        )

        if (accessor !== null) {
          attributes[attributeName] = accessor
          cache.attributes.set(this.getUID(attribute), accessor)
        }
      }

      if (originalNormal !== undefined)
        geometry.setAttribute('normal', originalNormal) // Skip if no exportable attributes found

      if (Object.keys(attributes).length === 0) return null // Morph targets

      if (
        mesh.morphTargetInfluences !== undefined &&
        mesh.morphTargetInfluences.length > 0
      ) {
        const weights = []
        const targetNames = []
        const reverseDictionary = {}

        if (mesh.morphTargetDictionary !== undefined) {
          for (const key in mesh.morphTargetDictionary) {
            reverseDictionary[mesh.morphTargetDictionary[key]] = key
          }
        }

        for (let i = 0; i < mesh.morphTargetInfluences.length; ++i) {
          const target = {}
          let warned = false

          for (const attributeName in geometry.morphAttributes) {
            // glTF 2.0 morph supports only POSITION/NORMAL/TANGENT.
            // Three.js doesn't support TANGENT yet.
            if (attributeName !== 'position' && attributeName !== 'normal') {
              if (!warned) {
                console.warn(
                  'GLTFExporter: Only POSITION and NORMAL morph are supported.'
                )
                warned = true
              }

              continue
            }

            const attribute = geometry.morphAttributes[attributeName][i]
            const gltfAttributeName = attributeName.toUpperCase() // Three.js morph attribute has absolute values while the one of glTF has relative values.
            //
            // glTF 2.0 Specification:
            // https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#morph-targets

            const baseAttribute = geometry.attributes[attributeName]

            if (cache.attributes.has(this.getUID(attribute))) {
              target[gltfAttributeName] = cache.attributes.get(
                this.getUID(attribute)
              )
              continue
            } // Clones attribute not to override

            const relativeAttribute = attribute.clone()

            if (!geometry.morphTargetsRelative) {
              for (let j = 0, jl = attribute.count; j < jl; j++) {
                relativeAttribute.setXYZ(
                  j,
                  attribute.getX(j) - baseAttribute.getX(j),
                  attribute.getY(j) - baseAttribute.getY(j),
                  attribute.getZ(j) - baseAttribute.getZ(j)
                )
              }
            }

            target[gltfAttributeName] = this.processAccessor(
              relativeAttribute,
              geometry
            )
            cache.attributes.set(
              this.getUID(baseAttribute),
              target[gltfAttributeName]
            )
          }

          targets.push(target)
          weights.push(mesh.morphTargetInfluences[i])
          if (mesh.morphTargetDictionary !== undefined)
            targetNames.push(reverseDictionary[i])
        }

        meshDef.weights = weights

        if (targetNames.length > 0) {
          meshDef.extras = {}
          meshDef.extras.targetNames = targetNames
        }
      }

      const isMultiMaterial = Array.isArray(mesh.material)
      if (isMultiMaterial && geometry.groups.length === 0) return null
      const materials = isMultiMaterial ? mesh.material : [mesh.material]
      const groups = isMultiMaterial
        ? geometry.groups
        : [
            {
              materialIndex: 0,
              start: undefined,
              count: undefined
            }
          ]

      for (let i = 0, il = groups.length; i < il; i++) {
        const primitive = {
          mode: mode,
          attributes: attributes
        }
        this.serializeUserData(geometry, primitive)
        if (targets.length > 0) primitive.targets = targets

        if (geometry.index !== null) {
          let cacheKey = this.getUID(geometry.index)

          if (groups[i].start !== undefined || groups[i].count !== undefined) {
            cacheKey += ':' + groups[i].start + ':' + groups[i].count
          }

          if (cache.attributes.has(cacheKey)) {
            primitive.indices = cache.attributes.get(cacheKey)
          } else {
            primitive.indices = this.processAccessor(
              geometry.index,
              geometry,
              groups[i].start,
              groups[i].count
            )
            cache.attributes.set(cacheKey, primitive.indices)
          }

          if (primitive.indices === null) delete primitive.indices
        }

        const material = this.processMaterial(
          materials[groups[i].materialIndex]
        )
        if (material !== null) primitive.material = material
        primitives.push(primitive)
      }

      meshDef.primitives = primitives
      if (!json.meshes) json.meshes = []

      this._invokeAll(function (ext) {
        ext.writeMesh && ext.writeMesh(mesh, meshDef)
      })

      const index = json.meshes.push(meshDef) - 1
      cache.meshes.set(meshCacheKey, index)
      return index
    }

    processNode(object) {
      const json = this.json
      const options = this.options
      const nodeMap = this.nodeMap
      if (!json.nodes) json.nodes = []
      const nodeDef = {}

      if (options.trs) {
        const rotation = object.quaternion.toArray()
        const position = object.position.toArray()
        const scale = object.scale.toArray()

        if (!equalArray(rotation, [0, 0, 0, 1])) {
          nodeDef.rotation = rotation
        }

        if (!equalArray(position, [0, 0, 0])) {
          nodeDef.translation = position
        }

        if (!equalArray(scale, [1, 1, 1])) {
          nodeDef.scale = scale
        }
      } else {
        if (object.matrixAutoUpdate) {
          object.updateMatrix()
        }

        if (isIdentityMatrix(object.matrix) === false) {
          nodeDef.matrix = object.matrix.elements
        }
      } // We don't export empty strings name because it represents no-name in Three.js.

      if (object.name !== '') nodeDef.name = String(object.name)
      this.serializeUserData(object, nodeDef)

      if (object.isMesh || object.isLine || object.isPoints) {
        const meshIndex = this.processMesh(object)
        if (meshIndex !== null) nodeDef.mesh = meshIndex
      } else if (object.isCamera) {
        nodeDef.camera = this.processCamera(object)
      }

      if (object.isSkinnedMesh) this.skins.push(object)

      if (object.children.length > 0) {
        const children = []

        for (let i = 0, l = object.children.length; i < l; i++) {
          const child = object.children[i]

          if (child.visible || options.onlyVisible === false) {
            const nodeIndex = this.processNode(child)
            if (nodeIndex !== null) children.push(nodeIndex)
          }
        }

        if (children.length > 0) nodeDef.children = children
      }

      this._invokeAll(function (ext) {
        ext.writeNode && ext.writeNode(object, nodeDef)
      })

      const nodeIndex = json.nodes.push(nodeDef) - 1
      nodeMap.set(object, nodeIndex)
      return nodeIndex
    }
    /**
     * Process threeToGlbGlobal.THREE.Scene
     * @param  {Scene} node threeToGlbGlobal.THREE.Scene to process
     */

    processScene(scene) {
      const json = this.json
      const options = this.options

      if (!json.scenes) {
        json.scenes = []
        json.scene = 0
      }

      const sceneDef = {}
      if (scene.name !== '') sceneDef.name = scene.name
      json.scenes.push(sceneDef)
      const nodes = []

      for (let i = 0, l = scene.children.length; i < l; i++) {
        const child = scene.children[i]

        if (child.visible || options.onlyVisible === false) {
          const nodeIndex = this.processNode(child)
          if (nodeIndex !== null) nodes.push(nodeIndex)
        }
      }

      if (nodes.length > 0) sceneDef.nodes = nodes
      this.serializeUserData(scene, sceneDef)
    }
    /**
     * Creates a threeToGlbGlobal.THREE.Scene to hold a list of objects and parse it
     * @param  {Array} objects List of objects to process
     */

    processObjects(objects) {
      const scene = new threeToGlbGlobal.THREE.Scene()
      scene.name = 'AuxScene'

      for (let i = 0; i < objects.length; i++) {
        // We push directly to children instead of calling `add` to prevent
        // modify the .parent and break its original scene and hierarchy
        scene.children.push(objects[i])
      }

      this.processScene(scene)
    }
    /**
     * @param {threeToGlbGlobal.THREE.Object3D|Array<threeToGlbGlobal.THREE.Object3D>} input
     */

    processInput(input) {
      const options = this.options
      input = input instanceof Array ? input : [input]

      this._invokeAll(function (ext) {
        ext.beforeParse && ext.beforeParse(input)
      })

      const objectsWithoutScene = []

      for (let i = 0; i < input.length; i++) {
        if (input[i] instanceof threeToGlbGlobal.THREE.Scene) {
          this.processScene(input[i])
        } else {
          objectsWithoutScene.push(input[i])
        }
      }

      if (objectsWithoutScene.length > 0)
        this.processObjects(objectsWithoutScene)

      for (let i = 0; i < this.skins.length; ++i) {
        this.processSkin(this.skins[i])
      }

      for (let i = 0; i < options.animations.length; ++i) {
        this.processAnimation(options.animations[i], input[0])
      }

      this._invokeAll(function (ext) {
        ext.afterParse && ext.afterParse(input)
      })
    }

    _invokeAll(func) {
      for (let i = 0, il = this.plugins.length; i < il; i++) {
        func(this.plugins[i])
      }
    }
  }

  threeToGlbGlobal.THREE.GLTFExporter = GLTFExporter
})()
