/** @namespace Modules.ThreeToGLB */

const { convert } = require('./src')

/**
 * Convert legacy ThreeJS json format to glb
 * @memberof Modules.ThreeToGLB
 * @param location Legacy ThreeJS JSON folder location
 * @param name Name of the main json
 * @return GLB file
 */
const threeToGlb = async (location, name) => {
  return convert(location, name)
}

module.exports = { convert: threeToGlb }
