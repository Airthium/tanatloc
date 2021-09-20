/** @module three-to-glb */

const { convert } = require('./src')

/**
 * Convert legacy ThreeJS json format to glb
 * @param {string} location Legacy ThreeJS JSON folder location
 * @param {string} name Name of the main json
 * @return GLB file
 */
const threeToGlb = async (location, name) => {
  return convert(location, name)
}

module.exports = { convert: threeToGlb }
