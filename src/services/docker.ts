import { ChildProcessWithoutNullStreams, execSync, spawn } from 'child_process'
import fs from 'fs'
import { v4 as uuid } from 'uuid'

/**
 * Docker
 * @param bindPath Bind path
 * @param command Command
 * @returns Result
 */
const docker = (
  bindPath: string,
  command: string
): ChildProcessWithoutNullStreams => {
  // UUID
  const id = uuid()

  // Check docker version
  let dockerVersion = 'engine'
  const docker = execSync('docker version')
  if (docker.includes('Docker Desktop')) dockerVersion = 'desktop'

  // User
  const user =
    process.platform === 'win32' ? 1000 : execSync('id -u').toString().trim()
  const group =
    process.platform === 'win32' ? 1000 : execSync('id -g').toString().trim()

  // Command
  const run = spawn(
    'docker',
    [
      'run',
      '--cidfile=' + id,
      '--volume=' + bindPath + ':/workingPath',
      dockerVersion === 'engine' ? '--user=' + user + ':' + group : '',
      '-w=/workingPath',
      'tanatloc/worker:latest',
      '/bin/bash',
      '-c',
      command
    ].filter((a) => a)
  )

  run.on('close', () => {
    try {
      const containerId = fs.readFileSync(id)
      fs.unlinkSync(id)
      execSync('docker rm ' + containerId.toString())
    } catch (err) {
      console.error(err)
    }
  })

  return run
}

export default docker
