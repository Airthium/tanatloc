/** @module config/storage */

const path = require('path')
const os = require('os')

// DEFAULT STORAGE
const DEFAULT_STORAGE = path.join(os.homedir(), 'tanatloc')

// STORAGE CHECK
if (!process.env.STORAGE_PATH)
  console.warn(
    ' ⚠ No storage path configured, use default one in: ' + DEFAULT_STORAGE
  )

// STORAGE
const STORAGE = process.env.STORAGE_PATH || DEFAULT_STORAGE

// AVATAR
const AVATAR = path.join(STORAGE, process.env.AVATAR_RELATIVE_PATH || 'avatar')

// GEOMETRY
const GEOMETRY = path.join(
  STORAGE,
  process.env.GEOMETRY_RELATIVE_PATH || 'geometry'
)

// SIMULATION
const SIMULATION = path.join(
  STORAGE,
  process.env.SIMULATION_RELATIVE_PATH || 'simulation'
)

module.exports = {
  STORAGE,
  AVATAR,
  GEOMETRY,
  SIMULATION
}
