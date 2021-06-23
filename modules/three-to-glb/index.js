/** @module three-to-glb */

const path = require('path')
const { spawn } = require('child_process')

/**
 * Convert legacy ThreeJS json format to glb
 * Use of exec required to isolate global scope modifications
 * @param {string} location Legacy ThreeJS JSON folder location
 * @param {string} name Name of the main json
 * @return GLB file
 */
const convert = async (location, name) => {
  const script = path.join(__dirname, 'run.js')

  return new Promise((resolve, reject) => {
    let data = ''
    let error = ''
    const run = spawn('node', [script, location, name])

    run.stdout.on('data', (stdout) => {
      stdout && (data += stdout.toString())
    })

    run.stderr.on('data', (stderr) => {
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
