/** @module three-to-glb */

const { convert } = require('./src')

/**
 * Convert legacy ThreeJS json format to glb
 * @param {string} location Legacy ThreeJS JSON folder location
 * @param {string} name Name of the main json
 * @return GLB file
 */
const threeToGlb = async (location, name) => {
  try {
    const run = await convert(location, name)
    console.log(run)
    return run
  } catch (err) {
    console.log(err)
  }
}

threeToGlb(
  '/home/simon/tanatloc/geometry/rc-upload-1627976306928-4',
  'part.json'
).catch(console.log)

module.exports = { convert: threeToGlb }
