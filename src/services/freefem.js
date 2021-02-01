import { execSync, spawn } from 'child_process'
import isDocker from 'is-docker'

/**
 * FreeFEM service
 * @memberof module:src/services
 * @param {string} path Path
 * @param {string} script Script
 * @param {Function} callback Callback
 */
const freefem = async (path, script, callback) => {
  const returnCode = await new Promise((resolve, reject) => {
    let run

    if (isDocker()) {
      run = spawn('FreeFem++', ['-nw', '-ns', script], {
        cwd: path
      })
    } else {
      const user = execSync('id -u').toString().trim()
      const group = execSync('id -g').toString().trim()
      run = spawn('docker', [
        'run',
        '--rm',
        '--volume=' + path + ':/run',
        '--user=' + user + ':' + group,
        '-w=/run',
        'freefem/freefem:latest',
        'FreeFem++',
        '-nw',
        '-ns',
        script
      ])
    }

    run.stdout.on('data', (data) => {
      callback({ data: data.toString() })
    })

    run.stderr.on('data', (data) => {
      callback({ error: data.toString() })
    })

    run.on('close', (code) => {
      resolve(code)
    })

    run.on('error', (err) => {
      reject(err)
    })
  })

  return returnCode
}

export default freefem
