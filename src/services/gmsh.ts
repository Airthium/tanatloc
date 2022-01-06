import { execSync, spawn } from 'child_process'
import path from 'path'
import isDocker from 'is-docker'

/**
 * Gmsh service
 * @memberof Services
 * @param path Path
 * @param fileIn In file (POSIX path)
 * @param fileOut Out file (POSIX path)
 * @param callback Callback
 */
const gmsh = async (
  bindPath: string,
  fileIn: string,
  fileOut: string,
  callback: Function
): Promise<number> => {
  // Enfore POSIX
  const fileInPOSIX = fileIn.split(path.sep).join(path.posix.sep)
  const fileOutPOSIX = fileOut.split(path.sep).join(path.posix.sep)

  return new Promise((resolve, reject) => {
    let run: any

    if (isDocker()) {
      run = spawn(
        'gmsh',
        [
          '-3',
          fileInPOSIX,
          '-o',
          fileOutPOSIX,
          '-format',
          'msh2',
          '-clcurv',
          '10'
        ],
        {
          cwd: bindPath
        }
      )
    } else {
      const user =
        process.platform === 'win32'
          ? 1000
          : execSync('id -u').toString().trim()
      const group =
        process.platform === 'win32'
          ? 1000
          : execSync('id -g').toString().trim()
      run = spawn('docker', [
        'run',
        '--volume=' + bindPath + ':/mesh',
        '--user=' + user + ':' + group,
        '-w=/mesh',
        'tanatloc/worker:latest',
        'gmsh',
        '-3',
        fileInPOSIX,
        '-o',
        fileOutPOSIX,
        '-format',
        'msh2',
        '-clcurv',
        '10'
      ])
    }

    callback({ pid: run.pid })

    run.stdout.on('data', (data: Buffer) => {
      callback({ data: data.toString() })
    })

    run.stderr.on('data', (data: Buffer) => {
      callback({ error: data.toString() })
    })

    run.on('close', (code: number) => {
      resolve(code)
    })

    run.on('error', (err: Error) => {
      reject(err)
    })
  })
}

export default gmsh
