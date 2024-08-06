/** @module Services.ToThree */

import { execSync } from 'child_process'
import path from 'path'
import isDocker from 'is-docker'

import docker from './docker'

/**
 * toThree service
 *
 * Convert step, dxf, mesh, vtu to threeJS
 * @param bindPath Path
 * @param fileIn In file (POSIX path)
 * @param glbOut Out file (POSIX path)
 * @returns Code, data, error
 */
const toThree = async (
  bindPath: string,
  fileIn: string,
  glbOut: string,
  brepOut?: string
): Promise<{ code: number; data: string; error: string }> => {
  let command = ''

  // Enfore POSIX
  const fileInPOSIX = fileIn.split(path.sep).join(path.posix.sep)
  const glbOutPOSIX = glbOut.split(path.sep).join(path.posix.sep)
  const brepOutPOSIX = brepOut?.split(path.sep).join(path.posix.sep)

  // Extension
  const extension = fileInPOSIX.split('.').pop() as string

  // Check extension
  switch (extension.toLowerCase()) {
    case 'step':
    case 'stp':
      command =
        'StepToGLTF ' + fileInPOSIX + ' ' + glbOutPOSIX + ' ' + brepOutPOSIX
      break
    case 'dxf':
      command =
        'DXFToGLTF ' + fileInPOSIX + ' ' + glbOutPOSIX + ' ' + brepOutPOSIX
      break
    case 'msh':
      command = 'GmshToGLTF ' + fileInPOSIX + ' ' + glbOutPOSIX
      break
    case 'vtu':
      command = 'VTUToGLTF ' + fileInPOSIX + ' ' + glbOutPOSIX
      break
    default:
      throw new Error('Unknown conversion code')
  }

  // Convert
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

export default toThree
