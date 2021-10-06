/** @namespace Config.Storage */

const path = require('path')
const os = require('os')

/**
 * Default storage path
 * @memberof Config.Storage
 * @description Set as `${HOME}/tanatloc`
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
 * @description Set by `STORAGE_PATH` environment variable ot `DEFAULT_STORAGE`
 */
const STORAGE = process.env.STORAGE_PATH || DEFAULT_STORAGE

/**
 * Avatar relative path
 * @memberof Config.Storage
 * @description Set by `AVATAR_RELATIVE_PATH` environment variable ot `avatar`
 */
const AVATAR = path.join(STORAGE, process.env.AVATAR_RELATIVE_PATH || 'avatar')

/**
 * Geometry relative path
 * @memberof Config.Storage
 * @description Set by `GEOMETRY_RELATIVE_PATH` environment variable ot `geometry`
 */
const GEOMETRY = path.join(
  STORAGE,
  process.env.GEOMETRY_RELATIVE_PATH || 'geometry'
)

/**
 * Simulation relative path
 * @memberof Config.Storage
 * @description Set by `SIMULATION_RELATIVE_PATH` environment variable ot `simulation`
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
