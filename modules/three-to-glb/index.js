/** @module three-to-glb */

const vm = require('vm')

/**
 * Convert legacy ThreeJS json format to glb
 * Use of exec required to isolate global scope modifications
 * @param {string} location Legacy ThreeJS JSON folder location
 * @param {string} name Name of the main json
 * @return GLB file
 */
const convert = async (location, name) => {
  // Code
  const code = async (require, _location, _name) => {
    const { runner } = require('./src/run')
    return runner(_location, _name)
  }

  // Run in context
  const data = await vm.runInThisContext(`${code}`)(require, location, name)
  console.log(data)

  return data
}

module.exports = { convert }
