/** @module install */

const createDatabase = require('./dB')
const createPaths = require('./storage')

/**
 * Main
 */
const main = async () => {
  await createDatabase()
  await createPaths()
}

main()
