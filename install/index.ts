/** @module Install */

import isElectron from 'is-electron'

import { createDatabase } from './createDatabase'
import { createPaths } from './createPaths'
import { copyAssets } from './copyAssets'

/**
 * Main
 */
const main = async (
  status?: string[],
  setStatus?: (status: string[]) => Promise<void>
): Promise<void> => {
  console.info('/__   \\__ _ _ __   __ _| |_| | ___   ___ ')
  console.info("  / /\\/ _` | '_ \\ / _` | __| |/ _ \\ / __|")
  console.info(' / / | (_| | | | | (_| | |_| | (_) | (__ ')
  console.info(' \\/   \\__,_|_| |_|\\__,_|\\__|_|\\___/ \\___|')

  status?.push('Start installation')
  await setStatus?.(status!)

  if (!isElectron()) await copyAssets()
  if (!process.env.CI) {
    status?.push('Create database')
    await setStatus?.(status!)
    await createDatabase()

    status?.push('Create paths')
    await setStatus?.(status!)
    await createPaths()
  }
}

if (!isElectron())
  main()
    .then(() => console.info('End.'))
    .catch((err) => console.error(err))

export default main
