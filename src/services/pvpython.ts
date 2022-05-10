/** @module Services.Pvpython */

import { execSync, spawn } from 'child_process'
import path from 'path'
import isDocker from 'is-docker'

/**
 * pvpython service
 * @param bindPath Path
 * @param script Script (POSIX path)
 * @param fileIn File in (POSIX path)
 * @param fileOut File out (POSIX path)
 * @param parameters Parameters
 * @returns Code, data, error
 */
const pvpython = async (
  bindPath: string,
  script: string,
  fileIn: string,
  fileOut: string,
  parameters: string[]
): Promise<{ code: number; data: string; error: string }> => {
  // Enfore POSIX
  const scriptPOSIX = script.split(path.sep).join(path.posix.sep)
  const fileInPOSIX = fileIn.split(path.sep).join(path.posix.sep)
  const fileOutPOSIX = fileOut.split(path.sep).join(path.posix.sep)

  return new Promise((resolve, reject) => {
    let run: any
    let data: string
    let error: string

    if (isDocker()) {
      run = spawn(
        'pvpython',
        [scriptPOSIX, fileInPOSIX, fileOutPOSIX, ...parameters],
        { cwd: bindPath }
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
        '--volume=' + bindPath + ':/pvpython',
        '--user=' + user + ':' + group,
        '-w=/pvpython',
        'tanatloc/worker:latest',
        'pvpython',
        scriptPOSIX,
        fileInPOSIX,
        fileOutPOSIX,
        ...parameters
      ])
    }

    run.stdout.on('data', (stdout: Buffer) => {
      stdout && (data += stdout.toString())
    })

    run.stderr.on('data', (stderr: Buffer) => {
      stderr && (error += stderr.toString())
    })

    run.on('close', (code: any) => {
      resolve({
        code,
        data,
        error
      })
    })

    run.on('error', (err: Error) => {
      reject(err)
    })
  })
}

export default pvpython
