/** @namespace Config.Storage */

const path = require('path')
const os = require('os')

/**
 * Default storage path
 * @memberof Config.Storage
 */
const DEFAULT_STORAGE = path.join(os.homedir(), 'tanatloc')

// STORAGE CHECK
if (!process.env.STORAGE_PATH)
  console.warn(
    ' ⚠ No storage path configured, use default one in: ' + DEFAULT_STORAGE
  )

/**
 * Storage path
 * @memberof Config.Storage
 */
const STORAGE = process.env.STORAGE_PATH || DEFAULT_STORAGE

/**
 * Avatar relative path
 * @memberof Config.Storage
 */
const AVATAR = path.join(STORAGE, process.env.AVATAR_RELATIVE_PATH || 'avatar')

/**
 * Geometry relative path
 * @memberof Config.Storage
 */
const GEOMETRY = path.join(
  STORAGE,
  process.env.GEOMETRY_RELATIVE_PATH || 'geometry'
)

/**
 * Simulation relative path
 * @memberof Config.Storage
 */
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
