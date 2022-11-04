/** @module Services.Docker */

import { ChildProcessWithoutNullStreams, execSync, spawn } from 'child_process'
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
  // Container name
  const id = uuid()
  const containerName = 'tanatloc_' + id

  // Check docker version
  let dockerVersion = 'engine'
  const docker = execSync('docker version')
  if (docker.includes('Docker Desktop')) dockerVersion = 'desktop'

  // User
  const user =
    process.platform === 'win32'
      ? execSync('whoami')
      : execSync('id -u').toString().trim() +
        ':' +
        execSync('id -g').toString().trim()

  // Command
  const run = spawn(
    'docker',
    [
      'run',
      '--platform=linux/amd64',
      '--name=' + containerName,
      '--volume=' + bindPath + ':/workingPath',
      dockerVersion === 'engine' ? '--user=' + user : '',
      '-w=/workingPath',
      'tanatloc/worker:latest',
      '/bin/bash',
      '-c',
      command
    ].filter((a) => a)
  )

  run.on('close', () => {
    try {
      execSync('docker stop ' + containerName)
      execSync('docker rm ' + containerName)
    } catch (err) {
      console.error(err)
    }
  })

  return run
}

export default docker
