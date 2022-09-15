/** @module Install */

import isElectron from 'is-electron'
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
    execSync('docker image inspect tanatloc/worker')
  } catch (err) {
    await params?.addStatus('Pulling tanatloc/worker')
    execSync('docker pull tanatloc/worker')
  }

  // postgres
  try {
    execSync('docker image inspect postgres')
  } catch (err) {
    await params?.addStatus('Pulling postgres')
    execSync('docker pull postgres')
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

  await params?.addStatus('Start installation')

  if (!isElectron()) await copyAssets()
  if (!process.env.CI) {
    await params?.addStatus('Initialize dockers')
    await initDockers(params)

    await params?.addStatus('Create database')
    await createDatabase()

    await params?.addStatus('Create paths')
    await createPaths()
  }
}

if (!isElectron())
  main()
    .then(() => console.info('End.'))
    .catch((err) => console.error(err))

export default main
