const path = require('path')
const { execSync } = require('child_process')

/**
 * Convert legacy ThreeJS json format to glb
 * Use of exec required to isolate global modifications
 * @param {*} location
 * @param {*} name
 * @returns
 */
const convert = (location, name) => {
  const script = path.join(__dirname, 'run.js')
  const res = execSync('node ' + script + ' ' + location + ' ' + name)
  return res
}

module.exports = { convert }
