/** @module install */

import createDatabase from './dB'
import update from './update'
import createPaths from './storage'

/**
 * Main
 */
const main = async () => {
  await createDatabase()
  await update()
  await createPaths()
}

main()
