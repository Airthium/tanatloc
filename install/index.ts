/** @module Install */

import isElectron from 'is-electron'
import isDocker from 'is-docker'
import { execSync } from 'child_process'

import packageJson from '../package.json' assert { type: 'json' }

import { createDatabase } from './createDatabase'
import { createPaths } from './createPaths'
import { copyAssets } from './copyAssets'

export interface IParams {
  addStatus: (status: string) => Promise<void>
}

/**
 * Init dockers
 */
export const initDockers = async (params?: {
  addStatus: (status: string) => Promise<void>
}): Promise<void> => {
  // tanatloc/worker
  try {
    await params?.addStatus('Updating tanatloc/worker')
    console.info('Updating tanatloc/worker')
    execSync('docker pull tanatloc/worker')
  } catch (err) {}

  // postgres
  try {
    execSync('docker image inspect postgres:15')
  } catch (err) {
    await params?.addStatus('Pulling postgres 15')
    console.info('Pulling postgres 15')
    execSync('docker pull postgres:15')
  }
}

/**
 * Main
 */
const main = async (params?: IParams): Promise<void> => {
  console.info('')
  console.info(
    '████████  █████  ███    ██  █████  ████████ ██       ██████   ██████'
  )
  console.info(
    '   ██    ██   ██ ████   ██ ██   ██    ██    ██      ██    ██ ██     '
  )
  console.info(
    '   ██    ███████ ██ ██  ██ ███████    ██    ██      ██    ██ ██     '
  )
  console.info(
    '   ██    ██   ██ ██  ██ ██ ██   ██    ██    ██      ██    ██ ██     '
  )
  console.info(
    '   ██    ██   ██ ██   ████ ██   ██    ██    ███████  ██████   ██████'
  )
  console.info('   version:', packageJson.version)
  console.info('')

  await params?.addStatus('Starting installation')

  if (!isElectron()) await copyAssets()
  if (!process.env.CI && process.env.NEXT_PUBLIC_SERVER_MODE !== 'frontpage') {
    if (!isDocker()) {
      await params?.addStatus('Initializing dockers')
      await initDockers(params)
    }

    await params?.addStatus('Initializing database')
    await createDatabase()

    await params?.addStatus('Initializing paths')
    await createPaths()
  }
}

if (!isElectron())
  main()
    .then(() => console.info('End.'))
    .catch((err) => console.error(err))

export default main
