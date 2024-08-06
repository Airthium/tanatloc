/** @module Services.Custom */

import { execSync } from 'child_process'
import path from 'path'
import isDocker from 'is-docker'

import docker from './docker'

/**
 * Custom service
 *
 * Use tanatloc/worker docker custom command
 * @param bindPath Path
 * @param executable Executable
 * @param args Arguments
 * @returns Code, data, error
 */
const Custom = async (
  bindPath: string,
  executable: string,
  args: string[]
): Promise<{ code: number; data: string; error: string }> => {
  // Enfore POSIX
  const argsPOSIX = args.map((arg) => arg.split(path.sep).join(path.posix.sep))

  // Command
  const command = executable + ' ' + argsPOSIX.join(' ')

  // Run
  if (isDocker()) {
    const data = execSync(command, { cwd: bindPath })
    return { code: 0, data: data.toString(), error: '' }
  } else {
    return new Promise((resolve, reject) => {
      let data = ''
      let error = ''
      const run = docker(bindPath, command)
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
}

export default Custom
