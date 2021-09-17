/** @module three-to-glb */

const { spawn } = require('child_process')
const runner = require('./src/run')

/**
 * Convert legacy ThreeJS json format to glb
 * Use of exec required to isolate global scope modifications
 * @param {string} location Legacy ThreeJS JSON folder location
 * @param {string} name Name of the main json
 * @return GLB file
 */
const convert = async (location, name) => {
  // const script = './run.js'

  return new Promise((resolve, reject) => {
    let data = ''
    let error = ''
    // const run = spawn('node', [script, location, name])
    const run = spawn(runner(location, name))

    run.stdout.on('data', (stdout) => {
      console.log(stdout.toString())
      stdout && (data += stdout.toString())
    })

    run.stderr.on('data', (stderr) => {
      console.log(stderr.toString())
      stderr && (error += stderr.toString())
    })

    run.on('close', (code) => {
      resolve({
        code,
        data,
        error
      })
    })

    run.on('error', (err) => reject({ error: err }))
  })
}

module.exports = { convert }
