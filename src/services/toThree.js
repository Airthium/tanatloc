import { execSync, spawn } from 'child_process'
import isDocker from 'is-docker'

/**
 * toThree service
 * Convert mesh to threeJS
 * @memberof module:src/services
 * @param {string} path Path
 * @param {string} fileIn In file
 * @param {string} pathOut Out path
 * @param {Function} callback Callback
 */
const toThree = async (path, fileIn, pathOut, callback) => {
  let conversionCode = ''

  // Check extension
  const extension = fileIn.split('.').pop()
  switch (extension.toLowerCase()) {
    case 'step':
      conversionCode = 'StepToThreeJS'
      break
    case 'dxf':
      conversionCode = 'DXFToThreeJS'
      break
    case 'msh':
      conversionCode = 'GmshToThreeJS'
      break
    case 'vtu':
      conversionCode = 'VTUToThreeJS'
      break
    default:
      throw new Error('Unknown conversion code')
  }

  // Convert
  const returnCode = await new Promise((resolve, reject) => {
    let run

    if (isDocker()) {
      run = spawn(conversionCode, [fileIn, pathOut], {
        cwd: path
      })
    } else {
      const user = execSync('id -u').toString().trim()
      const group = execSync('id -g').toString().trim()
      run = spawn('docker', [
        'run',
        '--volume=' + path + ':/three',
        '--user=' + user + ':' + group,
        '-w=/three',
        'tanatloc/worker:latest',
        conversionCode,
        fileIn,
        pathOut
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

export default toThree
