/** @module Install */

import isElectron from 'is-electron'
import isDocker from 'is-docker'
import { execSync } from 'child_process'

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
    execSync('docker pull tanatloc/worker')
  } catch (err) {}

  // postgres
  try {
    execSync('docker image inspect postgres')
  } catch (err) {
    await params?.addStatus('Pulling postgres')
    execSync('docker pull postgres:14')
  }
}

/**
 * Main
 */
const main = async (params?: IParams): Promise<void> => {
  console.info('/__   \\__ _ _ __   __ _| |_| | ___   ___ ')
  console.info("  / /\\/ _` | '_ \\ / _` | __| |/ _ \\ / __|")
  console.info(' / / | (_| | | | | (_| | |_| | (_) | (__ ')
  console.info(' \\/   \\__,_|_| |_|\\__,_|\\__|_|\\___/ \\___|')

  await params?.addStatus('Starting installation')

  if (!isElectron()) await copyAssets()
  if (!process.env.CI) {
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
