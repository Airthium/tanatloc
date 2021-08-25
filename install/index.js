/** @module install */

import createDatabase from './dB'
import update from './update'
import createPaths from './storage'

/**
 * Main
 */
const main = async () => {
  console.info('/__   \\__ _ _ __   __ _| |_| | ___   ___ ')
  console.info("  / /\\/ _` | '_ \\ / _` | __| |/ _ \\ / __|")
  console.info(' / / | (_| | | | | (_| | |_| | (_) | (__ ')
  console.info(' \\/   \\__,_|_| |_|\\__,_|\\__|_|\\___/ \\___|')
  await createDatabase()
  await update()
  await createPaths()
}

main()
