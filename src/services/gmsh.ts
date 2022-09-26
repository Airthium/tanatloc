/** @module Services.Gmsh */

import { spawn } from 'child_process'
import path from 'path'
import isDocker from 'is-docker'

import docker from './docker'

/**
 * Gmsh service
 * @param bindPath Path
 * @param fileIn In file (POSIX path)
 * @param fileOut Out file (POSIX path)
 * @param callback Callback
 * @param customExecutable Custom executable
 * @returns Code
 */
const gmsh = async (
  bindPath: string,
  fileIn: string,
  fileOut: string,
  callback: (data: { pid?: number; data?: string; error?: string }) => void,
  customExecutable?: string
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
    } else if (customExecutable) {
      run = spawn(
        customExecutable,
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
      const command = [
        'gmsh',
        '-3',
        fileInPOSIX,
        '-o',
        fileOutPOSIX,
        '-format',
        'msh2',
        '-clcurv',
        '10'
      ].join(' ')
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

export default gmsh
