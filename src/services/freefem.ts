/** @module Services.Freefem */

import { execSync, spawn } from 'child_process'
import path from 'path'
import isDocker from 'is-docker'

/**
 * FreeFEM service
 * @param  bindPath Path
 * @param script Script (POSIX path)
 * @param callback Callback
 * @param customExecutable Custom executable
 */
const freefem = async (
  bindPath: string,
  script: string,
  callback: (data: { pid?: number; data?: string; error?: string }) => void,
  customExecutable?: string
): Promise<number> => {
  // Enfore POSIX
  const scriptPOSIX = script.split(path.sep).join(path.posix.sep)

  return new Promise((resolve, reject) => {
    let run: any

    if (isDocker()) {
      run = spawn('ff-mpirun', [' -np', '1', scriptPOSIX, '-ns'], {
        cwd: bindPath
      })
    } else if (customExecutable) {
      run = spawn(customExecutable, [' -np', '1', scriptPOSIX, '-ns'], {
        cwd: bindPath
      })
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
        '--rm',
        '--volume=' + bindPath + ':/run',
        '--user=' + user + ':' + group,
        '-w=/run',
        'tanatloc/worker:latest',
        'ff-mpirun',
        '-np',
        '1',
        scriptPOSIX,
        '-ns',
        '> log'
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

export default freefem
