/** @module Services.ToThree */

import { execSync, spawn } from 'child_process'
import path from 'path'
import isDocker from 'is-docker'

/**
 * toThree service
 * @description Convert step, dxf, mesh, vtu to threeJS
 * @memberof Services
 * @param bindPath Path
 * @param fileIn In file (POSIX path)
 * @param fileOut Out file (POSIX path)
 * @returns Code, data, error
 */
const toThree = async (
  bindPath: string,
  fileIn: string,
  fileOut: string
): Promise<{ code: number; data: string; error: string }> => {
  let command = ''

  // Enfore POSIX
  const fileInPOSIX = fileIn.split(path.sep).join(path.posix.sep)
  const fileOutPOSIX = fileOut.split(path.sep).join(path.posix.sep)

  // Extension
  const extension = fileInPOSIX.split('.').pop() as string

  // Check extension
  switch (extension.toLowerCase()) {
    case 'step':
      command = 'StepToGLTF ' + fileInPOSIX + ' ' + fileOutPOSIX
      break
    case 'stp':
      command = 'StepToGLTF ' + fileInPOSIX + ' ' + fileOutPOSIX
      break
    case 'dxf':
      command = 'DXFToGLTF ' + fileInPOSIX + ' ' + fileOutPOSIX
      break
    case 'msh':
      command = 'GmshToGLTF ' + fileInPOSIX + ' ' + fileOutPOSIX
      break
    case 'vtu':
      command = 'VTUToGLTF ' + fileInPOSIX + ' ' + fileOutPOSIX
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

      const user =
        process.platform === 'win32'
          ? 1000
          : execSync('id -u').toString().trim()
      const group =
        process.platform === 'win32'
          ? 1000
          : execSync('id -g').toString().trim()
      const run = spawn('docker', [
        'run',
        '--volume=' + bindPath + ':/three',
        '--user=' + user + ':' + group,
        '-w=/three',
        'tanatloc/worker:latest',
        '/bin/bash',
        '-c',
        command
      ])

      run.stdout.on('data', (stdout: Buffer) => {
        console.log(stdout.toString())
        stdout && (data += stdout.toString())
      })

      run.stderr.on('data', (stderr: Buffer) => {
        console.log(stderr.toString())
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
