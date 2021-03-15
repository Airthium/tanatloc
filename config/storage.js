/** @module config/storage */

const path = require('path')
const os = require('os')

const defaultStorage = path.join(os.homedir(), 'tanatloc')

if (!process.env.STORAGE_PATH)
  console.warn(
    ' ⚠ No storage path configured, use default one in: ' + defaultStorage
  )

const storagePath = process.env.STORAGE_PATH || defaultStorage

module.exports = {
  STORAGE: storagePath,
  AVATAR: path.join(storagePath, process.env.AVATAR_RELATIVE_PATH || 'avatar'),
  SIMULATION: path.join(
    storagePath,
    process.env.SIMULATION_RELATIVE_PATH || 'simulation'
  )
}
