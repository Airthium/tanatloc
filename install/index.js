/** @module install */

import createDatabase from './dB'
import createPaths from './storage'

/**
 * Main
 */
const main = async () => {
  await createDatabase()
  await createPaths()
}

main()
