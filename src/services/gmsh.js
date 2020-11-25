import { spawn } from 'child_process'

/**
 * Gmsh service
 * @param {string} path Path
 * @param {string} fileIn In file
 * @param {string} fileOut Out file
 * @param {Function} callback Callback
 */
const gmsh = async (path, fileIn, fileOut, callback) => {
  const returnCode = await new Promise((resolve, reject) => {
    const process = spawn('docker', [
      'run',
      '-v=' + path + ':/mesh',
      '-w=/mesh',
      'tanatloc/converters:latest',
      'gmsh',
      '-3',
      fileIn,
      '-o',
      fileOut,
      '-format',
      'msh2'
    ])

    process.stdout.on('data', (data) => {
      callback({ data })
    })

    process.stderr.on('data', (data) => {
      callback({ error: data })
    })

    process.on('close', (code) => {
      resolve(code)
    })

    process.on('error', (err) => {
      reject(err)
    })
  })

  return returnCode
}

export default gmsh
