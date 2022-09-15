/** @module Install */

import isElectron from 'is-electron'

import { createDatabase } from './createDatabase'
import { createPaths } from './createPaths'
import { copyAssets } from './copyAssets'

export interface IParams {
  addStatus: (status: string) => Promise<void>
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
    await params?.addStatus('Create database')
    createDatabase()

    await params?.addStatus('Create paths')
    createPaths()
  }
}

if (!isElectron())
  main()
    .then(() => console.info('End.'))
    .catch((err) => console.error(err))

export default main
