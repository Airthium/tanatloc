import { execSync, spawn } from 'child_process'
import isDocker from 'is-docker'

/**
 * toThree service
 * Convert mesh to threeJS
 * @memberof module:services
 * @param {string} path Path
 * @param {string} fileIn In file
 * @param {string} pathOut Out path
 */
const toThree = async (path, fileIn, pathOut) => {
  let conversionCode = ''

  // Check extension
  const extension = fileIn.split('.').pop()
  switch (extension.toLowerCase()) {
    case 'step':
      conversionCode = 'StepToThreeJS'
      break
    case 'stp':
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
  return new Promise((resolve, reject) => {
    let run
    let data = ''
    let error = ''

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

    run.on('error', (err) => {
      reject(err)
    })
  })
}

export default toThree
