/**
 * Custom re-implementation of https://github.com/mrdoob/three.js/blob/dev/examples/js/utils/BufferGeometryUtils.js
 */

/**
 * @param {BufferGeometry} geometry
 * @param {number} tolerance
 * @return {BufferGeometry}
 */
function mergeVertices(geometry, tolerance = 1e-4) {
  tolerance = Math.max(tolerance, Number.EPSILON) // Generate an index buffer if the geometry doesn't have one, or optimize it
  // if it's already available.

  const hashToIndex = {}
  const indices = geometry.getIndex()
  const positions = geometry.getAttribute('position')
  const vertexCount = indices ? indices.count : positions.count // next value for triangle indices

  let nextIndex = 0 // attributes and new attribute arrays

  const attributeNames = Object.keys(geometry.attributes)
  const attrArrays = {}
  const morphAttrsArrays = {}
  const newIndices = []
  const getters = ['getX', 'getY', 'getZ', 'getW'] // initialize the arrays

  for (let i = 0, l = attributeNames.length; i < l; i++) {
    const name = attributeNames[i]
    attrArrays[name] = []
    const morphAttr = geometry.morphAttributes[name]

    if (morphAttr) {
      morphAttrsArrays[name] = new Array(morphAttr.length).fill().map(() => [])
    }
  } // convert the error tolerance to an amount of decimal places to truncate to

  const decimalShift = Math.log10(1 / tolerance)
  const shiftMultiplier = Math.pow(10, decimalShift)

  for (let i = 0; i < vertexCount; i++) {
    const index = indices ? indices.getX(i) : i // Generate a hash for the vertex attributes at the current index 'i'

    let hash = ''

    for (let j = 0, l = attributeNames.length; j < l; j++) {
      const name = attributeNames[j]
      const attribute = geometry.getAttribute(name)
      const itemSize = attribute.itemSize

      for (let k = 0; k < itemSize; k++) {
        // double tilde truncates the decimal value
        hash += `${~~(attribute[getters[k]](index) * shiftMultiplier)},`
      }
    } // Add another reference to the vertex if it's already
    // used by another index

    if (hash in hashToIndex) {
      newIndices.push(hashToIndex[hash])
    } else {
      // copy data to the new index in the attribute arrays
      for (let j = 0, l = attributeNames.length; j < l; j++) {
        const name = attributeNames[j]
        const attribute = geometry.getAttribute(name)
        const morphAttr = geometry.morphAttributes[name]
        const itemSize = attribute.itemSize
        const newarray = attrArrays[name]
        const newMorphArrays = morphAttrsArrays[name]

        for (let k = 0; k < itemSize; k++) {
          const getterFunc = getters[k]
          newarray.push(attribute[getterFunc](index))

          if (morphAttr) {
            for (let m = 0, ml = morphAttr.length; m < ml; m++) {
              newMorphArrays[m].push(morphAttr[m][getterFunc](index))
            }
          }
        }
      }

      hashToIndex[hash] = nextIndex
      newIndices.push(nextIndex)
      nextIndex++
    }
  } // Generate typed arrays from new attribute arrays and update
  // the attributeBuffers

  const result = geometry.clone()

  for (let i = 0, l = attributeNames.length; i < l; i++) {
    const name = attributeNames[i]
    const oldAttribute = geometry.getAttribute(name)
    const buffer = new oldAttribute.array.constructor(attrArrays[name])
    const attribute = new threeToGlbGlobal.THREE.BufferAttribute(
      buffer,
      oldAttribute.itemSize,
      oldAttribute.normalized
    )
    result.setAttribute(name, attribute) // Update the attribute arrays

    if (name in morphAttrsArrays) {
      for (let j = 0; j < morphAttrsArrays[name].length; j++) {
        const oldMorphAttribute = geometry.morphAttributes[name][j]
        const buffer = new oldMorphAttribute.array.constructor(
          morphAttrsArrays[name][j]
        )
        const morphAttribute = new threeToGlbGlobal.THREE.BufferAttribute(
          buffer,
          oldMorphAttribute.itemSize,
          oldMorphAttribute.normalized
        )
        result.morphAttributes[name][j] = morphAttribute
      }
    }
  } // indices

  result.setIndex(newIndices)
  return result
}

threeToGlbGlobal.THREE.BufferGeometryUtils = {}
threeToGlbGlobal.THREE.BufferGeometryUtils.mergeVertices = mergeVertices
