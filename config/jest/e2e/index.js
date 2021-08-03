// Env
process.env.DB_DATABASE = 'tanatloc_test'
process.env.STORAGE_PATH = '/tmp/tanatloc_test'

// Install
const createDatabase = require('install/dB')
const createPath = require('install/storage')

module.exports = async () => {
  await createDatabase()
  await createPath()
}
