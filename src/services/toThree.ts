/** @module Services.ToThree */

import { execSync, spawn } from 'child_process'
import path from 'path'
import isDocker from 'is-docker'

/**
 * toThree service
 * @description Convert step, dxf, mesh, vtu to threeJS
 * @memberof Services
 * @param path Path
 * @param fileIn In file (POSIX path)
 * @param pathOut Out path (POSIX path)
 */
const toThree = async (
  bindPath: string,
  fileIn: string,
  pathOut: string
): Promise<{ code: number; data: string; error: string }> => {
  let conversionCode = ''

  // Enfore POSIX
  const fileInPOSIX = fileIn.split(path.sep).join(path.posix.sep)
  const pathOutPOSIX = pathOut.split(path.sep).join(path.posix.sep)

  // Extension
  const extension = fileInPOSIX.split('.').pop()

  // DXF specific
  if (extension.toLocaleLowerCase() === 'dxf') {
    return new Promise((resolve, reject) => {
      let run: any
      let data = ''
      let error = ''

      if (isDocker()) {
        throw new Error('not implemented')
        run = spawn(conversionCode, [fileInPOSIX, pathOutPOSIX], {
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
          '--volume=' + bindPath + ':/three',
          '--user=' + user + ':' + group,
          '-w=/three',
          'tanatloc/worker:latest',
          '/bin/bash',
          '-c',
          'DXFToBRep ' +
            fileInPOSIX +
            ' temp.brep && BRepToThreeJS temp.brep ' +
            pathOutPOSIX
        ])
      }

      run.stdout.on('data', (stdout: Buffer) => {
        stdout && (data += stdout.toString())
      })

      run.stderr.on('data', (stderr: Buffer) => {
        stderr && (error += stderr.toString())

        console.log(stderr.toString())
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
  } else {
    // Check extension
    switch (extension.toLowerCase()) {
      case 'step':
        conversionCode = 'StepToThreeJS'
        break
      case 'stp':
        conversionCode = 'StepToThreeJS'
        break
      case 'msh':
        conversionCode = 'GmshToThreeJS'
        break
      case 'vtu':
        conversionCode = 'VTUToThreeJS'
        break
      default:
        throw new Error('Unknown conversion code')
    }

    // Convert
    return new Promise((resolve, reject) => {
      let run: any
      let data = ''
      let error = ''

      if (isDocker()) {
        run = spawn(conversionCode, [fileInPOSIX, pathOutPOSIX], {
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
          '--volume=' + bindPath + ':/three',
          '--user=' + user + ':' + group,
          '-w=/three',
          'tanatloc/worker:latest',
          conversionCode,
          fileInPOSIX,
          pathOutPOSIX
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
}

export default toThree
