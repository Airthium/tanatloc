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

// Geometry
threeToGlb(
  '/home/simon/tanatloc/geometry/rc-upload-1627976306928-4',
  'part.json'
)
  .then(() => console.log('geometry'))
  .catch(console.log)

// Mesh
threeToGlb(
  '/home/simon/tanatloc/simulation/1ad4b16b-92b0-41f8-9277-54246118af7f/rc-upload-1630655266535-2_mesh/rc-upload-1630655266535-2',
  'part.json'
)
  .then(() => console.log('mesh'))
  .catch(console.log)

// Result
threeToGlb(
  '/home/simon/tanatloc/simulation/1ad4b16b-92b0-41f8-9277-54246118af7f/run/result/Result_Presure',
  'part.json'
)
  .then(() => console.log('mesh'))
  .catch(console.log)

module.exports = { convert: threeToGlb }
