import { execSync, spawn } from 'child_process'
import isDocker from 'is-docker'

/**
 * FreeFEM service
 * @memberof Services
 * @param  path Path
 * @param script Script
 * @param callback Callback
 */
const freefem = async (
  path: string,
  script: string,
  callback: Function
): Promise<number> => {
  return new Promise((resolve, reject) => {
    let run: any

    if (isDocker()) {
      run = spawn('ff-mpirun', [' -np', '1', script, '-ns'], {
        cwd: path
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
        '--volume=' + path + ':/run',
        '--user=' + user + ':' + group,
        '-w=/run',
        'tanatloc/worker:latest',
        'ff-mpirun',
        '-np',
        '1',
        script,
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
