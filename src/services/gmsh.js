import { execSync, spawn } from 'child_process'
import isDocker from 'is-docker'

/**
 * Gmsh service
 * @memberof module:src/services
 * @param {string} path Path
 * @param {string} fileIn In file
 * @param {string} fileOut Out file
 * @param {Function} callback Callback
 */
const gmsh = async (path, fileIn, fileOut, callback) => {
  const returnCode = await new Promise((resolve, reject) => {
    let run

    if (isDocker()) {
      run = spawn(
        'gmsh',
        ['-3', fileIn, '-o', fileOut, '-format', 'msh2', '-clcurv', '10'],
        {
          cwd: path
        }
      )
    } else {
      const user = execSync('id -u').toString().trim()
      const group = execSync('id -g').toString().trim()
      run = spawn('docker', [
        'run',
        '--volume=' + path + ':/mesh',
        '--user=' + user + ':' + group,
        '-w=/mesh',
        'tanatloc/worker:latest',
        'gmsh',
        '-3',
        fileIn,
        '-o',
        fileOut,
        '-format',
        'msh2',
        '-clcurv',
        '10'
      ])
    }

    callback({ pid: run.pid })

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

export default gmsh
