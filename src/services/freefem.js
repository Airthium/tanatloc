import { execSync, spawn } from 'child_process'
import isDocker from 'is-docker'

/**
 * FreeFEM service
 * @memberof Services
 * @param {string} path Path
 * @param {string} script Script
 * @param {Function} callback Callback
 */
const freefem = async (path, script, callback) => {
  return new Promise((resolve, reject) => {
    let run

    if (isDocker()) {
      run = spawn('ff-mpirun', [' -np', '1', script, '-ns'], {
        cwd: path
      })
    } else {
      const user = execSync('id -u').toString().trim()
      const group = execSync('id -g').toString().trim()
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

    run.stdout.on('data', (data) => {
      callback({ data: data.toString() })
    })

    run.stderr.on('data', (data) => {
      callback({ error: data.toString() })
    })

    run.on('close', (code) => {
      resolve(code)
    })

    run.on('error', (err) => {
      reject(err)
    })
  })
}

export default freefem
