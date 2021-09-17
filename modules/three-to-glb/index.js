/** @module three-to-glb */

const vm = require('vm')
const { runner } = require('./src/run')

/**
 * Convert legacy ThreeJS json format to glb
 * Use of exec required to isolate global scope modifications
 * @param {string} location Legacy ThreeJS JSON folder location
 * @param {string} name Name of the main json
 * @return GLB file
 */
const convert = async (location, name) => {
  try {
    // Code
    const code = await runner(location, name)

    // TODO no enought to protect window

    // Run in context
    const data = vm.runInNewContext(`${code}`, {
      runner,
      location,
      name
    })
    console.log(data)

    return data
  } catch (err) {
    console.log(err)
  }
}

module.exports = { convert }
