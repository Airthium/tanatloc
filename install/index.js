/** @module install */

const createTables = require('./dB')
const createPaths = require('./storage')

/**
 * Main
 */
const main = async () => {
  await createTables()
  await createPaths()
}

main()
