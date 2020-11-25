import { spawn } from 'child_process'

/**
 * FreeFEM service
 * @param {string} path Path
 * @param {string} script Script
 * @param {Function} callback Callback
 */
const freefem = async (path, script, callback) => {
  const returnCode = await new Promise((resolve, reject) => {
    const process = spawn('docker', [
      'run',
      '--rm',
      '-v=' + path + ':/run',
      '-w=/run',
      'freefem/freefem:latest',
      'FreeFem++',
      script
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

export default freefem
