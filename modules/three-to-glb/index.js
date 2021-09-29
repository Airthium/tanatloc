/** @namespace Modules.ThreeToGLB */

const { convert } = require('./src')

/**
 * Convert legacy ThreeJS json format to glb
 * @memberof Modules.ThreeToGLB
 * @param {string} location Legacy ThreeJS JSON folder location
 * @param {string} name Name of the main json
 * @return {string} GLB file
 */
const threeToGlb = async (location, name) => {
  return convert(location, name)
}

module.exports = { convert: threeToGlb }
