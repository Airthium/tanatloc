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
 * @returns Code
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
      run = spawn('ff-mpirun', [' -np', '1', scriptPOSIX, '-ns', ' > log'], {
        cwd: bindPath
      })
    } else if (customExecutable) {
      run = spawn(
        customExecutable,
        [' -np', '1', scriptPOSIX, '-ns', ' > log'],
        {
          cwd: bindPath
        }
      )
    } else {
      // Check docker version
      let dockerVersion = 'engine'
      const docker = execSync('docker version')
      if (docker.includes('Docker Desktop')) dockerVersion = 'desktop'

      // User
      const user =
        process.platform === 'win32'
          ? 1000
          : execSync('id -u').toString().trim()
      const group =
        process.platform === 'win32'
          ? 1000
          : execSync('id -g').toString().trim()

      // Command
      run = spawn(
        'docker',
        [
          'run',
          '--rm',
          '--volume=' + bindPath + ':/run',
          dockerVersion === 'engine' ? '--user=' + user + ':' + group : '',
          '-w=/run',
          'tanatloc/worker:latest',
          'ff-mpirun',
          dockerVersion === 'desktop' ? '--allow-run-as-root' : '',
          '-np',
          '1',
          scriptPOSIX,
          '-ns',
          '> log'
        ].filter((a) => a)
      )
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
