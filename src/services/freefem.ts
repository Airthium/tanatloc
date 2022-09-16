/** @module Services.Freefem */

import { execSync, spawn } from 'child_process'
import path from 'path'
import isDocker from 'is-docker'

import docker from './docker'

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
      {
        const dockerFullVersion = execSync('docker version')
        if (dockerFullVersion.includes('Docker Desktop'))
          dockerVersion = 'desktop'
      }

      const command = [
        'ff-mpirun',
        dockerVersion === 'desktop' ? '--allow-run-as-root' : '',
        '-np',
        '1',
        scriptPOSIX,
        '-ns',
        '> log'
      ]
        .filter((c) => c)
        .join(' ')
      run = docker(bindPath, command)
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
