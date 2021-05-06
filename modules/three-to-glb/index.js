/** @module three-to-glb */

const path = require('path')
const { execSync } = require('child_process')

/**
 * Convert legacy ThreeJS json format to glb
 * Use of exec required to isolate global scope modifications
 * @param {string} location Legacy ThreeJS JSON folder location
 * @param {string} name Name of the main json
 * @return GLB file
 */
const convert = (location, name) => {
  const script = path.join(__dirname, 'run.js')
  const glb = execSync('node ' + script + ' ' + location + ' ' + name)
  return glb
}

module.exports = { convert }
