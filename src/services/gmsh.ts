import { execSync, spawn } from 'child_process'
import isDocker from 'is-docker'

/**
 * Gmsh service
 * @memberof Services
 * @param path Path
 * @param fileIn In file
 * @param fileOut Out file
 * @param callback Callback
 */
const gmsh = async (
  path: string,
  fileIn: string,
  fileOut: string,
  callback: Function
): Promise<number> => {
  return new Promise((resolve, reject) => {
    let run: any

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
