/** @module Install */

import isElectron from 'is-electron'

import { createDatabase } from './createDatabase'
import { createPaths } from './createPaths'
import { copyAssets } from './copyAssets'

/**
 * Main
 */
const main = async (): Promise<void> => {
  console.info('/__   \\__ _ _ __   __ _| |_| | ___   ___ ')
  console.info("  / /\\/ _` | '_ \\ / _` | __| |/ _ \\ / __|")
  console.info(' / / | (_| | | | | (_| | |_| | (_) | (__ ')
  console.info(' \\/   \\__,_|_| |_|\\__,_|\\__|_|\\___/ \\___|')
  global.initialization = {
    plugins: true,
    templates: true
  }
  if (!isElectron()) await copyAssets()
  if (!process.env.CI) {
    await createDatabase()
    await createPaths()
  }
}

main()
  .then(() => console.info('End.'))
  .catch((err) => console.error(err))
